import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
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
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import invitationRoutes from "./routes/invitation.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// CORS should be before session middleware
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

// Parse session duration (supports formats like "24h", "1440m", or milliseconds)
const parseSessionDuration = (duration: string): number => {
  if (!duration) return 24 * 60 * 60 * 1000; // default 24 hours
  
  const match = duration.match(/^(\d+)(h|m|s|d)?$/);
  if (!match) return parseInt(duration) || 24 * 60 * 60 * 1000;
  
  const [, value, unit] = match;
  const num = parseInt(value);
  
  switch (unit) {
    case 'd': return num * 24 * 60 * 60 * 1000;
    case 'h': return num * 60 * 60 * 1000;
    case 'm': return num * 60 * 1000;
    case 's': return num * 1000;
    default: return num; // assume milliseconds
  }
};

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: config.NODE_ENV === "production", // Only send over HTTPS in production
      httpOnly: true, // Prevent XSS attacks
      maxAge: parseSessionDuration(config.SESSION_EXPIRES_IN),
      sameSite: config.NODE_ENV === "production" ? "none" : "lax", // Required for cross-origin
    },
    name: "worknest.sid", // Custom session name
  })
);

// Add session debugging middleware
app.use((req: any, res: any, next: any) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Session ID:", req.sessionID || "No session ID");
  console.log("Session object exists:", !!req.session);
  if (req.session) {
    console.log("Session data:", JSON.stringify(req.session, null, 2));
  }
  console.log("Cookies:", req.headers.cookie || "No cookies");
  console.log("---");
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint for Render
app.get(`${BASE_PATH}/health`, (req: Request, res: Response) => {
  res.status(HTTPSTATUS.OK).json({
    status: "OK",
    message: "WorkNest Backend is running",
    timestamp: new Date().toISOString(),
  });
});

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPSTATUS.OK).json({
      message: "WorkNest API - Welcome to the backend",
      version: "1.0.0",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, userRoutes); // Remove isAuthenticated from here
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);
app.use(`${BASE_PATH}/invitation`, isAuthenticated, invitationRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
