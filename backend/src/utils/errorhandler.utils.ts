import { Response } from "express";
export const getValidationErrorMessages = (error: any, res: Response) => {
  if (error.name === "ValidationError") {
    let validationError: { [key: string]: string } = {};
    Object.keys(error.errors).forEach((key) => {
      validationError[key] = error.errors[key].message;
    });
    res.status(400).json({
      message: "Validation failed. Please check your data",
      errors: validationError,
    });
    return true;
  }
  return false;
};
