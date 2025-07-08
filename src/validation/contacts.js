import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  phoneNumber: Joi.string().required().min(10).max(15),
  contactType: Joi.string().valid('personal', 'home').required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
});
