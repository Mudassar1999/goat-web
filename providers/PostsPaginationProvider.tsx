"use client";
// PostsPaginationContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  FC,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface PostsPaginationContextType {
  postsPagination: any;
  setPostsPagination: Dispatch<SetStateAction<any>>;
}

interface PostsPaginationProviderProps {
  children: ReactNode;
}

const PostsPaginationContext = createContext<
  PostsPaginationContextType | undefined
>(undefined);

export const usePostsPagination = () => {
  const context = useContext(PostsPaginationContext);

  if (!context)
    throw new Error(
      "usePostsPagination must be used within a PostsPaginationProvider"
    );

  return context;
};

export const PostsPaginationProvider: FC<PostsPaginationProviderProps> = ({
  children,
}) => {
  const [postsPagination, setPostsPagination] = useState<any>({});

  return (
    <PostsPaginationContext.Provider
      value={{
        postsPagination,
        setPostsPagination,
      }}
    >
      {children}
    </PostsPaginationContext.Provider>
  );
};
