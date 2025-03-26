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
  history: Array<Resource>;
  setHistory: Dispatch<SetStateAction<Array<Resource>>>;
  historyIndex: number;
  goTo: (directory: Resource) => void;
  goBack: (deleteFromHistory?: boolean) => void;
  goForward: () => void;
  restoreHistory: () => void;
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
  const [history, setHistory] = useState<Array<Resource>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const historyPrev = useRef<Array<Resource>>(history);
  const historyPrevIndex = useRef<number>(historyIndex);

  /**
   * Appends a new directory to the history array and updates the current
   * history index.
   * It will cut the history array before if it is needed.
   * This function also saves a copy of the previous value of the history and index
   *
   * @param directory - The directory where you want to go.
   */
  const goTo = (directory: Resource) => {
    historyPrev.current = history;
    historyPrevIndex.current = historyIndex;

    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(directory);
    setHistory(updatedHistory);
    setHistoryIndex((prev) => prev + 1);
  };

  /**
   * Moves the history index back one item and updates it.
   */
  const goBack = () => {
    setHistoryIndex((prev) => prev - 1);
  };

  /**
   * Moves the history index one item forwards and updates
   */
  const goForward = () => {
    setHistoryIndex((prev) => prev + 1);
  };

  /**
   * Restore the index to its previous value.
   * This function is useful when you attempt to acced a folder
   * and some error happens.
   */
  const restoreHistory = () => {
    setHistory(historyPrev.current);
    setHistoryIndex(historyPrevIndex.current);
  };

  return (
    <NavigationContext.Provider
      value={{
        goTo,
        goBack,
        goForward,
        history,
        setHistory,
        historyIndex,
        restoreHistory,
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
