import { Router } from "express";
import * as subjectController from "./subject.controller.js";
import {
  authenticate,
  authorize
} from "../../shared/middlewares/auth.middleware.js";

export const subjectRouter = Router();
export const adminSubjectRouter = Router();

subjectRouter.get("/", subjectController.listSubjects);
subjectRouter.get("/:slug/chapters", subjectController.getChaptersBySubjectSlug);

adminSubjectRouter.post(
  "/subjects",
  authenticate,
  authorize("ADMIN"),
  subjectController.createSubject
);

adminSubjectRouter.post(
  "/subjects/:subjectId/chapters",
  authenticate,
  authorize("ADMIN"),
  subjectController.createChapter
);
