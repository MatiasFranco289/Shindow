import path from "path";

export const DEFAULT_NODE_ENVIRONMENT = "development";
export const DEFAULT_TZ = "UTC";
export const DEFAULT_SERVER_PORT = "22";
export const DEFAULT_SERVER_IP = "localhost";
export const DEFAULT_CLIENT_DOMAIN = "http://localhost:3000";
export const DEFAULT_UPLOAD_DIRECTORY = path.join(__dirname, "../../uploads");

export const DEFAULT_ERROR_MESSAGE =
  "An unexpected error occurred while processing your request. Please try again later.";

export const HTTP_STATUS_CODE_OK = 200;
export const HTTP_STATUS_CODE_CONFLICT = 409;
export const HTTP_STATUS_CODE_UNAUTHORIZED = 401;
export const HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR = 500;
export const HTTP_STATUS_CODE_BAD_REQUEST = 400;
export const HTTP_STATUS_CODE_FORBIDDEN = 403;
export const HTTP_STATUS_CODE_NOT_FOUND = 404;

export const ERROR_TYPE_CONNECTION_ID_NOT_UNIQUE =
  "CONNECTION_IDENTIFIER_NOT_UNIQUE";
export const ERROR_TYPE_AUTH = "AUTH_ERROR";
export const ERROR_TYPE_RESOURCES = "RESOURCES_ERROR";
export const ERROR_TYPE_SSH_CONNECTION_NOT_FOUND = "SSH_CONNECTION_NOT_FOUND";
export const ERROR_TYPE_UPLOAD_RESOURCE = "UPLOAD_RESOURCE_ERROR";
