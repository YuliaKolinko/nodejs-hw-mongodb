import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  phoneNumber: Joi.string().required().min(10).max(15),
  contactType: Joi.string().valid('personal', 'home', 'work').required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
});

// PATCH
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string().min(10).max(15),
  contactType: Joi.string().valid('personal', 'home', 'work'),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
}).min(1);
