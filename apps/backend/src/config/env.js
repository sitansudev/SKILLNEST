import "dotenv/config";

const requiredVariables = ["DATABASE_URL", "JWT_SECRET"];

for (const variableName of requiredVariables) {
  if (!process.env[variableName]) {
    throw new Error(`${variableName} is required in .env`);
  }
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5001),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d"
};
