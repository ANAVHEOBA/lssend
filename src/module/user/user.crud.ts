import { User, IUser } from './user.model';
import { AppError } from '../../middleware/error.middleware';
import bcrypt from 'bcryptjs';

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = await User.create(userData);
  return user;
};

export const findUserById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

export const findUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
  return await User.findOne({ googleId });
};

export const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

export const deleteUser = async (id: string): Promise<void> => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
};

export const comparePassword = async (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> => {
  console.log('Comparing passwords...');
  console.log('Candidate password length:', candidatePassword.length);
  console.log('Stored password length:', userPassword.length);
  const result = await bcrypt.compare(candidatePassword, userPassword);
  console.log('Password comparison result:', result);
  return result;
};
