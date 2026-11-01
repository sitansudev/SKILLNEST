import { Router } from "express";
import * as noteController from "./note.controller.js";
import { uploadNotePdf } from "./note.upload.js";
import {
  authenticate,
  authorize
} from "../../shared/middlewares/auth.middleware.js";

export const noteRouter = Router();
export const adminNoteRouter = Router();

noteRouter.get("/me/saved", authenticate, noteController.listSavedNotes);
noteRouter.get("/", noteController.listNotes);
noteRouter.get("/:noteId", noteController.getNote);
noteRouter.post("/:noteId/save", authenticate, noteController.saveNote);
noteRouter.delete("/:noteId/save", authenticate, noteController.unsaveNote);

adminNoteRouter.post(
  "/notes",
  authenticate,
  authorize("ADMIN"),
  uploadNotePdf.single("file"),
  noteController.createNote
);

adminNoteRouter.patch(
  "/notes/:noteId/status",
  authenticate,
  authorize("ADMIN"),
  noteController.updateNoteStatus
);
