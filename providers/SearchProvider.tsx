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

interface SearchContextType {
     searchValue: any;
     setSearchValue: Dispatch<SetStateAction<any>>;
     userSearch: any;
     setUserSearch: Dispatch<SetStateAction<any[]>>;
     reelsSearch: any;
     setReelsSearch: Dispatch<SetStateAction<any[]>>;
     searchLoading: any;
     setSearchLoading: Dispatch<SetStateAction<any[]>>;
}

interface SearchProviderProps {
     children: ReactNode;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
     const context = useContext(SearchContext);

     if (!context) throw new Error("useSearch must be used within a SearchProvider");

     return context;
};

export const SearchProvider: FC<SearchProviderProps> = ({ children }) => {
     const [userSearch, setUserSearch] = useState<any>("");
     const [searchValue, setSearchValue] = useState<any>("");
     const [reelsSearch, setReelsSearch] = useState<any>("");
     const [searchLoading, setSearchLoading] = useState<any>("");

     return (
          <SearchContext.Provider
               value={{
                    searchValue,
                    setSearchValue,
                    userSearch,
                    setUserSearch,
                    reelsSearch,
                    setReelsSearch,
                    searchLoading,
                    setSearchLoading
               }}
          >
               {children}
          </SearchContext.Provider>
     );
};
