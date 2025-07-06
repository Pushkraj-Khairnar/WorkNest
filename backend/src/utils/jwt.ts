import jwt from 'jsonwebtoken';
import { config } from '../config/app.config';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.SESSION_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.SESSION_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}; 