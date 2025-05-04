import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getSession } from "../services/authService";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.authToken ?? req.headers?.authorization?.split(" ")[1]; // Retrieve token from cookies

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return; // Ensure the request ends here
  }
  const session = await getSession(token); // check the session in database.

  if (!session || session.expired || session?.expiresAt < new Date()) {
    res.status(401).json({ error: "Session Expired Please Login" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      isAdmin: boolean;
    };
    req.user = { id: decoded.id, isAdmin: decoded.isAdmin, ...decoded };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return; // Ensure the request ends here
  }
};
