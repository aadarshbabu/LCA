import { Router } from "express";
import {
  register,
  login,
  oauthCallback,
  getProfile,
  uploadProfilePicture,
  logout,
} from "../controllers/authController";
import { authenticate } from "../middleware/authenticate";
import { upload } from "../multer/multerConfig";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       401:
 *         description: Invalid credentials.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Invalid input.
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile details
 *     responses:
 *       200:
 *         description: User profile details retrieved successfully.
 *       401:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /auth/upload-profile-picture:
 *   post:
 *     summary: Upload a profile picture for the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture file to upload.
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully.
 *       400:
 *         description: Error uploading profile picture.
 */

router.post("/register", register);
router.post("/login", login);
router.post("/oauth/callback", oauthCallback);
router.get("/profile", authenticate, getProfile);
router.post(
  "/upload-profile-picture",
  authenticate,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.post("/logout", logout);

export default router;
