import { Request, Response, NextFunction } from "express";
import { any, AnyZodObject, ZodError } from "zod";

export const validateBody =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          message: err.message,
          path: err.path.join("."),
        }));
        res.status(400).json({
          message: "Input validation failed. Please check your data",
          errors: formattedErrors,
        });
        return;
      }
      console.error(
        "Unexpected error occured in validation middlware",
        error.message || error
      );
      next(error);
    }
  };

/**
 * Middleware to validate URL parameters (req.params) against a Zod schema.
 * @param schema - The Zod schema to validate req.params against.
 */

export const validateParams =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          message: err.message,
          path: err.path.join("."),
        }));
        res.status(400).json({
          message: "Input validation failed. Please check your",
          errors: formattedErrors,
        });
        return;
      }
      console.error(
        "Unexpected error occured in validation middlware",
        error.message || error
      );
      next(error);
    }
  };
