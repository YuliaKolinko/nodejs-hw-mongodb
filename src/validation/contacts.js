import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  phoneNumber: Joi.string().required().min(10).max(15),
  contactType: Joi.string().valid('personal', 'home', 'work').required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  photo: Joi.any().optional(),
  parentId: Joi.string().custom((value, helpers) => {
    if (value && !isValidObjectId(value)) {
      return helpers.message('Parent id should be a valid mongo id');
    }
    return true;
  }),
});

// PATCH
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string().min(10).max(15),
  contactType: Joi.string().valid('personal', 'home', 'work'),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
}).min(1);
