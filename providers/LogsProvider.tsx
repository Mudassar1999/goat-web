"use client";
import {
  createContext,
  useContext,
  ReactNode,
  FC,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface LogsContextType {
  logs: any[];
  setLogs: Dispatch<SetStateAction<any[]>>;
}

interface LogsProviderProps {
  children: ReactNode;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export const useLogs = () => {
  const context = useContext(LogsContext);

  if (!context) throw new Error("useLogs must be used within a LogsProvider");

  return context;
};

export const LogsProvider: FC<LogsProviderProps> = ({ children }) => {
  const [logs, setLogs] = useState<any[]>([]);

  return (
    <LogsContext.Provider
      value={{
        logs,
        setLogs,
      }}
    >
      {children}
    </LogsContext.Provider>
  );
};
