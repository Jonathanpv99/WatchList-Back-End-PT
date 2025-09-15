import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";

export function correlationId(req: Request, res: Response, next: NextFunction) {
  const id = req.headers["x-request-id"] || uuidv4();
  (req as any).correlationId = id;
  res.setHeader("x-request-id", id as string);
  next();
}
