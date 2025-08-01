import {
  CLIENT_DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "@/constants";

/**
 * Handles the resource list endpoint errors and returns a message for the client.
 *
 * @param statusCode - The HTTP code in the response.
 * @returns - A string with a message for the client.
 */
export default function resourceListErrorHandler(statusCode: number) {
  switch (statusCode) {
    case HTTP_STATUS_CODE_FORBIDDEN:
      return "You do not have sufficient permissions to access this directory.";
    case HTTP_STATUS_CODE_NOT_FOUND:
      return "No such file or directory. The specified path does not exist.";
    default:
      return CLIENT_DEFAULT_ERROR_MESSAGE;
  }
}
