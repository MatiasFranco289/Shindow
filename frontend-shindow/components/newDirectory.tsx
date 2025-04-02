import { useEffect, useRef, useState } from "react";
import { useExplorer } from "./explorerProvider";
import { toggleScroll } from "@/utils/utils";
import axiosInstance from "@/utils/axiosInstance";
import EnvironmentManager from "@/utils/EnvironmentManager";
import { useNavigation } from "./navigationProvider";
import newDirectoryErrorHandler from "@/errorHandlers/newDirectoryErrorHandler";

interface NewDirectoryProps {
  refresh: () => void;
}

export default function NewDirectory({ refresh }: NewDirectoryProps) {
  const {
    setNewDirectoryMenuOpen,
    setIsLoading,
    setErrorModalMessage,
    setErrorModalOpen,
    setSelectedResources,
  } = useExplorer();
  const { history, historyIndex } = useNavigation();
  const [directoryName, setDirectoryName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    createDirectoryUrl += `?path=${encodeURIComponent(
      history[historyIndex].path
    )}`;
    createDirectoryUrl += `&name=${encodeURIComponent(directoryName)}`;

    setIsLoading(true);

    axiosInstance
      .post(createDirectoryUrl)
      .then(() => {
        refresh();
      })
      .catch((err) => {
        const errorCode = err.status as number;
        setErrorModalMessage(newDirectoryErrorHandler(errorCode));
        setErrorModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
        closeModal();
      });
  };

  const handleInputChange = (newInputValue: string) => {
    setDirectoryName(newInputValue);
    validate(newInputValue);
  };

  /** Each validation is an object with a method 'validate'. The validate
  method returns true if the validations succed, otherwise it return false
  and set the error message in the state 'errorMessage'. */
  const validate = (inputValue: string) => {
    const validations = [
      {
        validate: () => {
          const invalidDirectoryNames = [".", ".."];

          const invalidName = invalidDirectoryNames.find(
            (invalidName) => inputValue === invalidName
          );

          if (invalidName) {
            setErrorMessage(`A directory cannot be called "${invalidName}"`);
            return false;
          }

          return true;
        },
      },
      {
        validate: () => {
          const invalidDirectoryCharacters = ["/"];

          const invalidCharacter = invalidDirectoryCharacters.find(
            (invalidChar) => inputValue.includes(invalidChar)
          );

          if (invalidCharacter) {
            setErrorMessage(
              `Directory names cannot contain "${invalidCharacter}"`
            );
            return false;
          }

          return true;
        },
      },
      {
        validate: () => {
          const isNameTooLong = inputValue.length > 255;

          if (isNameTooLong) {
            setErrorMessage("Directory name is too long");
            return false;
          }

          return true;
        },
      },
    ];

    const validationsSucced = validations.find(
      (validation) => validation.validate() === false
    );

    if (validationsSucced) return;

    setErrorMessage("");
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
            disabled={!directoryName || !!errorMessage}
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
            onChange={(e) => handleInputChange(e.target.value)}
            ref={inputRef}
          />

          <p>{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}
