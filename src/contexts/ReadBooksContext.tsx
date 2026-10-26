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

const STORAGE_KEY = "@entrepaginas:readBooks";

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
  const [readBooks, setReadBooks] = useState<ReadBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReadBooks() {
      try {
        const storedBooks = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedBooks) {
          const parsedBooks: ReadBook[] = JSON.parse(storedBooks);
          setReadBooks(parsedBooks);
        }
      } catch (error) {
        console.error("Erro ao carregar livros lidos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadReadBooks();
  }, []);

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
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("A nota deve ser um número inteiro de 1 a 5.");
      }

      const existing = readBooks.find(
        (item) => item.book.id === book.id,
      );

      const updatedBooks: ReadBook[] = existing
        ? readBooks.map((item) =>
            item.book.id === book.id
              ? { book, rating }
              : item,
          )
        : [...readBooks, { book, rating }];

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedBooks),
      );

      setReadBooks(updatedBooks);
    },
    [readBooks],
  );

  const removeReadBook = useCallback(
    async (bookId: string) => {
      const updatedBooks = readBooks.filter(
        (item) => item.book.id !== bookId,
      );

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedBooks),
      );

      setReadBooks(updatedBooks);
    },
    [readBooks],
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
