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
export default function newDirectoryErrorHandler(
  statusCode: number,
  response: ApiResponse<unknown>
) {
  console.log(statusCode);
  switch (statusCode) {
    case HTTP_STATUS_CODE_CONFLICT:
      return "The directory already exists.";
    case HTTP_STATUS_CODE_FORBIDDEN:
      return "You do not have enough permissions to create the directory.";
    case HTTP_STATUS_CODE_BAD_REQUEST:
      // TODO: Crear una interface para el error de validacion
      // TODO: Filtrar y mostrar errores al clientes
      // TODO: Agregar validaciones en el modal de creacion de directorios
      console.log(response.data[0].msg);
    default:
      return CLIENT_DEFAULT_ERROR_MESSAGE;
  }
}
