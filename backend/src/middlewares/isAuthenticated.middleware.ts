import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth check - User:', req.user);
  console.log('Auth check - Session:', req.session);
  console.log('Auth check - Cookies:', req.headers.cookie);
  
  if (!req.user || !req.user._id) {
    console.log('Auth failed - No user found');
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  
  console.log('Auth successful - User ID:', req.user._id);
  next();
};

export default isAuthenticated;
