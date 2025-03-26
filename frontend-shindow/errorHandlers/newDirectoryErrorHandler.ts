import {
  CLIENT_DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_FORBIDDEN,
} from "@/constants";
import { ApiResponse } from "@/interfaces";

/**
 * Handles the create directory endpoint errors and returns a message for the client.
 *
 * @param statusCode - The HTTP code in the response.
 * @returns - A string with a message for the client.
 */
export default function newDirectoryErrorHandler(statusCode: number) {
  switch (statusCode) {
    case HTTP_STATUS_CODE_CONFLICT:
      return "The directory already exists.";
    case HTTP_STATUS_CODE_FORBIDDEN:
      return "You do not have enough permissions to create the directory.";
    default:
      return CLIENT_DEFAULT_ERROR_MESSAGE;
  }
}
