"use client";

import {
  HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
  RESOURCE_LIST_ENDPOINT,
} from "@/constants";
import { ApiResponse, Resource } from "@/interfaces";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { RefObject, useEffect, useRef, useState } from "react";
import DirectoryIcon from "@/components/directoryIcon";
import FileIcon from "@/components/fileIcon";
import { normalizeName } from "@/utils/utils";
import NavigationHeader from "@/components/navigationHeader";
import resourceListErrorHandler from "@/errorHandlers/resourceListErrorHandler";
import CustomModal from "@/components/customModal";
import LoadingOverlay from "@/components/loadingOverlay";
import { useNavigation } from "@/components/navigationProvider";
import CustomContextMenu, {
  toggleContextMenuState,
} from "@/components/customContextMenu";
import { useExplorer } from "@/components/explorerProvider";
import KeyboardController from "@/utils/KeyboardController";
export default function FileExplorer() {
  const environmentManager = EnvironmentManager.getInstance();
  const initialPath = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_INITIAL_PATH"
  );
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const {
    actualPath,
    setActualPath,
    pathHistory,
    setPathHistory,
    historyActualIndex,
    setHistoryActualIndex,
  } = useNavigation();
  const [resourceList, setResourceList] = useState<Array<Resource>>([]);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iconRefs, setIconRefs] = useState<Array<RefObject<HTMLDivElement>>>(
    []
  );

  const {
    isContextMenuOpen,
    setContextMenuOpen,
    setMousePosition,
    selectedResourceNames,
    setSelectedResourceNames,
    setActiveResourceNames,
  } = useExplorer();

  useEffect(() => {
    // The first time the apps looads i call the goTo function to get the resources passing an empty array to not move from the actualPath
    KeyboardController.GetInstance(window); // Ensures KeyboardController class to be initializated
    goTo("");
  }, []);

  /**
   * Receives a string with the name of a directory in the server.
   * It will append the name of the directory to the current path and try to get the resources in that path.
   * @param resourceName
   */
  async function goTo(resourceName: string) {
    let newPath = actualPath;

    if (actualPath !== "/") {
      newPath += "/";
    }

    newPath += resourceName;

    setIsLoading(true);

    try {
      const result = await getResourceListFromApi(newPath);
      setResourceList(result);

      let newPathHistory = pathHistory;

      if (pathHistory[historyActualIndex]) {
        newPathHistory = newPathHistory.slice(
          historyActualIndex - 1,
          historyActualIndex
        );
      }

      setPathHistory([...newPathHistory, newPath]);
      setHistoryActualIndex(historyActualIndex + 1);
    } catch (err) {
      const errorCode = err as number;
      setModalMessage(resourceListErrorHandler(errorCode));
      setErrorModalOpen(true);
    }

    setIsLoading(false);
  }

  /**
   * It will try to get the resources in the previous path by modifing actualPath,
   * removing the text from the end to the first occurence of '/'.
   */
  async function goBack() {
    if (actualPath !== "/") {
      const newPath = actualPath.slice(0, actualPath.lastIndexOf("/")) || "/";

      setIsLoading(true);

      try {
        const result = await getResourceListFromApi(newPath);
        setResourceList(result);

        setHistoryActualIndex(historyActualIndex - 1);
      } catch (err) {
        const errorCode = err as number;
        setModalMessage(resourceListErrorHandler(errorCode));
        setErrorModalOpen(true);
      }

      setIsLoading(false);
    }
  }

  async function goForward() {
    const forwardPath = pathHistory[historyActualIndex];

    if (!forwardPath) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await getResourceListFromApi(forwardPath);
      setResourceList(result);

      setHistoryActualIndex(historyActualIndex + 1);
    } catch (err) {
      const errorCode = err as number;
      setModalMessage(resourceListErrorHandler(errorCode));
      setErrorModalOpen(true);
    }

    setIsLoading(false);
  }

  /**
   * This function returns a promise which calls the endpoint to get the resources of the given path.
   * If the response is ok the promise will be resolved with the resource list in the given path.
   * If the promise fails, it will be rejected with the corresponding http status code.
   *
   * @param path - A string with the path from where retrieve the resources.
   * @returns - A promise to be resolved with a list of resources of rejected with a http code.
   */
  function getResourceListFromApi(path: string): Promise<Array<Resource>> {
    return new Promise((resolve, reject) => {
      const resourceListEndpoint = `${apiBaseUrl}${RESOURCE_LIST_ENDPOINT}?path=${path}`;

      axiosInstance
        .get(resourceListEndpoint)
        .then((response) => {
          setActualPath(path);

          const resources: Array<Resource> = response.data.data.map(
            (resource: Resource) => {
              return { ...resource, shortName: normalizeName(resource.name) };
            }
          );

          resolve(resources);
        })
        .catch((err) => {
          console.error(
            `The following error has occurred while trying to get the resources: `
          );

          if (err.response?.data) {
            const response: ApiResponse<null> = err.response.data;
            const responseCode = response.status_code;
            reject(responseCode);
            console.error(response);
          } else {
            reject(HTTP_STATUS_CODE_SERVICE_UNAVAILABLE);
          }
        });
    });
  }

  /**
   * This function is called when any mouse button is pressed inside the explorer div
   * and updates the coords x, y of the cursor
   *
   * @param e - The mouse event
   */
  const updateMousePosition = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  /**
   * This function is passed to the icon components.
   * It is called from the icon component when it is mounted and add the reference
   * of the component to the iconRefs list.
   * @param newRef
   */
  const handleAddRef = (newRef: RefObject<HTMLDivElement>) => {
    const newIconRefs = iconRefs;
    newIconRefs.push(newRef);

    setIconRefs(newIconRefs);
  };

  /**
   * This function is called when a click is made.
   * If the click was outside of any icon and the context menu
   * is closed, then all icons are deselected.
   */
  const deselectResources = (e: React.MouseEvent) => {
    const iconClicked = iconRefs.some((iconRefs) =>
      iconRefs.current?.contains(e.target as Node)
    );

    if (!iconClicked && !isContextMenuOpen) {
      setSelectedResourceNames(new Set<string>());
    }
  };

  /**
   * This function is called when you release the mouse button and
   * sets all icons as non active.
   */
  const deactiveIcons = () => {
    setActiveResourceNames(new Set<string>());
  };

  return (
    <div
      className={`bg-custom-green-100 w-full min-h-screen`}
      onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
      onMouseDown={(e) => {
        updateMousePosition(e);
        toggleContextMenuState(e, isContextMenuOpen, setContextMenuOpen);
        deselectResources(e);
      }}
      onMouseUp={() => {
        deactiveIcons();
      }}
    >
      <NavigationHeader
        goBack={goBack}
        goForward={goForward}
        canGoForward={pathHistory.length > historyActualIndex}
      />

      <CustomContextMenu />

      <div className="flex flex-wrap content-start items-start pt-24">
        {resourceList.map((resource, index) => {
          if (resource.isDirectory) {
            return (
              <DirectoryIcon
                name={resource.name}
                shortName={resource.shortName}
                key={`resource_${index}`}
                isSelected={Array.from(selectedResourceNames).some(
                  (resourceName) => resourceName === resource.name
                )}
                updatePath={(resourceName: string) => goTo(resourceName)}
                handleAddRef={handleAddRef}
              />
            );
          } else {
            return (
              <FileIcon
                name={resource.name}
                shortName={resource.shortName}
                key={`resource_${index}`}
                isSelected={Array.from(selectedResourceNames).some(
                  (resourceName) => resourceName === resource.name
                )}
                handleAddRef={handleAddRef}
              />
            );
          }
        })}
      </div>

      <CustomModal
        isModalOpen={errorModalOpen}
        setModalOpen={setErrorModalOpen}
        title="Error!"
        message={modalMessage}
        type="ERROR"
      />

      <LoadingOverlay isOpen={isLoading} />
    </div>
  );
}
