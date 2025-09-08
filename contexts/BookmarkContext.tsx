import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type BookmarkContextType = {
  bookmarks: string[];
  toggleBookmark: (title: string) => void;
  isBookmarked: (title: string) => boolean;
};

const STORAGE_KEY = "bookmarks";

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  toggleBookmark: () => {},
  isBookmarked: () => false,
});

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) setBookmarks(data.split("(@)"));
      } catch (e) {
        console.error("Failed to load bookmarks:", e);
      }
    };
    loadBookmarks();
  }, []);

  const saveBookmarks = async (newBookmarks: string[]) => {
    setBookmarks(newBookmarks);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newBookmarks.join("(@)"));
    } catch (e) {
      console.error("Failed to save bookmarks:", e);
    }
  };

  const toggleBookmark = (title: string) => {
    if (bookmarks.includes(title)) {
      saveBookmarks(bookmarks.filter(item => item !== title));
    } else {
      saveBookmarks([...bookmarks, title]);
    }
  };

  const isBookmarked = (title: string) => bookmarks.includes(title);

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);
