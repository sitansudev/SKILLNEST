import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens");

export const createSubjectSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: slugSchema.optional()
});

export const createChapterSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: slugSchema.optional()
});
