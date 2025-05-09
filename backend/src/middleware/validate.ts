import { ZodSchema } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const validate = <T extends ZodSchema>(schema: T): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
      return; // 🚨 Ensure we exit the middleware properly
    }

    req.body = result.data;
    next(); // ✅ Let Express proceed to the next handler
  };
};
