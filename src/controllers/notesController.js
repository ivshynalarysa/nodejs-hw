import  createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// Отримати список усіх нотаток
export const getAllNotes = async (req, res) => {


  // Отримуємо параметри пагінації
  // і задаємо дефолтні значення
  const { page = 1, perPage = 15 } = req.query;

  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const notesQuery = Note.find();

 // Будуємо фільтр
  if (req.query.tag) {
    notesQuery.where({ tag: req.query.tag });
  }
  if (req.query.search) {
    notesQuery.where({
      $or: [
        { title: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },

      ],
    });
  }


  // Виконуємо одразу два запити паралельно
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

	// Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
   throw  createHttpError(404, 'Note not found');
  }

  res.status(200).json( note);
};

//create new note
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json( note );
};

// delete note by Id
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });

  if (!note) {
    throw  createHttpError(404, 'Note not found');
  }

  res.status(200).json( note );
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

  res.status(200).json( note );
};

