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

interface ProfileContextType {
  profile: any;
  setProfile: Dispatch<SetStateAction<any>>;
}

interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context)
    throw new Error("useProfile must be used within a ProfileProvider");

  return context;
};

export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<any>();

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
