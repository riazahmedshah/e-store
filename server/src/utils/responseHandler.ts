import { Response } from "express";

export class ResponseHandle {
  static success(
    res: Response,
    message: string | null,
    data: any = null,
    status = 200,
  ) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }
}
