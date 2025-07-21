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

interface NetworkContextType {
     recommendedProfiles: any;
     setRecommendedProfiles: Dispatch<SetStateAction<any[]>>;
}

interface NetworkProviderProps {
     children: ReactNode;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetworkSuggestion = () => {
     const context = useContext(NetworkContext);

     if (!context) throw new Error("useNetworkSuggestion must be used within a NetworkProvider");

     return context;
};

export const NetworkProvider: FC<NetworkProviderProps> = ({ children }) => {
     const [recommendedProfiles, setRecommendedProfiles] = useState<any>("");

     return (
          <NetworkContext.Provider
               value={{
                    recommendedProfiles,
                    setRecommendedProfiles,
               }}
          >
               {children}
          </NetworkContext.Provider>
     );
};
