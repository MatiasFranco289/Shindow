import { Response, Request } from "express";
import { ApiResponse } from "../interfaces";
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "../constants";

const FILE_ALREADY_EXIST_ERROR = "File exists";
const INVALID_PATH_ERROR = "No such file or directory";
const PERMISSIONS_ERROR = "Permission denied";
/**
 * This function handles the diferent error cases for the create directory endpoint.
 *
 * @param err - An object following the interface CustomError.
 * @param _req - Express request.
 * @param res - Express response.
 */
export default function createDirectoryErrorHandler(
  err: unknown,
  _req: Request,
  res: Response
) {
  let response: ApiResponse<null> = {
    status_code: HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
    message: DEFAULT_ERROR_MESSAGE,
    data: [],
  };

  if (err instanceof Error) {
    const splittedErrorMessage = err.message.split(":");
    const tailErrorMessage =
      splittedErrorMessage[splittedErrorMessage.length - 1].trim();

    switch (tailErrorMessage) {
      case FILE_ALREADY_EXIST_ERROR:
        response.status_code = HTTP_STATUS_CODE_CONFLICT;
        response.message =
          "The resource could not be created because it already exists.";
        break;
      case INVALID_PATH_ERROR:
        response.status_code = HTTP_STATUS_CODE_BAD_REQUEST;
        response.message =
          "The resource could not be created because the path is invalid.";
      case PERMISSIONS_ERROR:
        response.status_code = HTTP_STATUS_CODE_FORBIDDEN;
        response.message =
          "The resource could not be created because your permissions are insufficient.";
    }
  }

  res.status(response.status_code).json(response);
}
