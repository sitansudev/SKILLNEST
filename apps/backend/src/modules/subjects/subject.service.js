import { prisma } from "../../database/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listSubjects() {
  return prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: {
      chapters: {
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true }
      }
    }
  });
}

export async function getChaptersBySubjectSlug(slug) {
  const subject = await prisma.subject.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      chapters: {
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true }
      }
    }
  });

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return subject;
}

export async function createSubject(input) {
  return prisma.subject.create({
    data: {
      name: input.name,
      slug: input.slug || slugify(input.name)
    }
  });
}

export async function createChapter(subjectId, input) {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { id: true }
  });

  if (!subject) {
    throw new AppError("Subject not found", 404);
  }

  return prisma.chapter.create({
    data: {
      name: input.name,
      slug: input.slug || slugify(input.name),
      subjectId
    }
  });
}
