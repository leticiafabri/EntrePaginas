import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Book } from "../types/Book";
import { useAuth } from "./AuthContext";

export interface ReadBook {
  book: Book;
  rating: number;
}

interface ReadBooksContextData {
  readBooks: ReadBook[];
  isLoading: boolean;
  isRead: (bookId: string) => boolean;
  getRating: (bookId: string) => number | undefined;
  markAsRead: (book: Book, rating: number) => Promise<void>;
  removeReadBook: (bookId: string) => Promise<void>;
}

const ReadBooksContext = createContext<
  ReadBooksContextData | undefined
>(undefined);

interface ReadBooksProviderProps {
  children: ReactNode;
}

export function ReadBooksProvider({
  children,
}: ReadBooksProviderProps) {
  const { user } = useAuth();

  const [readBooks, setReadBooks] = useState<ReadBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = user
    ? `@entrepaginas:readBooks:${user.id}`
    : null;

  useEffect(() => {
    let isActive = true;

    async function loadReadBooks() {
      setIsLoading(true);
      setReadBooks([]);

      if (!storageKey) {
        setIsLoading(false);
        return;
      }

      try {
        const storedBooks = await AsyncStorage.getItem(storageKey);

        if (isActive && storedBooks) {
          setReadBooks(JSON.parse(storedBooks) as ReadBook[]);
        }
      } catch (error) {
        console.error("Erro ao carregar livros lidos:", error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadReadBooks();

    return () => {
      isActive = false;
    };
  }, [storageKey]);

  const isRead = useCallback(
    (bookId: string) =>
      readBooks.some((item) => item.book.id === bookId),
    [readBooks],
  );

  const getRating = useCallback(
    (bookId: string) =>
      readBooks.find((item) => item.book.id === bookId)?.rating,
    [readBooks],
  );

  const markAsRead = useCallback(
    async (book: Book, rating: number) => {
      if (!storageKey) return;

      const updatedBooks = [
        ...readBooks.filter((item) => item.book.id !== book.id),
        { book, rating },
      ];

      setReadBooks(updatedBooks);

      try {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(updatedBooks),
        );
      } catch (error) {
        console.error("Erro ao salvar livro lido:", error);
        setReadBooks(readBooks);
      }
    },
    [readBooks, storageKey],
  );

  const removeReadBook = useCallback(
    async (bookId: string) => {
      if (!storageKey) return;

      const updatedBooks = readBooks.filter(
        (item) => item.book.id !== bookId,
      );

      setReadBooks(updatedBooks);

      try {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(updatedBooks),
        );
      } catch (error) {
        console.error("Erro ao remover livro lido:", error);
        setReadBooks(readBooks);
      }
    },
    [readBooks, storageKey],
  );

  return (
    <ReadBooksContext.Provider
      value={{
        readBooks,
        isLoading,
        isRead,
        getRating,
        markAsRead,
        removeReadBook,
      }}
    >
      {children}
    </ReadBooksContext.Provider>
  );
}

export function useReadBooks() {
  const context = useContext(ReadBooksContext);

  if (!context) {
    throw new Error(
      "useReadBooks deve ser utilizado dentro de ReadBooksProvider.",
    );
  }

  return context;
}
