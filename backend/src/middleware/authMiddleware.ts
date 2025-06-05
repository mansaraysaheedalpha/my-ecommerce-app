// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import User, { IUser } from '../models/UserModel'; // Adjust path if necessary

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return; // Exit if no token
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("FATAL ERROR: JWT_SECRET is not defined for token verification.");
    return next(new Error("Server configuration error: JWT_SECRET missing"));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload & { userId: string };

    if (!decoded.userId || typeof decoded.userId !== 'string') {
      res.status(401).json({ message: 'Not authorized, token payload invalid' });
      return;
    }

    const foundUser = await User.findById(decoded.userId).select('-passwordHash -refreshTokens');

    if (!foundUser) {
      res.status(401).json({ message: 'Not authorized, user for token not found' });
      return;
    }

    req.user = foundUser; // TypeScript should infer IUser from foundUser if model is typed
    next(); // Proceed to the protected route

  } catch (error: any) {
    let errorMessage = 'Not authorized, token failed';
    if (error instanceof TokenExpiredError) { // More specific error check
      errorMessage = 'Not authorized, token expired';
    } else if (error instanceof JsonWebTokenError) { // More specific error check
      errorMessage = 'Not authorized, token malformed or invalid';
    }
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: errorMessage });
  }
};