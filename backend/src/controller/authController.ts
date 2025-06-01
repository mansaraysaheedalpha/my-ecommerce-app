//src/controller/authController
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/UserModel";
import generateToken from "../utils/generateToken";
import {
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
} from "../utils/validationSchemas";
import { getValidationErrorMessages } from "../utils/errorhandler.utils";

export const registerUser = async (
  req: Request<{}, {}, RegisterBodyType>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(409).json({ message: "user already exists" });
      return;
    }

    const userDocument = new User({
      name: name,
      email: email,
      passwordHash: password,

    });

    let newUser = await userDocument.save();

    const accessToken = generateToken(newUser._id.toString(), "access");
    const refreshToken = generateToken(newUser._id.toString(), "refresh");

    newUser.refreshTokens = [refreshToken];
    await newUser.save();

    res.status(201).json({
      message: "User successfully registered",
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        roles: newUser.roles,
        createdAt: newUser.createdAt,
      },
      accessToken,
      refreshToken,
    });
    return;
  } catch (error: any) {
    if (error.code === 11000) {
      let fieldMessage = `An account with that value already exists`;
      if (error.message && error.message.includes("email_1")) {
        fieldMessage = `An account with this email already exists`;
      } else if (error.keyValue) {
        const field = Object.keys(error.keyValue)[0];
        fieldMessage = `An account that ${field} already exists`;
      }
      res.status(409).json({ message: fieldMessage });
      return;
    }
    if (getValidationErrorMessages(error, res)) return;
    console.error("Error in registerUser", error.message || error);
    next(error);
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginBodyType>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email: email });
    if (user && (await user.matchPassword(password))) {
      const accessToken = generateToken(user._id.toString(), "access");
      const refreshToken = generateToken(user._id.toString(), "refresh");

      user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
      await user.save();

      res.status(200).json({
        message: "user successfully logged in",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
        accessToken,
        refreshToken,
      });
      return;
    }
    res.status(400).json({ message: "Invalid credentials" });
  } catch (error: any) {
    if (getValidationErrorMessages(error, res)) return;
    console.error("Login controller error: ", error || error.message);
    next(error);
  }
};

export const refreshTokenHandler = async (
  req: Request<{}, {}, RefreshTokenBodyType>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token: providedRefreshToken } = req.body;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtRefreshSecret) {
    console.error(
      "FATAL ERROR: JWT_REFRESH_SECRET is not defined in .env file"
    );
    return next(
      new Error("Server configuration error: JWT_REFRESH_SECRET is missing")
    );
  }

  try {
    const decoded = jwt.verify(
      providedRefreshToken,
      jwtRefreshSecret
    ) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      res
        .status(403)
        .json({ message: "Forbidden: Invalid refresh token payload" });
      return;
    }

    const userId = decoded.userId as string;

    const user = await User.findById(userId);

    if (!user) {
      res
        .status(401)
        .json({ message: "Unauthorized: user not found for this token" });
      return;
    }

    if (
      !user.refreshTokens ||
      !user.refreshTokens.includes(providedRefreshToken)
    ) {
      console.warn(
        `attempt to use an invalid/revoked refresh token for user ${userId}`
      );
      user.refreshTokens = [];
      await user.save();
      res
        .status(403)
        .json({ message: "Forbidden: Invalid/revoked refresh token" });
      return;
    }

    const newAccessToken = generateToken(user._id.toString(), "access");
    res.status(200).json({ accessToken: newAccessToken });
    return;
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      console.warn("Refresh token expired");

      res.status(403).json({ message: "Forbidden: Refresh token has expired" });
      return;
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn("Refresh token verification failed", error.message);
      res.status(403).json({ message: "Forbidden: Invalid refresh token" });
      return;
    }
    console.error("Error in refreshTokenHandler", error || error.message);
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token: providedRefreshToken } = req.body;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtRefreshSecret) {
    console.error(
      `FATAL ERROR: JWT_REFRESH_SECRET is not defined in .env file`
    );
    throw new Error(
      "Server configuration errro: JWT_REFRESH_SECRET is missing"
    );
  }

  try {
    let decoded: JwtPayload | null = null;

    try {
      decoded = jwt.verify(providedRefreshToken, jwtRefreshSecret, {
        ignoreExpiration: true,
      }) as JwtPayload & { userId: string };
    } catch (verifyError: any) {
      console.warn(
        "Logout attempt using malformed token or invalid signature",
        verifyError.message
      );
      res.status(204).send();
      return
    }

    if (!decoded || !decoded.userId) {
      console.warn(
        "Logout: Decoded refresh token has an invalid payload structure"
      );
      res.status(204).send();
      return;
    }

    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (
      user &&
      user.refreshTokens &&
      user.refreshTokens.includes(providedRefreshToken)
    ) {
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt !== providedRefreshToken
      );
      await user.save();
      console.log(
        `User ${userId} logged out: Refresh token invalidated from DB`
      );
      return;
    } else {
      console.log(
        `Logout attempt: User ${userId} (or token) not found or refresh token not in the active list`
      );
    }
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error in logoutUser: ", error || error.message);
    next(error);
  }
};

