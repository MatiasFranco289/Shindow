"use client";

import {
  CLIENT_DEFAULT_ERROR_MESSAGE,
  RESOURCE_LIST_ENDPOINT,
} from "@/constants";
import { ApiResponse, Resource } from "@/interfaces";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { useEffect, useState } from "react";
import DirectoryIcon from "@/components/directoryIcon";
import FileIcon from "@/components/fileIcon";
import { normalizeName } from "@/utils/utils";
import NavigationHeader from "@/components/navigationHeader";
import resourceListErrorHandler from "@/errorHandlers/resourceListErrorHandler";
import CustomModal from "@/components/customModal";
import LoadingOverlay from "@/components/loadingOverlay";

export default function FileExplorer() {
  const environmentManager = EnvironmentManager.getInstance();
  const [actualPath, setActualPath] = useState<string>("");
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const [resourceList, setResourceList] = useState<Array<Resource>>([]);
  const [selectedResourceName, setSelectedResourceName] = useState<string>("/");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // TODO: Files with spaces in the name are not retrieved correctly by the api
  // TODO: Que si se hace click fuera de un directorio o archivo se deseleccione el actual
  // TODO: Mover las funciones de navegacion a otra parte
  // TODO: Agregar funcionalidad de ir adelante
  // TODO: Mover la ruta base a constantes o configuracion
  // TODO: Ver si se puede  agregar mas margin debajo del header sin que se rompa
  // TODO: Cambiar titulo y nombre de la app
  // TODO: Agregar delay al hover del icono de la flechita
  useEffect(() => {
    // The first time the apps looads i call the goTo function to get the resources passing an empty array to not move from the actualPath
    goTo("");
  }, []);

  /**
   * Receives a string with the name of a directory in the server.
   * It will append the name of the directory to the current path and try to get the resources in that path.
   * @param resourceName
   */
  function goTo(resourceName: string) {
    let newPath = actualPath;

    if (actualPath !== "/") {
      newPath += "/";
    }

    newPath += resourceName;
    getResourceListFromApi(newPath);
  }

  /**
   * It will try to get the resources in the previous path by modifing actulPath,
   * removing the text from the end to the first occurence of '/'.
   */
  function goBack() {
    if (actualPath !== "/") {
      const newPath = actualPath.slice(0, actualPath.lastIndexOf("/")) || "/";
      getResourceListFromApi(newPath);
    }
  }

  /**
   * This function calls the endpoint to get the resources of the given path.
   * If the response is ok it will update the actualPath state with the given path.
   *
   * @param path - A string with the path from where retrieve the resources.
   */
  function getResourceListFromApi(path: string) {
    const resourceListEndpoint = `${apiBaseUrl}${RESOURCE_LIST_ENDPOINT}?path=${path}`;
    setIsLoading(true);

    axiosInstance
      .get(resourceListEndpoint)
      .then((response) => {
        setActualPath(path);

        const resources: Array<Resource> = response.data.data.map(
          (resource: Resource) => {
            return { ...resource, name: normalizeName(resource.name) };
          }
        );

        setResourceList(resources);
      })
      .catch((err) => {
        console.error(
          `The following error has occurred while trying to get the resources: `
        );

        if (err.response?.data) {
          const response: ApiResponse<null> = err.response.data;
          const responseCode = response.status_code;
          setModalMessage(resourceListErrorHandler(responseCode));
          console.error(response);
        } else {
          setModalMessage(CLIENT_DEFAULT_ERROR_MESSAGE);
          console.error(err);
        }

        setErrorModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="bg-custom-green-100 w-full min-h-screen">
      <NavigationHeader actualPath={actualPath} goBack={goBack} />

      <div className="mt-16 flex flex-wrap content-start items-start">
        {resourceList.map((resource, index) => {
          if (resource.isDirectory) {
            return (
              <DirectoryIcon
                name={resource.name}
                key={`resource_${index}`}
                isSelected={selectedResourceName === resource.name}
                setSelectedResourceName={setSelectedResourceName}
                updatePath={(resourceName: string) => goTo(resourceName)}
              />
            );
          } else {
            return (
              <FileIcon
                name={resource.name}
                key={`resource_${index}`}
                isSelected={selectedResourceName === resource.name}
                setSelectedResourceName={setSelectedResourceName}
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
