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

interface PostsContextType {
  posts: any[];
  setPosts: Dispatch<SetStateAction<any[]>>;
}

interface PostsProviderProps {
  children: ReactNode;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);

  if (!context) throw new Error("usePosts must be used within a PostsProvider");

  return context;
};

export const PostsProvider: FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<any[]>([]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
