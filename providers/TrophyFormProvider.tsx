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

// Define the type for the trophy form data
interface TrophyFormData {
  sportId: number | null;
  clubId: number | null;
  teamId: number | null;
  leagueId: number | null;
  winningDate: string;
}

interface TrophyFormContextType {
  trophyFormData: TrophyFormData;
  setTrophyFormData: Dispatch<SetStateAction<TrophyFormData>>;
}

interface TrophyFormProviderProps {
  children: ReactNode;
}

const TrophyFormContext = createContext<TrophyFormContextType | undefined>(
  undefined
);

export const useTrophyFormData = () => {
  const context = useContext(TrophyFormContext);

  if (!context)
    throw new Error(
      "useTrophyFormData must be used within a TrophyFormProvider"
    );

  return context;
};

export const TrophyFormProvider: FC<TrophyFormProviderProps> = ({
  children,
}) => {
  const [trophyFormData, setTrophyFormData] = useState<TrophyFormData>({
    sportId: null,
    clubId: null,
    teamId: null,
    leagueId: null,
    winningDate: "",
  });

  return (
    <TrophyFormContext.Provider
      value={{
        trophyFormData,
        setTrophyFormData,
      }}
    >
      {children}
    </TrophyFormContext.Provider>
  );
};
