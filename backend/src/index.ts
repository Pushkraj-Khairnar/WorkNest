import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import jwtAuth from "./middlewares/jwtAuth.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: "none",
    domain: undefined, // Let the browser set the domain automatically
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // If FRONTEND_ORIGIN is set to wildcard, allow all origins
      if (config.FRONTEND_ORIGIN === '*') {
        return callback(null, true);
      }
      
      // Check if origin is in the allowed list
      const allowedOrigins = config.FRONTEND_ORIGIN.includes(',') 
        ? config.FRONTEND_ORIGIN.split(',').map(origin => origin.trim())
        : [config.FRONTEND_ORIGIN];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // For development, allow localhost
      if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
        return callback(null, true);
      }
      
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPSTATUS.OK).json({
      message: "Server is running",
      basePath: BASE_PATH,
      routes: {
        auth: `${BASE_PATH}/auth`,
        register: `${BASE_PATH}/auth/register`,
        login: `${BASE_PATH}/auth/login`
      }
    });
  })
);

// Test endpoint to check session
app.get(
  `/test-session`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPSTATUS.OK).json({
      message: "Session test",
      session: req.session,
      user: req.user,
      cookies: req.headers.cookie,
      sessionID: (req.session as any).id
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, jwtAuth, userRoutes);
app.use(`${BASE_PATH}/workspace`, jwtAuth, workspaceRoutes);
app.use(`${BASE_PATH}/member`, jwtAuth, memberRoutes);
app.use(`${BASE_PATH}/project`, jwtAuth, projectRoutes);
app.use(`${BASE_PATH}/task`, jwtAuth, taskRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
