import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import {
  adminNoteRouter,
  noteRouter
} from "./modules/notes/note.routes.js";
import {
  adminSubjectRouter,
  subjectRouter
} from "./modules/subjects/subject.routes.js";
import {
  errorHandler,
  notFound
} from "./shared/middlewares/error.middleware.js";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: env.clientUrl.split(",").map((url) => url.trim()),
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillNest API is healthy"
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/admin", adminSubjectRouter);
app.use("/api/v1/admin", adminNoteRouter);

app.use(notFound);
app.use(errorHandler);
