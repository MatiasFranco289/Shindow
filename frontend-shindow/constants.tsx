import { FaRegCopy, FaPaste, FaTrash, FaUpload } from "react-icons/fa6";
import { ContextMenuItemData } from "./interfaces";
import { title } from "process";

export const DEFAULT_TZ = "UTC";
export const DEFAULT_MAX_KEY_SIZE = "10240";
export const DEFAULT_API_BASE_URL = "http://localhost:5000/api";
export const DEFAULT_CLIENT_BASE_URL = "http://localhost:3000";
export const DEFAULT_INITIAL_PATH = "";

export const LOGIN_ENDPOINT = "/auth/login";
export const RESOURCE_LIST_ENDPOINT = "/resources/list";

export const CLIENT_DEFAULT_ERROR_MESSAGE =
  "An unexpected error has occurred. Please try again later.";

export const HTTP_STATUS_CODE_CONFLICT = 409;
export const HTTP_STATUS_CODE_UNAUTHORIZED = 401;
export const HTTP_STATUS_CODE_FORBIDDEN = 403;
export const HTTP_STATUS_CODE_NOT_FOUND = 404;
export const HTTP_STATUS_CODE_SERVICE_UNAVAILABLE = 503;

export const contextMenuItemsFile: Array<ContextMenuItemData> = [
  {
    icon: <FaRegCopy />,
    title: "Copy",
    function: () => {
      alert("You are trying to copy a file");
    },
  },
  {
    icon: <FaTrash />,
    title: "Delete",
    function: () => {
      alert("You tried to delete a file");
    },
  },
];

export const contextMenuItemsDirectory: Array<ContextMenuItemData> = [
  {
    icon: <FaRegCopy />,
    title: "Copy",
    function: () => {
      alert("Copy folder");
    },
  },
  {
    icon: <FaPaste />,
    title: "Paste",
    function: () => {
      alert("paste into folder");
    },
  },
  {
    icon: <FaTrash />,
    title: "Delete",
    function: () => {
      alert("delete folder (you sure?)");
    },
  },
  {
    icon: <FaUpload />,
    title: "Upload",
    function: () => {
      alert("Upload into folder");
    },
  },
];

export const contextMenuItemsExplorer = [
  {
    icon: <FaUpload />,
    title: "Upload",
    function: () => {
      alert("Upload into the folder you are right now");
    },
  },
];
