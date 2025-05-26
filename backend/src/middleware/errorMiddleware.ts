import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("-----Error Middleware-----");
  console.error("Error name", error.name);
  console.error("Error message", error.message);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    message: "Internal server error",
    stack: process.env.NODE_ENV === "development" ? error.stack : "",
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const originalRequest = req.originalUrl;
  return res
    .status(404)
    .json({ message: `Resource not found at ${originalRequest}` });
};
