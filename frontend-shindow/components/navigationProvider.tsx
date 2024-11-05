import EnvironmentManager from "@/utils/EnvironmentManager";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

interface NavigationContextType {
  actualPath: string;
  setActualPath: Dispatch<SetStateAction<string>>;
  pathHistory: Array<string>;
  setPathHistory: Dispatch<SetStateAction<Array<string>>>;
  historyActualIndex: number;
  setHistoryActualIndex: Dispatch<SetStateAction<number>>;
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
  const [pathHistory, setPathHistory] = useState<Array<string>>([]);
  const [historyActualIndex, setHistoryActualIndex] = useState<number>(0);

  return (
    <NavigationContext.Provider
      value={{
        actualPath,
        setActualPath,
        pathHistory,
        setPathHistory,
        historyActualIndex,
        setHistoryActualIndex,
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
