//src/routes/authRoutes
import express from "express";
import { registerUser, loginUser, refreshTokenHandler, logoutUser } from "../controller/authController"; 
import { validateBody } from "../middleware/validationMiddleware";
import { loginBodySchema, refreshTokenBodySchema, registerBodySchema } from "../utils/validationSchemas";

const router = express.Router();
router.post('/register', validateBody(registerBodySchema), registerUser)
router.post('/login', validateBody(loginBodySchema), loginUser)
router.post('/refresh', validateBody(refreshTokenBodySchema), refreshTokenHandler)
router.post('/logout', validateBody(refreshTokenBodySchema), logoutUser)
export default router;