import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });