import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        isAdmin: boolean;
      };
    }
  }
}

import express from "express";
import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "development"
    ? ".env.development"
    : ".env.production";

dotenv.config({ path: `${process.cwd()}/.env` });
dotenv.config({ path: `${process.cwd()}/${envFile}` });

import authRoutes from "./routes/authRoutes";
import videoRoutes from "./routes/videoRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import walletRoutes from "./routes/walletRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import { PrismaClient } from "@prisma/client";
import winston from "winston";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Logger configuration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/system.log" }),
  ],
});

// Middleware for logging HTTP requests
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
}

// Middleware for user-specific logging
app.use((req, res, next) => {
  const userId = req.user?.id || "anonymous";
  logger.info(`User ${userId} accessed ${req.method} ${req.url}`);
  next();
});

app.use(cookieParser());

// Middleware
app.use(express.json()); // Ensure this middleware is included

// CORS configuration
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000", // Added client origin
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting middleware
app.use(limiter);

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the backend application",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/auth", authRoutes);
app.use("/videos", videoRoutes);
app.use("/categories", categoryRoutes);
app.use("/wallet", walletRoutes);
app.use("/payments", paymentRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "The requested resource was not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
});

// Server Initialization
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
});
