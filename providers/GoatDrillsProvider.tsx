"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";

interface GoatDrillContextProps {
     isGoatDrill: boolean;
     setGoatDrill: React.Dispatch<React.SetStateAction<boolean>>;
}

const GoatDrillContext = createContext<GoatDrillContextProps | undefined>(
     undefined
);

interface GoatDrillProviderProps {
     children: ReactNode;
}

export const GoatDrillProvider: React.FC<GoatDrillProviderProps> = ({
     children,
}) => {
     const [isGoatDrill, setGoatDrill] = useState<boolean>(true);

     const value: GoatDrillContextProps = {
          isGoatDrill,
          setGoatDrill,
     };

     return (
          <GoatDrillContext.Provider value={value}>
               {children}
          </GoatDrillContext.Provider>
     );
};

export const useGoatDrill = () => {
     const context = useContext(GoatDrillContext);
     if (!context) {
          throw new Error("useGoatDrill must be used within a GoatDrillProvider");
     }
     return context;
};