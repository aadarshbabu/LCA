import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.authToken ?? req.headers?.authorization?.split(" ")[1]; // Retrieve token from cookies

  console.log("token", req.cookies);

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return; // Ensure the request ends here
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
