import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // console.log("Global Error Handler triggered!");
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let details = err.details || undefined;

  if(err instanceof ZodError){
    statusCode = 400,
    message = "Validation Error",
    details = err.issues.map((issue) => {
      field: issue.path.join('.');
      message: issue.message
    })
  }
  res.status(statusCode).json({
    success: false,
    message,
    details,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}