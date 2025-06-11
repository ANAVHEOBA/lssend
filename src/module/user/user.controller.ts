import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../../config/app.config';
import { AppError } from '../../middleware/error.middleware';
import { User } from './user.model';
import {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  updateUser,
  deleteUser,
  comparePassword,
} from './user.crud';

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const signToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: '7d' // Hardcoded value since config.jwt.expiresIn is causing type issues
  };
  
  return jwt.sign({ id }, config.jwt.secret, options);
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return next(new AppError('Email already in use', 400));
      }

      // Create user
      const user = await createUser({
        email,
        password,
        firstName,
        lastName,
      });

      createSendToken(user, 201, res);
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await findUserByEmail(email);
      if (!user || !user.password) {
        return next(new AppError('Invalid email or password', 401));
      }

      // Check if password is correct
      const isPasswordCorrect = await comparePassword(password, user.password);
      if (!isPasswordCorrect) {
        return next(new AppError('Invalid email or password', 401));
      }

      createSendToken(user, 200, res);
    } catch (error) {
      next(error);
    }
  },

  googleAuth: async (req: Request, res: Response, next: NextFunction) => {
    // This will be implemented with Google OAuth
    res.status(501).json({
      status: 'error',
      message: 'Google authentication not implemented yet',
    });
  },

  googleCallback: async (req: Request, res: Response, next: NextFunction) => {
    // This will be implemented with Google OAuth
    res.status(501).json({
      status: 'error',
      message: 'Google callback not implemented yet',
    });
  },

  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await findUserById(req.user.id);
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  updateMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, role, ...updateData } = req.body;

      // Don't allow password updates here
      if (password) {
        return next(
          new AppError(
            'This route is not for password updates. Please use /update-password',
            400
          )
        );
      }

      const user = await updateUser(req.user.id, updateData);
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  deleteMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteUser(req.user.id);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find();
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await findUserById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await updateUser(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteUser(req.params.id);
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
