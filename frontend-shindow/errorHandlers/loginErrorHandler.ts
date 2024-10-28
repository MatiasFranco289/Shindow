import {
  CLIENT_DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_UNAUTHORIZED,
} from "@/constants";

/**
 * Handles the login error and returns a message for the client.
 *
 * @param statusCode - The HTTP code in the response.
 * @returns - A string with a message for the client.
 */
export default function loginErrorHandler(statusCode: number) {
  switch (statusCode) {
    case HTTP_STATUS_CODE_UNAUTHORIZED:
      return "The login has failed. Please check your credentials and try again.";
    case HTTP_STATUS_CODE_CONFLICT:
      return "You are already logged in.";
    default:
      return CLIENT_DEFAULT_ERROR_MESSAGE;
  }
}
