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

// Define the type for the experience form data
interface ExperienceFormData {
  sportId: number | null;
  clubId: number | null;
  teamId: number | null;
  playerPositionId: number | null;
  startDate: string;
  endDate: string;
  currentlyPlayingHere: boolean;
  employmentType: string;
  description: string;
}

// Define the type for the context values
interface ExperienceFormContextType {
  experienceFormData: ExperienceFormData;
  setExperienceFormData: Dispatch<SetStateAction<ExperienceFormData>>;
}

// Define the type for the provider props
interface ExperienceFormProviderProps {
  children: ReactNode;
}

// Create the context
const ExperienceFormContext = createContext<
  ExperienceFormContextType | undefined
>(undefined);

// Create the custom hook to use the context
export const useExperienceFormData = () => {
  const context = useContext(ExperienceFormContext);

  if (!context)
    throw new Error(
      "useExperienceFormData must be used within an ExperienceFormProvider"
    );

  return context;
};

// Create the provider component
export const ExperienceFormProvider: FC<ExperienceFormProviderProps> = ({
  children,
}) => {
  // Initialize state with the default values
  const [experienceFormData, setExperienceFormData] =
    useState<ExperienceFormData>({
      sportId: null,
      clubId: null,
      teamId: null,
      playerPositionId: null,
      startDate: "",
      endDate: "",
      currentlyPlayingHere: false,
      employmentType: "",
      description: "",
    });

  // Provide the state through the context
  return (
    <ExperienceFormContext.Provider
      value={{
        experienceFormData,
        setExperienceFormData,
      }}
    >
      {children}
    </ExperienceFormContext.Provider>
  );
};
