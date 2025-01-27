"use client";

import {
  CLIENT_DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_CODE_SERVICE_UNAVAILABLE,
  RESOURCE_LIST_ENDPOINT,
} from "@/constants";
import {
  ApiResponse,
  ContextMenuItemData,
  Position2D,
  Resource,
} from "@/interfaces";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { useEffect, useState, useRef, SetStateAction, use } from "react";
import DirectoryIcon from "@/components/directoryIcon";
import FileIcon from "@/components/fileIcon";
import { normalizeName } from "@/utils/utils";
import NavigationHeader from "@/components/navigationHeader";
import resourceListErrorHandler from "@/errorHandlers/resourceListErrorHandler";
import CustomModal from "@/components/customModal";
import LoadingOverlay from "@/components/loadingOverlay";
import { useNavigation } from "@/components/navigationProvider";
import ContextMenu from "@/components/contextMenu";
import UploadMenu from "@/components/uploadMenu";
import { FaUpload } from "react-icons/fa6";

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
  const [selectedResourceName, setSelectedResourceName] = useState<string>("/");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuItems, setContextMenuItems] =
    useState<Array<ContextMenuItemData>>();
  const [contextMenuPosition, setContextMenuPosition] = useState<Position2D>({
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef<HTMLUListElement>(null);
  const [showUploadMenu, setShowUploadMenu] = useState<boolean>(false);
  const [uploadPath, setUploadPath] = useState<string>(actualPath);

  const contextMenuItemsExplorer = [
    {
      icon: <FaUpload />,
      title: "Upload",
      function: () => {
        setShowUploadMenu(true);
        setShowContextMenu(false);
        updateUploadPath("");
      },
    },
  ];

  useEffect(() => {
    // The first time the apps looads i call the goTo function to get the resources passing an empty array to not move from the actualPath
    goTo("");

    // Listen for the left-click event
    document.addEventListener("click", hideContextMenu);

    // Listen for the right-click event
    document.addEventListener("contextmenu", handleContextMenuPosition);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("contextmenu", handleContextMenuPosition);
      document.removeEventListener("click", hideContextMenu);
    };
  }, []);

  /**
   * Receives a string with the name of a directory in the server.
   * It will append the name of the directory to the current path and try to get the resources in that path.
   * @param resourceName
   */
  async function goTo(resourceName: string) {
    let newPath = actualPath;

    if (actualPath !== "/" && resourceName != "") {
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
   * This function makes sure that the context menu closes when a click is detected outside of the context menu itself
   * @param event - The mouse event
   */
  const hideContextMenu = (event: MouseEvent) => {
    if (
      contextMenuRef.current &&
      !contextMenuRef.current.contains(event.target as Node)
    ) {
      setShowContextMenu(false);
    }
  };

  /**
   * This function handles the position of the context menu according to its position on the page. It ensures that the context menu doesn't overflow the page itself.
   * @param event - The mouse event
   */
  const handleContextMenuPosition = (event: MouseEvent) => {
    event.preventDefault();

    const { pageX, pageY, clientX, clientY } = event;

    const menuWidth = contextMenuRef.current?.offsetWidth || 0;
    const menuHeight = contextMenuRef.current?.offsetHeight || 0;

    const spaceRight = window.innerWidth - clientX;
    const spaceBottom = window.innerHeight - clientY;

    let newLeft = pageX;
    let newTop = pageY;

    if (spaceRight < menuWidth) {
      // If there's not enough space on the right, position the menu to the left
      newLeft = pageX - menuWidth;
    }

    if (spaceBottom < menuHeight) {
      // If there's not enough space below, position the menu above
      newTop = pageY - menuHeight;
    }

    setContextMenuPosition({ x: newLeft, y: newTop });
  };

  /**
   * This function takes care of showing the context menu when a right click is detected.
   * @param event - Mouse event
   */
  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowContextMenu(true);
    setContextMenuPosition({
      x: event.pageX,
      y: event.pageY,
    });
  };

  /**
   * Function that sets the items on the context menu.
   * @param items - The items that the context menu will show
   */
  function getContextMenuItems(items: Array<ContextMenuItemData>): void {
    setContextMenuItems(items);
  }

  /**
   * Function to update the upload path based on the resource name.
   * If the resource name is empty, then the uploadPath will be the current path
   * @param resourceName - The name of the resource that'll be used to update the path
   */
  const updateUploadPath = (resourceName: string) => {
    let newPath = actualPath;
    if (resourceName != "") newPath += "/" + resourceName;
    setUploadPath(newPath);
  };

  return (
    <div
      className="bg-custom-green-100 w-full min-h-screen"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div onContextMenu={() => setShowContextMenu(false)}>
        <NavigationHeader
          goBack={goBack}
          goForward={goForward}
          canGoForward={pathHistory.length > historyActualIndex}
        />
      </div>

      <div
        className="flex flex-wrap content-start items-start pt-24 min-h-screen relative"
        onContextMenu={handleRightClick}
      >
        <div
          className=" w-full min-h-screen absolute inset-0"
          onContextMenu={() => {
            setContextMenuItems(contextMenuItemsExplorer);
          }}
        ></div>
        {resourceList.map((resource, index) => {
          if (resource.isDirectory) {
            return (
              <DirectoryIcon
                name={resource.name}
                shortName={resource.shortName}
                key={`resource_${index}`}
                isSelected={selectedResourceName === resource.name}
                setSelectedResourceName={setSelectedResourceName}
                updatePath={(resourceName: string) => goTo(resourceName)}
                setContextMenuItems={getContextMenuItems}
                showUploadMenu={setShowUploadMenu}
                updateUploadPath={updateUploadPath}
              />
            );
          } else {
            return (
              <FileIcon
                name={resource.name}
                shortName={resource.shortName}
                key={`resource_${index}`}
                isSelected={selectedResourceName === resource.name}
                setSelectedResourceName={setSelectedResourceName}
                setContextMenuItems={getContextMenuItems}
              />
            );
          }
        })}
        {showContextMenu && (
          <ContextMenu
            position={contextMenuPosition}
            reference={contextMenuRef}
            items={contextMenuItems}
          />
        )}
      </div>
      {showUploadMenu && (
        <UploadMenu
          setMenuOpen={setShowUploadMenu}
          uploadPath={uploadPath}
          refreshPage={goTo}
        />
      )}
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
