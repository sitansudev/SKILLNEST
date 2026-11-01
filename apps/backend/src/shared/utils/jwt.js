import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn
    }
  );
}
