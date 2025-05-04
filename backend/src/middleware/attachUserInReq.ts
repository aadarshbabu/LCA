import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const attachUserInReq = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.authToken ?? req?.headers?.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      isAdmin: boolean;
    };
    req.user = { id: decoded.id, isAdmin: decoded.isAdmin, ...decoded };
    next();
  } catch (error) {
    next();
  }
};
