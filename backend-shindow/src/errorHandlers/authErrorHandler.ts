import { Response, Request } from "express";
import { ApiResponse } from "../interfaces";
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODE_UNAUTHORIZED,
} from "../constants";
import logger from "../utils/logger";

const BAD_PASSPHRASE_MESSAGE =
  "Cannot parse privateKey: OpenSSH key integrity check failed -- bad passphrase?";
const BAD_PRIVATE_KEY_MESSAGE =
  "Cannot parse privateKey: Unsupported key format";
const BAD_CREDENTIALS_MESSAGE = "All configured authentication methods failed";
const NO_PASSPHRASE_GIVEN_MESSAGE =
  "Cannot parse privateKey: Encrypted private OpenSSH key detected, but no passphrase given";

export const INCORRECT_CREDENTIALS_MESSAGE = "Incorrect credentials";
export const KEY_NEEDS_PASSPHRASE_MESSAGE = "Key needs a passphrase";

/** This function handles the different error cases for the auth controller.
 *
 * @param err - An object following the interface CustomError.
 * @param req - Express request.
 * @param res - Express response.
 */
export default function authErrorHandler(
  err: unknown,
  req: Request,
  res: Response
) {
  const clientIp = req.ip;
  const { username } = req.body;

  let response: ApiResponse<null> = {
    status_code: HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
    message: DEFAULT_ERROR_MESSAGE,
    data: [],
  };

  if (err instanceof Error) {
    switch (err.message) {
      case BAD_PASSPHRASE_MESSAGE:
        response.status_code = HTTP_STATUS_CODE_UNAUTHORIZED;
        response.message = INCORRECT_CREDENTIALS_MESSAGE;

        logger.warn(
          `Failed login attempt from IP: '${clientIp}' for user ${username}. Invalid passphrase.`
        );
        break;
      case BAD_PRIVATE_KEY_MESSAGE:
        response.status_code = HTTP_STATUS_CODE_UNAUTHORIZED;
        response.message = INCORRECT_CREDENTIALS_MESSAGE;

        logger.warn(
          `Failed login attempt from IP: '${clientIp}' for user ${username}. Invalid private key.`
        );
        break;
      case BAD_CREDENTIALS_MESSAGE:
        response.status_code = HTTP_STATUS_CODE_UNAUTHORIZED;
        response.message = INCORRECT_CREDENTIALS_MESSAGE;

        logger.warn(
          `Failed login attempt from IP: '${clientIp}' for user ${username}. Invalid credentials.`
        );
        break;
      case NO_PASSPHRASE_GIVEN_MESSAGE:
        response.status_code = HTTP_STATUS_CODE_BAD_REQUEST;
        response.message = KEY_NEEDS_PASSPHRASE_MESSAGE;

        logger.warn(
          `Failed login attempt from IP: '${clientIp}' for user ${username}. ` +
            KEY_NEEDS_PASSPHRASE_MESSAGE
        );
        break;
      default:
        logger.error(
          `Failed login attempt from IP: '${clientIp}' for user ${username}.`
        );
        logger.error(err.message);
        break;
    }
  }

  res.status(response.status_code).json(response);
}
