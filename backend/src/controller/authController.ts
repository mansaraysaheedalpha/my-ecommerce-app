//src/controller/authController.ts
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/UserModel";
import generateToken from "../utils/generateToken"; // Assuming named export
import { LoginBodyType, RegisterBodyType } from "../utils/validationSchemas"; // Types for validated bodies
import {
  getValidationErrorMessages,
  convertToMilliseconds,
} from "../utils/helpers"; // Assuming helpers are here

/**
 * @desc    Register a new user, hash password, store refresh token, set HttpOnly cookie for refresh token.
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (
  req: Request<{}, {}, RegisterBodyType>, // req.body is validated by Zod middleware
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const userDocument = new User({
      name: name,
      email: email,
      passwordHash: password, // Mongoose pre-save hook will hash this
    });
    let newUser = await userDocument.save(); // First save to hash password and get _id

    const accessToken = generateToken(newUser._id.toString(), "access");
    const refreshToken = generateToken(newUser._id.toString(), "refresh");

    newUser.refreshTokens = [refreshToken]; // Store the first refresh token
    await newUser.save(); // Save user again with the refresh token

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: convertToMilliseconds(process.env.JWT_REFRESH_EXPIRES_IN || "7d"),
      path: "/api/auth", // Important: Scope cookie to auth paths
    });

    res.status(201).json({
      message: "User successfully registered",
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        roles: newUser.roles,
        createdAt: newUser.createdAt,
      },
      accessToken, // Send accessToken in body
    });
    return; // Explicit return after sending response
  } catch (error: any) {
    if (error.code === 11000) {
      let fieldMessage = `An account with that value already exists`;
      if (error.message && error.message.includes("email_1")) {
        // Mongoose default index name for unique email
        fieldMessage = `An account with this email already exists`;
      } else if (error.keyValue) {
        const field = Object.keys(error.keyValue)[0];
        fieldMessage = `An account with this ${field} already exists`;
      }
      res.status(409).json({ message: fieldMessage });
      return;
    }
    if (getValidationErrorMessages(error, res)) {
      // For Mongoose schema validation errors
      return;
    }
    console.error("Error in registerUser:", error.message || error);
    next(error);
  }
};

/**
 * @desc    Authenticate user & get tokens (access token in body, refresh token in HttpOnly cookie)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (
  req: Request<{}, {}, LoginBodyType>, // req.body is validated by Zod middleware
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email: email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateToken(user._id.toString(), "access");
      const refreshToken = generateToken(user._id.toString(), "refresh");

      // Add new refresh token, remove old ones if implementing strict one-session-per-device,
      // or add to list for multiple sessions. For simplicity, let's add and prune later if needed.
      user.refreshTokens = [
        ...(user.refreshTokens || []).filter((rt) => rt !== refreshToken),
        refreshToken,
      ];
      await user.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: convertToMilliseconds(
          process.env.JWT_REFRESH_EXPIRES_IN || "7d"
        ),
        path: "/api/auth",
      });

      res.status(200).json({
        message: "User successfully logged in",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          roles: user.roles,
          createdAt: user.createdAt,
        },
        accessToken,
      });
      return; // Explicit return
    }
    res.status(401).json({ message: "Invalid credentials" }); // Changed from 400
    return; // Explicit return
  } catch (error: any) {
    // Mongoose ValidationErrors are less likely here unless findOne somehow triggers them (rare)
    if (getValidationErrorMessages(error, res)) {
      return;
    }
    console.error("Login controller error:", error.message || error);
    next(error);
  }
};

/**
 * @desc    Refresh access token using a refresh token from HttpOnly cookie. Implements token rotation.
 * @route   POST /api/auth/refresh-token
 * @access  Public (requires valid refresh token cookie)
 */
export const refreshTokenHandler = async (
  req: Request, // No specific body type needed as token comes from cookie
  res: Response,
  next: NextFunction
): Promise<void> => {
  const providedRefreshToken = req.cookies?.refreshToken;

  if (!providedRefreshToken) {
    res
      .status(401)
      .json({ message: "Unauthorized: Refresh token cookie missing" });
    return;
  }

  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!jwtRefreshSecret) {
    console.error("FATAL ERROR: JWT_REFRESH_SECRET is not defined.");
    return next(
      new Error("Server configuration error: JWT Refresh Secret missing")
    );
  }

  try {
    const decoded = jwt.verify(
      providedRefreshToken,
      jwtRefreshSecret
    ) as JwtPayload & { userId: string }; // Assuming your payload has userId

    const user: IUser | null = await User.findById(decoded.userId);

    if (!user) {
      // User associated with token not found (e.g., deleted user but token still exists
      res
        .status(401)
        .json({ message: "Unauthorized: User not found for this token" });
      return;
    }
    console.log(
      `[AUTH_CTRL] refreshTokenHandler: User ${user.email} found. Current DB tokens:`,
      user.refreshTokens
    ); // Log current DB tokens

    if (
      !user.refreshTokens ||
      !user.refreshTokens.includes(providedRefreshToken)
    ) {
      // Token is validly signed but not in the user's current list of active tokens
      // This could be a sign of a stolen/replayed token or a token from a logged-out session.
      // Aggressive security: clear all tokens for this user.
      console.warn(
        `Attempt to use an invalid/revoked refresh token for user ${decoded.userId}. Clearing all tokens.`
      );
      user.refreshTokens = [];
      await user.save();
      res.status(403).json({
        message:
          "Forbidden: Invalid or revoked refresh token. Please login again.",
      });
      return;
    }

    // Generate new tokens (Token Rotation)
    const newAccessToken = generateToken(user._id.toString(), "access");
    const newRefreshToken = generateToken(user._id.toString(), "refresh");

    console.log(
      "[AUTH_CTRL] refreshTokenHandler: Old RT to remove:",
      providedRefreshToken
    );
    console.log(
      "[AUTH_CTRL] refreshTokenHandler: New RT to add & set in cookie:",
      newRefreshToken
    );

    // Update stored refresh tokens: remove old, add new
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt !== providedRefreshToken
    );
    user.refreshTokens.push(newRefreshToken);
    await user.save();

     console.log(`[AUTH_CTRL] refreshTokenHandler: User ${user.email} DB tokens updated:`, user.refreshTokens);

    // Set the NEW refresh token as an HttpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: convertToMilliseconds(process.env.JWT_REFRESH_EXPIRES_IN || "7d"),
      path: "/api/auth",
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
    return;
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      console.warn("Refresh token expired:", error.message);
      res.status(403).json({
        message: "Forbidden: Refresh token has expired. Please login again.",
      });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      // Catches other JWT errors like invalid signature
      console.warn("Refresh token verification failed:", error.message);
      res.status(403).json({
        message: "Forbidden: Invalid refresh token. Please login again.",
      });
      return;
    }
    console.error("Error in refreshTokenHandler:", error.message || error);
    next(error);
  }
};

/**
 * @desc    Logout user (invalidate refresh token from DB and clear cookie)
 * @route   POST /api/auth/logout
 * @access  Public (uses refresh token cookie to identify session to logout)
 */
export const logoutUser = async (
  req: Request, // No specific body type needed
  res: Response,
  next: NextFunction
): Promise<void> => {
  const providedRefreshToken = req.cookies?.refreshToken;
  console.log("refresh token cookie: ", providedRefreshToken);
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET; // Needed to decode token to find user

  try {
    if (providedRefreshToken && jwtRefreshSecret) {
      let decoded: (JwtPayload & { userId: string }) | null = null;
      try {
        // Verify to get userId, ignore expiration as we want to clear it anyway
        decoded = jwt.verify(providedRefreshToken, jwtRefreshSecret, {
          ignoreExpiration: true,
        }) as JwtPayload & { userId: string };
      } catch (jwtError: any) {
        // Token is malformed/invalid signature - nothing to do with DB for this specific token.
        console.warn(
          "Logout: Refresh token cookie malformed or signature invalid:",
          jwtError.message
        );
      }

      if (decoded && decoded.userId) {
        const user: IUser | null = await User.findById(decoded.userId);
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
            `User ${decoded.userId} logged out. Refresh token invalidated from DB.`
          );
        } else {
          console.log(
            `Logout: User ${decoded.userId} (from token) not found or refresh token not in active list.`
          );
        }
      } else if (providedRefreshToken) {
        // Token was provided but couldn't be decoded to get userId
        console.warn(
          "Logout: Could not decode userId from provided refresh token cookie."
        );
      }
    } else if (providedRefreshToken) {
      console.warn(
        "Logout: Refresh token provided by client, but server refresh secret is missing. Cannot process DB invalidation."
      );
    } else {
      console.log("Logout: No refresh token cookie provided by client.");
    }
  } catch (dbError: any) {
    // Catch errors from User.findById or user.save
    console.error(
      "Logout controller database/operational error:",
      dbError.message || dbError
    );
    // We will still proceed to clear the cookie and send 204.
    // For the client, logout should appear to succeed by clearing the cookie.
    // The error is logged for server-side diagnosis.
  } finally {
    // Always clear the refreshToken cookie on logout, regardless of what happened before.
    // This ensures the client-side session is effectively terminated.
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0), // Expire immediately
      path: "/api/auth", // Must match the path the cookie was set with
    });
    res.status(204).send();
    // No explicit return needed here as it's the end of the function after response.
  }
};

export const getMyProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      res
        .status(404)
        .json({ message: "Unauthorized, user not found after authentication" });
      return;
    }

    res.status(200).json({
      message: "User profile sucessfully fetched",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error in getMyProfile, ", error || error.message);
    next(error);
  }
};
