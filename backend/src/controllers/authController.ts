import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  findOrCreateOAuthUser,
  getUserProfileService,
  updateProfilePicture,
  getUserByEmail,
  expireSession,
  // addToBlacklist,
} from "../services/authService";
import { Prisma } from "@prisma/client";
import { initializeWallet } from "../services/walletService";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      type,
      profilePictureUrl,
    } = req.body;
    const user = await registerUser(
      email,
      password,
      firstName,
      lastName,
      phone,
      type,
      profilePictureUrl
    );
    // Create a wallet for the user
    await initializeWallet(user.id, 0);

    res.status(201).json(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(400).json({ error: "A user with this email already exists." });
    } else {
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    // Set the token in a cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      domain: "localhost",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const oauthCallback = async (req: Request, res: Response) => {
  try {
    const { provider, providerId, email, type, profilePictureUrl } = req.body;
    if (!email) throw new Error("Email is required.");

    // Initialize wallet only for new users
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      await initializeWallet(existingUser.id, 0);
    }

    const user = await findOrCreateOAuthUser(
      provider,
      providerId,
      email,
      type,
      profilePictureUrl
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log("User ID from request:", req.user); // Debugging line

    if (!userId) {
      res.status(401).json({ error: "Unauthorized access." });
    }
    const userProfile = await getUserProfileService(userId);

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized access." });
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
    }

    const profilePictureUrl = await updateProfilePicture(userId, req.file);
    res.status(200).json({ profilePictureUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload profile picture." });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies.authToken || req.headers.authorization?.split(" ")[1];
    expireSession(token);

    // Clear the auth token cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      domain: "localhost",
    });

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to log out." });
  }
};
