import { useEffect, useRef, useState } from "react";
import { useExplorer } from "./explorerProvider";
import { toggleScroll } from "@/utils/utils";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { useNavigation } from "./navigationProvider";
import { ApiResponse } from "@/interfaces";
import { AxiosError } from "axios";
import { CLIENT_DEFAULT_ERROR_MESSAGE } from "@/constants";

interface NewDirectoryProps {
  goTo: (resourceName: string) => void;
}

export default function NewDirectory({ goTo }: NewDirectoryProps) {
  const {
    setNewDirectoryMenuOpen,
    setIsLoading,
    setErrorModalMessage,
    setErrorModalOpen,
  } = useExplorer();
  const { actualPath } = useNavigation();
  const [directoryName, setDirectoryName] = useState<string>("");
  const environmentManager = EnvironmentManager.getInstance();
  const inputRef = useRef<HTMLInputElement>(null);
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );
  const btnStyles = `border border-gray-300 text-gray-300 hover:border-gray-200 
    hover:text-gray-200 disabled:border-gray-400 disabled:text-gray-400 
    active:border-white active:text-white py-2 px-6 rounded-md flex 
    justify-center duration-200`;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const closeModal = () => {
    setNewDirectoryMenuOpen(false);
    toggleScroll(true);
  };

  const handleCreate = () => {
    let createDirectoryUrl = `${apiBaseUrl}/resources/new`;
    createDirectoryUrl += `?path=${actualPath}`;
    createDirectoryUrl +=
      createDirectoryUrl[createDirectoryUrl.length - 1] === "/" ? "" : "/";
    createDirectoryUrl += directoryName;

    setIsLoading(true);

    axiosInstance
      .post(createDirectoryUrl)
      .then(() => {
        goTo("");
      })
      .catch((err) => {
        let errorMessage = CLIENT_DEFAULT_ERROR_MESSAGE;

        if (err instanceof AxiosError && err.response) {
          const errorResponse: ApiResponse<null> = err.response.data;
          errorMessage = errorResponse.message;
        }

        setErrorModalMessage(errorMessage);
        setErrorModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
        closeModal();
      });
  };

  return (
    <div className="w-screen h-screen fixed top-0  left-0 flex justify-center items-center">
      <div className="bg-custom-green-150 w-2/6 rounded-lg overflow-hidden border">
        <div className="w-full flex justify-between items-center p-4 pb-2">
          <button className={btnStyles} type="button" onClick={closeModal}>
            Cancel
          </button>
          <h2 className="text-lg font-semibold">New Directory</h2>
          <button
            className={btnStyles}
            type="button"
            disabled={!directoryName}
            onClick={handleCreate}
          >
            Create
          </button>
        </div>

        <div className="flex flex-col bg-custom-green-50 p-6 space-y-2">
          <label className="text-lg">Directory name</label>
          <input
            type="text"
            className="bg-custom-green-100 w-full h-10 border-gray-500 
            border rounded-lg pl-3 text-xl font-normal focus:outline-none
             focus:border-gray-400 placeholder-gray-500"
            value={directoryName}
            onChange={(e) => setDirectoryName(e.target.value)}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
}
