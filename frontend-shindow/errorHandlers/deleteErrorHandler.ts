import {
  CLIENT_DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_FORBIDDEN,
} from "@/constants";

/**
 * Handles the delete errors and returns a message for the client.
 *
 * @param statusCode - The HTTP code in the response.
 * @returns - A string with a message for the client.
 */
export default function deleteErrorHandler(statusCode: number) {
  switch (statusCode) {
    case HTTP_STATUS_CODE_FORBIDDEN:
      return "The resource could not be deleted because your permissions are insufficient.";
    default:
      return CLIENT_DEFAULT_ERROR_MESSAGE;
  }
}
