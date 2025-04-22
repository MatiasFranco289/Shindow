import { Request, Response } from "express";
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants";
import { ApiResponse } from "../interfaces";

export const FILE_NOT_FOUND_MESSAGE = "file not found";
export const REMOTE_PATH_NOT_FOUND_MESSAGE = "remotePath not found";
export const REMOTE_PATH_NOT_VALID = "remotePath is not valid";
export const PERMISSIONS_DENIED_MESSAGE = "Permission denied";

export default function uploadResourcesErrorHandler(
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
    switch (err.message) {
      case FILE_NOT_FOUND_MESSAGE:
        response.status_code = HTTP_STATUS_CODE_BAD_REQUEST;
        response.message = "a valid file must be provided.";
        break;
      case REMOTE_PATH_NOT_FOUND_MESSAGE:
        response.status_code = HTTP_STATUS_CODE_BAD_REQUEST;
        response.message = "remotePath must be a valid string.";
        break;
      case REMOTE_PATH_NOT_VALID:
        response.status_code = HTTP_STATUS_CODE_NOT_FOUND;
        response.message =
          "provided remotePath is not a valid path in the SSH server or your permissions are insufficient";
        break;
      case PERMISSIONS_DENIED_MESSAGE:
        response.status_code = HTTP_STATUS_CODE_FORBIDDEN;
        response.message =
          "You do not have sufficient permissions to upload in this directory.";
        break;
    }
  }

  res.status(response.status_code).json(response);
}
