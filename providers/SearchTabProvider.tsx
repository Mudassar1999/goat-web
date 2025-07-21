"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";

interface SearchTabContextProps {
     searchTab: string;
     setSearchTab: React.Dispatch<React.SetStateAction<string>>;
}

const SearchTabContext = createContext<SearchTabContextProps | undefined>(
     undefined
);

interface SearchTabProviderProps {
     children: ReactNode;
}

export const SearchTabProvider: React.FC<SearchTabProviderProps> = ({
     children,
}) => {
     const [searchTab, setSearchTab] = useState<string>("users");

     const value: SearchTabContextProps = {
          searchTab,
          setSearchTab,
     };

     return (
          <SearchTabContext.Provider value={value}>
               {children}
          </SearchTabContext.Provider>
     );
};

export const useSearchTab = () => {
     const context = useContext(SearchTabContext);
     if (!context) {
          throw new Error("useSearchTab must be used within a SearchTabProvider");
     }
     return context;
};