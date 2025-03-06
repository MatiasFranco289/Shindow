import { useEffect } from "react";
import { useExplorer } from "./explorerProvider";
import { toggleScroll } from "@/utils/utils";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { useNavigation } from "./navigationProvider";
import deleteErrorHandler from "@/errorHandlers/deleteErrorHandler";

interface DeleteResourcesProps {
  refresh: () => void;
}

export default function DeleteResources({ refresh }: DeleteResourcesProps) {
  const {
    selectedResourceNames,
    setDeleteOpen,
    isLoading,
    setIsLoading,
    setErrorModalOpen,
    setErrorModalMessage,
  } = useExplorer();
  const { actualPath } = useNavigation();

  const environmentManager = EnvironmentManager.getInstance();
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const deleteResourceUrl = "resources/delete";

  const btnStyles = `border border-gray-300 text-gray-300 hover:border-gray-200 
    hover:text-gray-200 disabled:border-gray-400 disabled:text-gray-400 
    active:border-white active:text-white py-2 px-6 rounded-md flex 
    justify-center duration-200`;

  useEffect(() => {}, []);

  const onModalClose = () => {
    setDeleteOpen(false);
    toggleScroll(true);
  };

  const deleteResources = () => {
    setIsLoading(true);

    const bodyRequest = {
      recursive: true,
      force: true,
    };

    const deleteRequests = Array.from(selectedResourceNames).map((name) => {
      let finalUrl = `${apiBaseUrl}/${deleteResourceUrl}`;
      finalUrl += `?path= ${encodeURIComponent(actualPath + name)}`;

      return new Promise((resolve, reject) => {
        axiosInstance
          .delete(finalUrl, {
            data: bodyRequest,
          })
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });

    Promise.all(deleteRequests)
      .then(() => {
        refresh();
      })
      .catch((err) => {
        const errorCode = err.status as number;
        setErrorModalMessage(deleteErrorHandler(errorCode));
        setErrorModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-screen h-screen bg-black/10 fixed top-0 left-0 flex justify-center items-center">
      <div className="bg-custom-green-150 p-4 rounded-lg text-center space-y-3">
        <h2 className="text-lg font-semibold">Are you sure?</h2>
        <p>
          {selectedResourceNames.size} resource(s) will be permanently deleted.
        </p>

        <div className="flex justify-between" onClick={onModalClose}>
          <button className={btnStyles} type="button">
            Cancel
          </button>

          <button
            className={btnStyles}
            type="button"
            onClick={deleteResources}
            disabled={isLoading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
