import { Resource } from "@/interfaces";
import EnvironmentManager from "@/utils/EnvironmentManager";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useRef,
  MutableRefObject,
} from "react";

interface NavigationContextType {
  actualPath: string;
  setActualPath: Dispatch<SetStateAction<string>>;
  pathHistory: MutableRefObject<Array<string>>;
  historyActualIndex: MutableRefObject<number>;
  currentDirectory: Resource | undefined;
  goTo: (directory: Resource) => void;
  goBack: (deleteFromHistory?: boolean) => void;
  goForward: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const environmentManager = EnvironmentManager.getInstance();
  const initialPath = environmentManager.GetEnvironmentVariable(
    "NEXT_PUBLIC_INITIAL_PATH"
  );

  const [actualPath, setActualPath] = useState<string>(initialPath);
  const [currentDirectory, setCurrentDirectory] = useState<Resource>();

  const pathHistory = useRef<Array<string>>([initialPath]);
  let historyActualIndex = useRef<number>(0);

  /**
   * Updates the current path by appending the name of a directory.
   * Calls updateHistory function to update the history.
   * @param directoryName
   */
  const goTo = (directory: Resource) => {
    let newPath = actualPath;
    newPath += directory.name + "/";

    setActualPath(newPath);
    updateHistory(newPath);
  };

  /**
   * Add a new path to the history array and cuts the history
   * before add it if it is needed.
   * @param newPath
   */
  const updateHistory = (newPath: string) => {
    const newPathHistory = pathHistory.current.slice(
      0,
      historyActualIndex.current + 1
    );

    newPathHistory.push(newPath);
    historyActualIndex.current++;
    pathHistory.current = newPathHistory;
  };

  /**
   * Moves the history index one item back and updated the
   * current path with the path stored in that index of the pathHistory
   * variable.
   * It can also delete the last item stored in the history if @deleteFromHistory is true.
   * @param deleteFromHistory - If true, the last item stored in the history will be removed. It is useful when
   * the user attemps to acced a path and fails.
   */
  const goBack = (deleteFromHistory: boolean = false) => {
    historyActualIndex.current--;
    const newPath = pathHistory.current[historyActualIndex.current];

    if (deleteFromHistory) {
      pathHistory.current.pop();
    }

    setActualPath(newPath);
  };

  /**
   * Moves the history index one item forwards and updates
   * the current path with the path stored in that index of the pathHistory
   * variable
   */
  const goForward = () => {
    historyActualIndex.current++;
    const newPath = pathHistory.current[historyActualIndex.current];
    setActualPath(newPath);
  };

  return (
    <NavigationContext.Provider
      value={{
        actualPath,
        setActualPath,
        pathHistory,
        historyActualIndex,
        goTo,
        goBack,
        goForward,
        currentDirectory,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }

  return context;
};
