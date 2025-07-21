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

interface JourneyContextType {
  journey: any;
  setJourney: Dispatch<SetStateAction<any[]>>;
}

interface JourneyProviderProps {
  children: ReactNode;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const useJourney = () => {
  const context = useContext(JourneyContext);

  if (!context) throw new Error("useLogs must be used within a LogsProvider");

  return context;
};

export const JourneyProvider: FC<JourneyProviderProps> = ({ children }) => {
  const [journey, setJourney] = useState<any>([]);

  return (
    <JourneyContext.Provider
      value={{
        journey,
        setJourney,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};
