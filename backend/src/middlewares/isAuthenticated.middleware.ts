import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("=== Authentication Check ===");
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  console.log("Request headers:", {
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent']?.substring(0, 50),
    cookie: req.headers.cookie ? req.headers.cookie.substring(0, 100) + '...' : 'No cookies',
  });
  console.log("Session exists:", !!req.session);
  console.log("Session contents:", req.session);
  console.log("User exists:", !!req.user);
  console.log("User ID:", req.user?._id);
  console.log("Is Authenticated (passport):", req.isAuthenticated?.());
  console.log("================================");
  
  if (!req.user || !req.user._id) {
    console.log("Authentication failed - no user or user ID");
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  next();
};

export default isAuthenticated;
