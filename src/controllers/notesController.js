import { createHttpError } from 'http-errors';
import { Note } from '../models/note.js';

// Отримати список усіх нотаток
export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json({ notes });
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
   throw new createHttpError(404, 'Note not found');
  }

  res.status(200).json( note);
};

//create new note
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json({ note });
};

// delete note by Id
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });

  if (!note) {
    throw new createHttpError(404, 'Note not found');
  }

  res.status(200).json( note, { message: 'Note deleted successfully' });
};

//update note by Id
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // find by id
    req.body,
    { returnDocument: "after" }
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json({ note });
};

