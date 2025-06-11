import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    }),
  firstName: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required',
    }),
  lastName: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required',
    }),
  liskAddress: Joi.string()
    .pattern(/^lsk[a-zA-Z0-9]{38}$/)
    .messages({
      'string.pattern.base': 'Invalid Lisk address format. Must start with "lsk" and be 41 characters long',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

export const googleAuthSchema = Joi.object({
  googleId: Joi.string().required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  profilePicture: Joi.string().uri().optional(),
});

export const updateLiskAddressSchema = Joi.object({
  liskAddress: Joi.string()
    .required()
    .pattern(/^lsk[a-zA-Z0-9]{38}$/)
    .messages({
      'string.pattern.base': 'Invalid Lisk address format. Must start with "lsk" and be 41 characters long',
      'any.required': 'Lisk address is required',
    }),
});