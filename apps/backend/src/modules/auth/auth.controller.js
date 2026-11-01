import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as authService from "./auth.service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema
} from "./auth.validation.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(signupSchema.parse(req.body));

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: result
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(loginSchema.parse(req.body));

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  res.status(204).send();
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);
  await authService.requestPasswordReset(email);

  res.status(200).json({
    success: true,
    message: "If that email belongs to an active account, a reset link has been sent."
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const data = resetPasswordSchema.parse(req.body);
  await authService.resetPassword(data);

  res.status(200).json({
    success: true,
    message: "Password reset successful. Please log in again."
  });
});
