import { NextFunction, Request, Response } from "express";
import { CustomError } from "../interfaces";
import {
  ERROR_TYPE_AUTH,
  ERROR_TYPE_COPY_RESOURCE,
  ERROR_TYPE_CREATE_DIRECTORY,
  ERROR_TYPE_DELETE_RESOURCE,
  ERROR_TYPE_MOVE_RESOURCE,
  ERROR_TYPE_RESOURCES,
  ERROR_TYPE_UPLOAD_RESOURCE,
} from "../constants";
import authErrorHandler from "../errorHandlers/authErrorHandler";
import resourcesErrorHandler from "../errorHandlers/resourcesErrorHandler";
import uploadResourcesErrorHandler from "../errorHandlers/uploadResourceErrorHandler";
import createDirectoryErrorHandler from "../errorHandlers/createDirectoryErrorHandler";
import deleteResourceErrorHandler from "../errorHandlers/deleteResourceErrorHandler";
import copyResourceErrorHandler from "../errorHandlers/copyResourceErrorHandler";
import moveResourceErrorHandler from "../errorHandlers/moveResourceErrorHandler";

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
    case ERROR_TYPE_UPLOAD_RESOURCE:
      uploadResourcesErrorHandler(err.error, req, res);
      break;
    case ERROR_TYPE_CREATE_DIRECTORY:
      createDirectoryErrorHandler(err.error, req, res);
      break;
    case ERROR_TYPE_DELETE_RESOURCE:
      deleteResourceErrorHandler(err.error, req, res);
      break;
    case ERROR_TYPE_COPY_RESOURCE:
      copyResourceErrorHandler(err.error, req, res);
      break;
    case ERROR_TYPE_MOVE_RESOURCE:
      moveResourceErrorHandler(err.error, req, res);
      break;
  }
};

export default errorHandlerMiddleware;
