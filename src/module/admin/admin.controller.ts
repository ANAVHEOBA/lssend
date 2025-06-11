import { Request, Response, NextFunction } from 'express';
import { Admin } from './admin.model';
import { AppError } from '../../utils/helpers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export const adminController = {
  async initializeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        throw new AppError('Admin already exists', 400);
      }

      // Create new admin
      const admin = await Admin.create({
        email,
        password
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, role: 'admin' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(201).json({
        status: 'success',
        data: {
          admin: {
            id: admin._id,
            email: admin.email,
            role: admin.role
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Find admin and include password
      const admin = await Admin.findOne({ email }).select('+password');
      if (!admin) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if admin is active
      if (!admin.isActive) {
        throw new AppError('Account is deactivated', 401);
      }

      // Verify password
      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, role: 'admin' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(200).json({
        status: 'success',
        data: {
          admin: {
            id: admin._id,
            email: admin.email,
            role: admin.role,
            lastLogin: admin.lastLogin
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }
}; 