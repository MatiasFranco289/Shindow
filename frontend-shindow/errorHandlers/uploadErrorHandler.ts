import {
  CLIENT_DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "@/constants";

/**
 * Handles the upload resource endpoint errors and returns a message for the client.
 *
 * @param statusCode - The HTTP code in the response.
 * @returns - A string with a message for the client.
 */
export default function uploadErrorHandler(statusCode: number) {
  switch (statusCode) {
    case HTTP_STATUS_CODE_FORBIDDEN:
      return "You do not have sufficient permissions to upload in this directory.";
      break;
    case HTTP_STATUS_CODE_NOT_FOUND:
      return "The remote path is not valid or does not exist.";
      break;
    default:
      return CLIENT_DEFAULT_ERROR_MESSAGE;
  }
}
