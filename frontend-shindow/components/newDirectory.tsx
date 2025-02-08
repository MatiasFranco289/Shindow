import { useEffect, useState } from "react";
import { useExplorer } from "./explorerProvider";
import { toggleScroll } from "@/utils/utils";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { useNavigation } from "./navigationProvider";

export default function NewDirectory() {
  const { setNewDirectoryMenuOpen, setIsLoading } = useExplorer();
  const { actualPath } = useNavigation();
  const [directoryName, setDirectoryName] = useState<string>("");
  const environmentManager = EnvironmentManager.getInstance();
  const apiBaseUrl = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_API_BASE_URL"
  );

  const btnStyles = `border border-gray-300 text-gray-300 hover:border-gray-200 
    hover:text-gray-200 disabled:border-gray-400 disabled:text-gray-400 
    active:border-white active:text-white py-2 px-6 rounded-md flex 
    justify-center duration-200`;

  const handleCancel = () => {
    setNewDirectoryMenuOpen(false);
    toggleScroll(true);
  };

  // TODO: Implement this
  const handleCreate = () => {
    let createDirectoryUrl = `${apiBaseUrl}/resources/new`;
    createDirectoryUrl += `?path=${actualPath}`;
    createDirectoryUrl +=
      createDirectoryUrl[createDirectoryUrl.length - 1] === "/" ? "" : "/";
    createDirectoryUrl += directoryName;

    setIsLoading(true);

    axiosInstance
      .post(createDirectoryUrl)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        //
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-screen h-screen fixed top-0  left-0 flex justify-center items-center">
      <div className="bg-custom-green-150 w-2/6 rounded-lg overflow-hidden border">
        <div className="w-full flex justify-between items-center p-4 pb-2">
          <button className={btnStyles} type="button" onClick={handleCancel}>
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
          />
        </div>
      </div>
    </div>
  );
}
