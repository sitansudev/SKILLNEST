import { prisma } from "../../database/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";

async function ensureChapterBelongsToSubject(subjectId, chapterId) {
  const chapter = await prisma.chapter.findFirst({
    where: {
      id: chapterId,
      subjectId
    },
    select: { id: true }
  });

  if (!chapter) {
    throw new AppError("Chapter does not belong to the selected subject", 400);
  }
}

export async function createNote(input, file) {
  if (!file) {
    throw new AppError("A PDF file is required", 400);
  }

  await ensureChapterBelongsToSubject(input.subjectId, input.chapterId);

  return prisma.note.create({
    data: {
      title: input.title,
      description: input.description || null,
      fileUrl: `/uploads/notes/${file.filename}`,
      fileName: file.originalname,
      status: input.status,
      subjectId: input.subjectId,
      chapterId: input.chapterId
    },
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      chapter: { select: { id: true, name: true, slug: true } }
    }
  });
}

export async function listPublishedNotes({ subjectId, chapterId }) {
  return prisma.note.findMany({
    where: {
      status: "PUBLISHED",
      ...(subjectId ? { subjectId } : {}),
      ...(chapterId ? { chapterId } : {})
    },
    orderBy: { createdAt: "desc" },
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      chapter: { select: { id: true, name: true, slug: true } }
    }
  });
}

export async function getPublishedNote(noteId) {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      status: "PUBLISHED"
    },
    include: {
      subject: { select: { id: true, name: true, slug: true } },
      chapter: { select: { id: true, name: true, slug: true } }
    }
  });

  if (!note) {
    throw new AppError("Note not found", 404);
  }

  return note;
}

export async function updateNoteStatus(noteId, status) {
  const note = await prisma.note.update({
    where: { id: noteId },
    data: { status }
  });

  return note;
}

export async function saveNote(userId, noteId) {
  await getPublishedNote(noteId);

  await prisma.savedNote.upsert({
    where: {
      userId_noteId: {
        userId,
        noteId
      }
    },
    create: { userId, noteId },
    update: {}
  });
}

export async function unsaveNote(userId, noteId) {
  await prisma.savedNote.deleteMany({
    where: { userId, noteId }
  });
}

export async function listSavedNotes(userId) {
  const savedNotes = await prisma.savedNote.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      note: {
        include: {
          subject: { select: { id: true, name: true, slug: true } },
          chapter: { select: { id: true, name: true, slug: true } }
        }
      }
    }
  });

  return savedNotes
    .filter((savedNote) => savedNote.note.status === "PUBLISHED")
    .map((savedNote) => savedNote.note);
}
