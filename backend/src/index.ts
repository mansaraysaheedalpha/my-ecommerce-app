//src/index.ts
import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import { errorMiddleware, notFound } from "./middleware/errorMiddleware";

connectDB();
const app: Application = express();
const PORT = process.env.PORT || "3000";

// ---Request configuration middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many attempts. Please try again after 15 minutes",
  },
});

//admin rate Limit
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  message: "Too many admin requests"
})

// ----Requests Routes----
app.use("/api/products", productRoutes);
app.use("/api/auth", authLimit, authRoutes)
// ----End Requests Routes-----



//------Error Middleware----
import { NextFunction } from "express";

app.use(notFound as (req: Request, res: Response, next: NextFunction) => void);
app.use(
  errorMiddleware as (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

//----End Error Middleware-----

app.listen(PORT, () => {
  console.log(`🚀Server running at http://localhost:${PORT}`);
});
