import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
}

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
}
