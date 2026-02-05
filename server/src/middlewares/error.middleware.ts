import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let details = err.details || undefined;

  if(err instanceof ZodError){
    statusCode = 400,
    message = "Validation Error",
    details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }))
  } else if(err instanceof MulterError){
    statusCode = 400;
    message = "File Upload Error";
    details = {
      code: err.code,
      field: err.field,
      storageErrors: err.message
    };
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    details,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}