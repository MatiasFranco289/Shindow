import { Response, Request } from "express";
import { ApiResponse } from "../interfaces";
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants";

const BAD_PERMISSIONS_ERROR = "Permission denied";
const BAD_PATH_ERROR = "No such file or directory";

/**
 * This function handles the diferent error cases for the resources controller.
 *
 * @param err - An object following the interface CustomError.
 * @param _req - Express request.
 * @param res - Express response.
 */
export default function resourcesErrorHandler(
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
      case BAD_PERMISSIONS_ERROR:
        response.status_code = HTTP_STATUS_CODE_FORBIDDEN;
        response.message =
          "You do not have permission to list the contents of this directory.";
        break;
      case BAD_PATH_ERROR:
        response.status_code = HTTP_STATUS_CODE_NOT_FOUND;
        response.message =
          "No such file or directory. The specified path does not exist.";
        break;
    }
  }

  res.status(response.status_code).json(response);
}
