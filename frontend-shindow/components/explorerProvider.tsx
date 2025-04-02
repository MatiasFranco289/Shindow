/**
 * This provider is to save information that needs to be shared
 * between the diferent components involved in the explorer
 */
import { Resource, UploadClipboardItem, Vector2 } from "@/interfaces";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { ClipboardItem } from "@/interfaces";

interface ExplorerContextType {
  isContextMenuOpen: boolean;
  setContextMenuOpen: Dispatch<SetStateAction<boolean>>;
  mousePosition: Vector2;
  setMousePosition: Dispatch<SetStateAction<Vector2>>;
  selectedResources: Set<Resource>;
  setSelectedResources: Dispatch<SetStateAction<Set<Resource>>>;
  clipBoard: Set<ClipboardItem>;
  setClipBoard: Dispatch<SetStateAction<Set<ClipboardItem>>>;
  uploadClipboard: Array<UploadClipboardItem>;
  setUploadClipboad: Dispatch<SetStateAction<Array<UploadClipboardItem>>>;
  activeResources: Set<Resource>;
  setActiveResources: Dispatch<SetStateAction<Set<Resource>>>;
  isNewDirectoryMenuOpen: boolean;
  setNewDirectoryMenuOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  errorModalOpen: boolean;
  setErrorModalOpen: Dispatch<SetStateAction<boolean>>;
  errorModalMessage: string;
  setErrorModalMessage: Dispatch<SetStateAction<string>>;
  isCopyOpen: boolean;
  setCopyOpen: Dispatch<SetStateAction<boolean>>;
  isCutOpen: boolean;
  setCutOpen: Dispatch<SetStateAction<boolean>>;
  isPasteOpen: boolean;
  setPasteOpen: Dispatch<SetStateAction<boolean>>;
  isDeleteOpen: boolean;
  setDeleteOpen: Dispatch<SetStateAction<boolean>>;
  isFileManagerOpen: boolean;
  setFileManagerOpen: Dispatch<SetStateAction<boolean>>;
  isUploadMenuOpen: boolean;
  setUploadMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const ExplorerContext = createContext<ExplorerContextType | undefined>(
  undefined
);

interface ExplorerProviderProps {
  children: ReactNode;
}

export const ExplorerProvider: React.FC<ExplorerProviderProps> = ({
  children,
}) => {
  const [isContextMenuOpen, setContextMenuOpen] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<Vector2>({
    x: 0,
    y: 0,
  });
  const [selectedResources, setSelectedResources] = useState<Set<Resource>>(
    new Set<Resource>()
  );
  const [clipBoard, setClipBoard] = useState<Set<ClipboardItem>>(
    new Set<ClipboardItem>()
  );
  const [activeResources, setActiveResources] = useState<Set<Resource>>(
    new Set<Resource>()
  );
  const [isNewDirectoryMenuOpen, setNewDirectoryMenuOpen] =
    useState<boolean>(false);
  const [isCopyOpen, setCopyOpen] = useState<boolean>(false);
  const [isCutOpen, setCutOpen] = useState<boolean>(false);
  const [isPasteOpen, setPasteOpen] = useState<boolean>(false);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");
  const [isFileManagerOpen, setFileManagerOpen] = useState<boolean>(false);
  const [uploadClipboard, setUploadClipboad] = useState<
    Array<UploadClipboardItem>
  >([]);
  const [isUploadMenuOpen, setUploadMenuOpen] = useState<boolean>(false);
  return (
    <ExplorerContext.Provider
      value={{
        isContextMenuOpen,
        setContextMenuOpen,
        mousePosition,
        setMousePosition,
        selectedResources,
        setSelectedResources,
        activeResources,
        setActiveResources,
        isNewDirectoryMenuOpen,
        setNewDirectoryMenuOpen,
        isLoading,
        setIsLoading,
        errorModalOpen,
        setErrorModalOpen,
        errorModalMessage,
        setErrorModalMessage,
        isCopyOpen,
        setCopyOpen,
        clipBoard,
        setClipBoard,
        isCutOpen,
        setCutOpen,
        isPasteOpen,
        setPasteOpen,
        isDeleteOpen,
        setDeleteOpen,
        isFileManagerOpen,
        setFileManagerOpen,
        uploadClipboard,
        setUploadClipboad,
        isUploadMenuOpen,
        setUploadMenuOpen,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export const useExplorer = (): ExplorerContextType => {
  const context = useContext(ExplorerContext);

  if (context === undefined) {
    throw new Error("useExplorer must be used within a ExplorerProvider");
  }

  return context;
};
