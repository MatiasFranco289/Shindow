import {
  CLIENT_DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_UNAUTHORIZED,
} from "@/constants";

/**
 * Handles the logout error and returns a message for the client.
 *
 * @param statusCode - The HTTP code in the response.
 * @returns - A string with a message for the client.
 */
export default function logoutErrorHandler(statusCode: number) {
  return CLIENT_DEFAULT_ERROR_MESSAGE;
}
