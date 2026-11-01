import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().max(5000).optional(),
  subjectId: z.string().min(1, "subjectId is required"),
  chapterId: z.string().min(1, "chapterId is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT")
});

export const updateNoteStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
});
