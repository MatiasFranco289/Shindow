import {
  CLIENT_DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_FORBIDDEN,
} from "@/constants";

/**
 * Handles the paste errors and returns a message for the client.
 *
 * @param statusCode - The HTTP code in the response.
 * @returns - A string with a message for the client.
 */
export default function pasteErrorHandler(statusCode: number) {
  switch (statusCode) {
    case HTTP_STATUS_CODE_FORBIDDEN:
      return "You do not have enough permissions to paste this resource.";
    case HTTP_STATUS_CODE_BAD_REQUEST:
      return "The resource could not be pasted because the origin or destination path is invalid.";
    default:
      return CLIENT_DEFAULT_ERROR_MESSAGE;
  }
}
