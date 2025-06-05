//src/routes/authRoutes
import express from "express";
import {
  registerUser,
  loginUser,
  refreshTokenHandler,
  logoutUser,
  getMyProfile,
} from "../controller/authController";
import { validateBody } from "../middleware/validationMiddleware";
import {
  loginBodySchema,
  registerBodySchema,
} from "../utils/validationSchemas";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();
router.post("/register", validateBody(registerBodySchema), registerUser);
router.post("/login", validateBody(loginBodySchema), loginUser);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logoutUser);
router.get("/me", protect, getMyProfile);
export default router;
