//src/utils/helpers.ts
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

export const convertToMilliseconds = (timeStr: string): number => {
  const unit = timeStr.charAt(timeStr.length - 1);
  const value = parseInt(timeStr.slice(0, -1), 10);

  if (isNaN(value)) return 0;

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "m":
      return value * 60 * 1000;
    case "s":
      return value * 1000;
    default:
      return 0;
  }
};
