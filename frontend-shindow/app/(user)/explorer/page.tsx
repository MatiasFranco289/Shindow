"use client";

import {
  HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
  RESOURCE_LIST_ENDPOINT,
} from "@/constants";
import { ApiResponse, Resource, UploadClipboardItem } from "@/interfaces";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { RefObject, useEffect, useRef, useState } from "react";
import DirectoryIcon from "@/components/directoryIcon";
import FileIcon from "@/components/fileIcon";
import { compareResources, normalizeName } from "@/utils/utils";
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
import CustomContextMenuLogic from "@/components/customContextMenuLogic";
import HelpMenu from "@/components/helpMenu";
import Panel from "@/components/lateralPanel";
import LateralPanel from "@/components/lateralPanel";

export default function FileExplorer() {
  const environmentManager = EnvironmentManager.getInstance();
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const { history, historyIndex, goTo, restoreHistory } = useNavigation();
  const [resourceList, setResourceList] = useState<Array<Resource>>([]);
  const [contextMenuRef, setContextMenuRef] = useState<
    RefObject<HTMLDivElement | null>
  >(useRef<HTMLDivElement>(null));
  const [iconRefs, setIconRefs] = useState<Array<RefObject<HTMLDivElement>>>(
    []
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const {
    isContextMenuOpen,
    setContextMenuOpen,
    setMousePosition,
    selectedResources,
    setSelectedResources,
    setActiveResources,
    isLoading,
    setIsLoading,
    errorModalOpen,
    setErrorModalOpen,
    errorModalMessage,
    setErrorModalMessage,
    setUploadClipboad,
    setFileManagerOpen,
    setUploadMenuOpen,
  } = useExplorer();

  useEffect(() => {
    KeyboardController.GetInstance(window); // Ensures KeyboardController class to be initializated

    // The first time i need to go to the initial path to load the resources in it, but since i have no
    // real data of the initial path i use this mocked data.
    const initialPath = environmentManager.GetEnvironmentVariable(
      "NEXT_PUBLIC_INITIAL_PATH"
    );

    goTo({
      date: "",
      group: "",
      hardLinks: 0,
      isDirectory: true,
      name: "",
      owner: "",
      size: 0,
      time: "",
      shortName: "",
      path: initialPath,
    });
  }, []);

  useEffect(() => {
    if (historyIndex === -1) return;

    setIsLoading(true);
    refresh();
  }, [historyIndex]);

  /**
   * This function calls 'getResourceListFromApi' function and manages the
   * returned promise.
   */
  const refresh = () => {
    const path = history[historyIndex].path;

    getResourceListFromApi(path)
      .then((resources) => {
        setResourceList(resources);
      })
      .catch((err) => {
        const errorCode = err as number;
        setErrorModalMessage(resourceListErrorHandler(errorCode));
        setErrorModalOpen(true);
        restoreHistory();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
      const resourceListEndpoint = `${apiBaseUrl}${RESOURCE_LIST_ENDPOINT}?path=${encodeURIComponent(
        path
      )}`;
      const hiddenResourceNames = [".", ".."];

      axiosInstance
        .get(resourceListEndpoint)
        .then((response) => {
          const resources: Array<Resource> = response.data.data
            .filter(
              (resource: Resource) =>
                !hiddenResourceNames.includes(resource.name)
            )
            .map((resource: Resource) => {
              return { ...resource, shortName: normalizeName(resource.name) };
            });

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
   * and updates the coords x, y of the cursor.
   * It does nothing if the context menu is open
   *
   * @param e - The mouse event
   */
  const updateMousePosition = (e: React.MouseEvent) => {
    if (isContextMenuOpen) return;

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
      setSelectedResources(new Set<Resource>());
    }
  };

  /**
   * This function is called when you release the mouse button and
   * sets all icons as non active.
   */
  const deactiveIcons = () => {
    setActiveResources(new Set<Resource>());
  };

  return (
    <div
      className={`${
        isDragging ? "bg-custom-green-150" : "bg-custom-green-100"
      } w-full min-h-screen flex`}
      onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
    >
      {historyIndex !== -1 && <NavigationHeader />}
      <div
        className="flex flex-wrap content-start items-start pt-24 w-full "
        onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
        onMouseDown={(e) => {
          updateMousePosition(e);
          toggleContextMenuState(
            e,
            isContextMenuOpen,
            setContextMenuOpen,
            contextMenuRef
          );
          deselectResources(e);
          setFileManagerOpen(false);
          setUploadMenuOpen(false);
        }}
        onMouseUp={() => {
          deactiveIcons();
        }}
        onDragEnter={() => setIsDragging(true)}
        onDragExit={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);

          const files = e.dataTransfer.files;

          const filesToUpload: Array<UploadClipboardItem> = Array.from(
            files
          ).map((file) => {
            return {
              id: crypto.randomUUID(),
              file: file,
              enterAnimationPlayed: false,
              status: "queued",
              progress: 0,
            };
          });

          setUploadClipboad(filesToUpload);
        }}
      >
        <CustomContextMenu setContextMenuRef={setContextMenuRef} />
        {resourceList.map((resource, index) => {
          if (resource.isDirectory) {
            return (
              <DirectoryIcon
                resourceData={resource}
                key={`resource_${index}`}
                isSelected={Array.from(selectedResources).some(
                  (selectedResource) =>
                    compareResources(selectedResource, resource)
                )}
                handleAddRef={handleAddRef}
              />
            );
          } else {
            return (
              <FileIcon
                resourceData={resource}
                key={`resource_${index}`}
                isSelected={Array.from(selectedResources).some(
                  (selectedResource) =>
                    compareResources(selectedResource, resource)
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
        message={errorModalMessage}
        type="ERROR"
      />
      <LoadingOverlay isOpen={isLoading} />

      <CustomContextMenuLogic refresh={refresh} resourceList={resourceList} />
      <HelpMenu />
    </div>
  );
}
