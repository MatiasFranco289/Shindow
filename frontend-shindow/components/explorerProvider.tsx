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
  useEffect,
  useState,
} from "react";

interface ExplorerContextType {
  isContextMenuOpen: boolean;
  setContextMenuOpen: Dispatch<SetStateAction<boolean>>;
  mousePosition: Vector2;
  setMousePosition: Dispatch<SetStateAction<Vector2>>;
  selectedResourceNames: Set<string>;
  setSelectedResourceNames: Dispatch<SetStateAction<Set<string>>>;
  activeResourceNames: Set<string>;
  setActiveResourceNames: Dispatch<SetStateAction<Set<string>>>;
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
  const [activeResourceNames, setActiveResourceNames] = useState<Set<string>>(
    new Set<string>()
  );

  return (
    <ExplorerContext.Provider
      value={{
        isContextMenuOpen,
        setContextMenuOpen,
        mousePosition,
        setMousePosition,
        selectedResourceNames: selectedResourceNames,
        setSelectedResourceNames: setSelectedResourceNames,
        activeResourceNames,
        setActiveResourceNames,
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
