import { Response, Request } from "express";
import { ApiResponse } from "../interfaces";
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "../constants";

const INVALID_PATH_ERROR = "No such file or directory";
const PERMISSIONS_ERROR = "Permission denied";
/**
 * This function handles the diferent error cases for the move resource endpoint
 *
 * @param err - An object following the interface CustomError.
 * @param _req - Express request.
 * @param res - Express response.
 */
export default function moveResourceErrorHandler(
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
    const tailErrorMessage = splittedErrorMessage[
      splittedErrorMessage.length - 1
    ]
      .split(";")[0]
      .trim();

    switch (tailErrorMessage) {
      case INVALID_PATH_ERROR:
        response.status_code = HTTP_STATUS_CODE_BAD_REQUEST;
        response.message =
          "The resource could not be moved because the origin or destination path is invalid.";
        break;
      case PERMISSIONS_ERROR:
        response.status_code = HTTP_STATUS_CODE_FORBIDDEN;
        response.message =
          "The resource could not be moved because your permissions are insufficient.";
        break;
    }
  }

  res.status(response.status_code).json(response);
}
