import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

import logger from "./utils/logger";

import authRoutes from "./routes/auth.routes";
import { seedAdminUser } from "./utils/seed-admin";
import { seedAll } from "./utils/seed-data";
import activityRoutes from "./routes/activity.routes";
import speciesRoutes from "./routes/species.routes";
import locationRoutes from "./routes/location.routes";
import participantRoutes from "./routes/participant.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import uploadRoutes from "./routes/upload.routes";
const app: Application = express();

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

app.use("/api", limiter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/species", speciesRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.stack);

  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

if (process.env.NODE_ENV !== "production") {
  seedAdminUser();
  seedAll().catch(console.error);
}

export default app;
