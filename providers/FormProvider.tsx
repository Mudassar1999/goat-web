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

// Define the type for your form state
interface FormState {
  countryCode: string;
  phoneCode: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: any;
  gender: string;
  height: any;
  weight: any;
  isImperial: boolean;
  sports: any[];
}

// Define the context type
interface FormContextType {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<FormState>>;
}

// Define the props type for the provider
interface FormProviderProps {
  children: ReactNode;
}

// Create a context with initial state
const FormContext = createContext<FormContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

// Create a provider component
export const FormProvider: FC<FormProviderProps> = ({ children }) => {
  const [formState, setFormState] = useState<FormState>({
    countryCode: "",
    phoneCode: "+92",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    gender: "",
    height: null,
    weight: null,
    isImperial: false,
    sports: [
      {
        sportId: null,
        currentlyPlaying: false,
        playingClubId: null,
        playingClubTeamId: null,
        playerPositionId: [],
        dominantFootId: null,
        coaching: false,
        coachingClubId: null,
        coachingClubTeamId: null,
        countries: [],
        leagues: [],
      },
    ],
  });

  return (
    <FormContext.Provider value={{ formState, setFormState }}>
      {children}
    </FormContext.Provider>
  );
};
