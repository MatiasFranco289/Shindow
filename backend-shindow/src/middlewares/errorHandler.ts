import { NextFunction, Request, Response } from "express";
import { CustomError } from "../interfaces";
import { ERROR_TYPE_AUTH } from "../constants";
import authErrorHandler from "../errorHandlers/authErrorHandler";

/**
 * This middleware receives a err following the CustomError interface and calls the correct error handler.
 *
 * @param err - An object following the CustomError interface.
 * @param req - Express Request.
 * @param res - Express Response/
 * @param next - Express NextFunction
 */
const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  switch (err.errorType) {
    case ERROR_TYPE_AUTH:
      authErrorHandler(err.error, req, res);
      break;
  }
};

export default errorHandlerMiddleware;
