import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

const zodValidator =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json({ error: "Invalid request data", details: result.error.errors });
    }

    req.validatedBody = result.data;
    next();
  };

export default zodValidator;
