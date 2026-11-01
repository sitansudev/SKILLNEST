import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as noteService from "./note.service.js";
import {
  createNoteSchema,
  updateNoteStatusSchema
} from "./note.validation.js";

export const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(
    createNoteSchema.parse(req.body),
    req.file
  );

  res.status(201).json({
    success: true,
    message: "Note uploaded successfully",
    data: { note }
  });
});

export const listNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.listPublishedNotes({
    subjectId: req.query.subjectId,
    chapterId: req.query.chapterId
  });

  res.status(200).json({
    success: true,
    data: { notes }
  });
});

export const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getPublishedNote(req.params.noteId);

  res.status(200).json({
    success: true,
    data: { note }
  });
});

export const updateNoteStatus = asyncHandler(async (req, res) => {
  const { status } = updateNoteStatusSchema.parse(req.body);
  const note = await noteService.updateNoteStatus(req.params.noteId, status);

  res.status(200).json({
    success: true,
    message: "Note status updated successfully",
    data: { note }
  });
});

export const saveNote = asyncHandler(async (req, res) => {
  await noteService.saveNote(req.user.id, req.params.noteId);

  res.status(201).json({
    success: true,
    message: "Note saved successfully"
  });
});

export const unsaveNote = asyncHandler(async (req, res) => {
  await noteService.unsaveNote(req.user.id, req.params.noteId);

  res.status(204).send();
});

export const listSavedNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.listSavedNotes(req.user.id);

  res.status(200).json({
    success: true,
    data: { notes }
  });
});
