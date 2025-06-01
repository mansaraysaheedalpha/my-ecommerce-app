// SaloneAmazon/backend/src/utils/generateToken.ts
import jwt from "jsonwebtoken";
// No need to import SignOptions if we are careful, but it doesn't hurt
// import type { SignOptions } from 'jsonwebtoken';

export type TokenType = "access" | "refresh";

const generateToken = (userId: string, type: TokenType): string => {
  let currentSecret: string | undefined;
  let expiresInSeconds: number; // We will use a number for expiresIn

  if (type === "access") {
    currentSecret = process.env.JWT_SECRET;
    const expiresInStr = process.env.JWT_EXPIRES_IN || "1h"; // Default to "1h"
    if (expiresInStr.endsWith("h")) {
      expiresInSeconds = parseInt(expiresInStr, 10) * 60 * 60;
    } else if (expiresInStr.endsWith("d")) {
      expiresInSeconds = parseInt(expiresInStr, 10) * 24 * 60 * 60;
    } else if (expiresInStr.endsWith("m")) {
      expiresInSeconds = parseInt(expiresInStr, 10) * 60;
    } else {
      // Attempt to parse as seconds, or default if parsing fails or it's not a recognized format
      const parsedSeconds = parseInt(expiresInStr, 10);
      expiresInSeconds = isNaN(parsedSeconds) ? 3600 : parsedSeconds; // Default to 1 hour (3600s) if unparseable
    }
  } else {
    // type === 'refresh'
    currentSecret = process.env.JWT_REFRESH_SECRET;
    const expiresInStr = process.env.JWT_REFRESH_EXPIRES_IN || "7d"; // Default to "7d"
    if (expiresInStr.endsWith("h")) {
      expiresInSeconds = parseInt(expiresInStr, 10) * 60 * 60;
    } else if (expiresInStr.endsWith("d")) {
      expiresInSeconds = parseInt(expiresInStr, 10) * 24 * 60 * 60;
    } else if (expiresInStr.endsWith("m")) {
      expiresInSeconds = parseInt(expiresInStr, 10) * 60;
    } else {
      const parsedSeconds = parseInt(expiresInStr, 10);
      expiresInSeconds = isNaN(parsedSeconds)
        ? 7 * 24 * 60 * 60
        : parsedSeconds; // Default to 7 days if unparseable
    }
  }

  if (!currentSecret) {
    const secretName = type === "access" ? "JWT_SECRET" : "JWT_REFRESH_SECRET";
    console.error(`FATAL ERROR: ${secretName} is not defined in .env file.`);
    throw new Error(`Server configuration error: ${secretName} is missing.`);
  }

  const payload = {
    userId: userId,
  };

  const options: jwt.SignOptions = {
    // Explicitly using SignOptions can help
    expiresIn: expiresInSeconds, // Now always a number
  };

  return jwt.sign(payload, currentSecret, options);
};

export default generateToken;
