/**
 * This provider is to save information that needs to be shared
 * between the diferent components involved in the explorer
 */
import { Vector2 } from "@/interfaces";
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
  selectedResourceNames: Set<string>;
  setSelectedResourceNames: Dispatch<SetStateAction<Set<string>>>;
  clipBoard: Set<ClipboardItem>;
  setClipBoard: Dispatch<SetStateAction<Set<ClipboardItem>>>;
  activeResourceNames: Set<string>;
  setActiveResourceNames: Dispatch<SetStateAction<Set<string>>>;
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
  const [selectedResourceNames, setSelectedResourceNames] = useState<
    Set<string>
  >(new Set<string>());
  const [clipBoard, setClipBoard] = useState<Set<ClipboardItem>>(
    new Set<ClipboardItem>()
  );
  const [activeResourceNames, setActiveResourceNames] = useState<Set<string>>(
    new Set<string>()
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

  return (
    <ExplorerContext.Provider
      value={{
        isContextMenuOpen,
        setContextMenuOpen,
        mousePosition,
        setMousePosition,
        selectedResourceNames,
        setSelectedResourceNames,
        activeResourceNames,
        setActiveResourceNames,
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
