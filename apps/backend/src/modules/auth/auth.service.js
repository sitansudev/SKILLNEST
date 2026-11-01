import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "../../database/prisma.js";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";
import { createAccessToken } from "../../shared/utils/jwt.js";

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function signup(input) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash
    }
  });

  return {
    user: publicUser(user),
    accessToken: createAccessToken(user)
  };
}

export async function login(input) {
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  });

  const passwordMatches = user
    ? await bcrypt.compare(input.password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("User account is unavailable", 403);
  }

  return {
    user: publicUser(user),
    accessToken: createAccessToken(user)
  };
}

export async function logout(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      tokenVersion: {
        increment: 1
      }
    }
  });
}

export async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordResetToken.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      tokenHash,
      expiresAt
    },
    update: {
      tokenHash,
      expiresAt
    }
  });

  if (env.nodeEnv !== "production") {
    console.log(
      `Password reset token for ${user.email}: ${rawToken}\n` +
      `Use POST /api/v1/auth/reset-password within 15 minutes.`
    );
  }

  // Production next step: send rawToken through Resend, SES, or another email provider.
}

export async function resetPassword(input) {
  const tokenHash = hashResetToken(input.token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash }
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    throw new AppError("Reset token is invalid or expired", 400);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        passwordHash,
        tokenVersion: {
          increment: 1
        }
      }
    }),
    prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    })
  ]);
}
