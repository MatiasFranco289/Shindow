import { NextFunction, Request, Response } from "express";
import { CustomError } from "../interfaces";
import { ERROR_TYPE_AUTH, ERROR_TYPE_RESOURCES } from "../constants";
import authErrorHandler from "../errorHandlers/authErrorHandler";
import resourcesErrorHandler from "../errorHandlers/resourcesErrorHandler";

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
    case ERROR_TYPE_RESOURCES:
      resourcesErrorHandler(err.error, req, res);
      break;
  }
};

export default errorHandlerMiddleware;
