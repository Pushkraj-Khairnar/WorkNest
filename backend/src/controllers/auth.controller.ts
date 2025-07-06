import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService, verifyUserService } from "../services/auth.service";
import { generateToken } from "../utils/jwt";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    );
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('Login attempt for email:', req.body.email);
    
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
          message: "Email and password are required",
        });
      }

      const user = await verifyUserService({ email, password });
      const token = generateToken((user as any)._id.toString());

      console.log('Login successful, user:', user._id);

      return res.status(HTTPSTATUS.OK).json({
        message: "Logged in successfully",
        user,
        token,
      });
    } catch (error: any) {
      console.log('Login error:', error.message);
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: error.message || "Invalid email or password",
      });
    }
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to log out" });
      }
    });

    req.session = null;
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);
