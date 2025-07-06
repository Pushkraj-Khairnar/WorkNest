import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";
import { verifyToken } from "../utils/jwt";
import UserModel from "../models/user.model";

const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException("No token provided");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    
    if (!decoded) {
      throw new UnauthorizedException("Invalid token");
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default jwtAuth; 