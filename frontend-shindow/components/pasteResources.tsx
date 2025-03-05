import {
  getLastFromPath,
  removeFromClipboard,
  toggleScroll,
} from "@/utils/utils";
import { useEffect } from "react";
import { useExplorer } from "./explorerProvider";
import { useNavigation } from "./navigationProvider";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { Resource } from "@/interfaces";
import { AxiosResponse } from "axios";
import copyErrorHandler from "@/errorHandlers/pasteErrorHandler";

interface PasteResourcesProps {
  resourceList: Array<Resource>;
  refresh: () => void;
}

export default function PasteResources({
  resourceList,
  refresh,
}: PasteResourcesProps) {
  const environmentManager = EnvironmentManager.getInstance();
  const {
    setPasteOpen,
    clipBoard,
    setClipBoard,
    setErrorModalMessage,
    setErrorModalOpen,
  } = useExplorer();
  const { actualPath } = useNavigation();
  const { selectedResourceNames, setSelectedResourceNames } = useExplorer();
  const resourceListAux: Array<Partial<Resource>> = resourceList;
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );

  useEffect(() => {
    paste();
    toggleScroll(true);
    setPasteOpen(false);
  }, []);

  const paste = () => {
    const pasteRequests = buildRequests();

    Promise.all(pasteRequests)
      .catch((err) => {
        if (!err) return;

        const statusCode: number = err.response.status;
        const message = copyErrorHandler(statusCode);
        setErrorModalMessage(message);
        setErrorModalOpen(true);
      })
      .finally(() => {
        refresh();
      });
  };

  /**
   * Iterates over all elements in the clipboard and create a request using axios
   * to the corresponding url, /copy or /move depending on the method of the clipboard item.
   * Also constructs the body request and finally return an array of promises to be resolved.
   *
   * @returns - An array of promises with the corresponding axios requests
   */
  const buildRequests = (): Array<Promise<AxiosResponse<any, any>>> => {
    const axiosRequest: Array<Promise<AxiosResponse<any, any>>> = Array.from(
      clipBoard
    ).map((item) => {
      const urlMethod = item.method === "copied" ? "copy" : "move";
      const requestUrl = `${apiBaseUrl}/resources/${urlMethod}`;

      const validationResult = validations(item.path, actualPath, urlMethod);

      if (!validationResult) {
        return new Promise((resolve, reject) => {
          reject();
        });
      }

      const bodyRequest = {
        originPath: item.path,
        destinationPath: actualPath + manageSameNameCopy(item.path),
        recursive: true,
      };

      return new Promise((resolve, reject) => {
        axiosInstance
          .post(requestUrl, bodyRequest)
          .then((response) => {
            if (urlMethod === "move") {
              removeFromClipboard(clipBoard, item, setClipBoard);
            }

            /*  selectedResourceNames(selectedResourceNames.app) */
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });

    return axiosRequest;
  };

  /**
   * Attemps to find the string 'Copy (x)' at the end of the string
   * being x any number.
   *
   * @param resourceName - The name of the resource
   * @returns - A number with the index or 0
   */
  const findNameIndex = (resourceName: string) => {
    const match = resourceName.match(/\(Copy (\d+)\)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  /**
   * If there already is another resource with the same name of the resource to be pasted
   * this function creates a new name for the resource by appending the string (Copy) at the end
   * of the resource original name.
   *
   * @param originalPath - The original path of the resource
   * @param destinationPath - The destination of the resource after being pasted
   *
   * @returns - A string being the correct name of the resource.
   */
  const manageSameNameCopy = (originalPath: string) => {
    let sameNameResource: Partial<Resource> | undefined = undefined;
    let resourceName: string = getLastFromPath(originalPath);
    let count = findNameIndex(resourceName);

    do {
      // Find if there already is another file with the same name in the curren path
      sameNameResource = resourceListAux.find(
        (resource) => resource.name === resourceName
      );

      // If there is another file with the same name
      if (sameNameResource) {
        const originalName: string = resourceName.split("(")[0] || resourceName;
        resourceName = `${originalName}(Copy ${count + 1})`;
      }

      count++;
    } while (sameNameResource);

    resourceListAux.push({
      name: resourceName,
    });

    return resourceName;
  };

  // TODO: Move this validations somewhere else
  // TODO: When you paste or create a new resource the resource should be selected by default
  const validations = (
    origin: string,
    destination: string,
    method: "move" | "copy"
  ) => {
    const resourceName: string = getLastFromPath(origin);

    const validations = [
      {
        validate: () => {
          if (origin === destination + resourceName) {
            setClipBoard(new Set());
            return false;
          }

          return true;
        },
        message: "Destination path cannot be the same as the origin path.",
        method: "move",
      },
      {
        validate: () => {
          const resourceName = getLastFromPath(origin);
          const nameInsideSource = destination
            .split("/")
            .find((item) => item === resourceName);

          if (nameInsideSource) {
            return false;
          }

          return true;
        },
        message: "The destination directory is inside the source directory.",
        method: "copy",
      },
    ];

    for (const validation of validations) {
      if (method !== validation.method) continue;

      const result = validation.validate();

      if (!result) {
        setErrorModalMessage(validation.message);
        setErrorModalOpen(true);
        return false;
      }
    }

    return true;
  };

  return null;
}
