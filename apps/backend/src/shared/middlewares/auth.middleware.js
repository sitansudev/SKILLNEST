import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { prisma } from "../../database/prisma.js";
import { AppError } from "../errors/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  let payload;

  try {
    payload = jwt.verify(authorizationHeader.substring(7), env.jwtSecret);
  } catch {
    throw new AppError("Invalid or expired access token", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      tokenVersion: true
    }
  });

  if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
    throw new AppError("Invalid or expired access token", 401);
  }

  req.user = user;
  next();
});

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission for this action", 403));
    }

    next();
  };
}
