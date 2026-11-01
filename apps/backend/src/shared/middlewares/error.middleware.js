import multer from "multer";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let details = error.details;

  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = error.flatten();
  }

  if (error instanceof multer.MulterError) {
    statusCode = 400;
    message =
      error.code === "LIMIT_FILE_SIZE"
        ? "PDF file must be 20 MB or smaller"
        : error.message;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
    details = undefined;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {})
  });
}
