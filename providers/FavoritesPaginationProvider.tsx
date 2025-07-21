"use client";
// FavoritesPaginationContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  FC,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface FavoritesPaginationContextType {
  favoritesPagination: any;
  setFavoritesPagination: Dispatch<SetStateAction<any>>;
}

interface FavoritesPaginationProviderProps {
  children: ReactNode;
}

const FavoritesPaginationContext = createContext<
  FavoritesPaginationContextType | undefined
>(undefined);

export const useFavoritesPagination = () => {
  const context = useContext(FavoritesPaginationContext);

  if (!context)
    throw new Error(
      "useFavoritesPagination must be used within a FavoritesPaginationProvider"
    );

  return context;
};

export const FavoritesPaginationProvider: FC<
  FavoritesPaginationProviderProps
> = ({ children }) => {
  const [favoritesPagination, setFavoritesPagination] = useState<any>({});

  return (
    <FavoritesPaginationContext.Provider
      value={{
        favoritesPagination,
        setFavoritesPagination,
      }}
    >
      {children}
    </FavoritesPaginationContext.Provider>
  );
};
