import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res
      .status(401)
      .json({ error: "Unauthorized", auth: req.headers.authorization });
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
