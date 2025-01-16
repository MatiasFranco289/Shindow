import { Request, Response } from "express";
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "../constants";
import { ApiResponse } from "../interfaces";

export const FILE_NOT_FOUND_MESSAGE = "file not found";

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
    }
  }

  res.status(response.status_code).json(response);
}
