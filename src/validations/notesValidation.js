import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value)
    ? helpers.message('Invalid id format') : value;
};


export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().
      integer().
      min(1).
      default(1).
      required().
      messages({
      "number.base": "Page must be a number",
      "number.min": "Page must be at least {#limit}",
      "number.max": "Page must be at most {#limit}",
      "any.required": "Page is required",
    }),
    perPage: Joi.number().integer().min(5).max(10).required().messages({
      "number.base": "PerPage must be a number",
      "number.min": "PerPage must be at least {#limit}",
      "number.max": "PerPage must be at most {#limit}",
      "any.required": "PerPage is required",
    }),
    tag: Joi.string().valid(...TAGS).required().messages({
      "any.only": "Tag must be one of the allowed values",
      "any.required": "Tag is required",
    }),
    search: Joi.string().optional().allow(''),
  }),
};
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      "string.base": "Note ID must be a valid ObjectID",
      "any.required": "Note ID is required",
    }),
  })
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(1).required().messages({
      "string.base": "title must be a string",
      "string.empty": "title cannot be empty",
      "any.required": "title is required",
    }),
    content: Joi.string().optional().allow('').messages({
      "string.base": "content must be a string",
    }),
    tag: Joi.string().valid(...TAGS).required().messages({
      "any.only": "Tag must be one of the allowed values",
      "any.required": "Tag is required",
    })
  })

  };

export const updateNoteSchema = {
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(1).optional().messages({
      "string.base": "title must be a string",
    }),
    content: Joi.string().optional().allow('').messages({
      "string.base": "content must be a string",
    }),
    tag: Joi.string().valid(...TAGS).optional().messages({
      "any.only": "Tag must be one of the allowed values",
    })
  })
};
