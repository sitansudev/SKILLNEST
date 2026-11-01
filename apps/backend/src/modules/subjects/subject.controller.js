import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as subjectService from "./subject.service.js";
import {
  createChapterSchema,
  createSubjectSchema
} from "./subject.validation.js";

export const listSubjects = asyncHandler(async (req, res) => {
  const subjects = await subjectService.listSubjects();

  res.status(200).json({
    success: true,
    data: { subjects }
  });
});

export const getChaptersBySubjectSlug = asyncHandler(async (req, res) => {
  const subject = await subjectService.getChaptersBySubjectSlug(req.params.slug);

  res.status(200).json({
    success: true,
    data: { subject }
  });
});

export const createSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.createSubject(createSubjectSchema.parse(req.body));

  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    data: { subject }
  });
});

export const createChapter = asyncHandler(async (req, res) => {
  const chapter = await subjectService.createChapter(
    req.params.subjectId,
    createChapterSchema.parse(req.body)
  );

  res.status(201).json({
    success: true,
    message: "Chapter created successfully",
    data: { chapter }
  });
});
