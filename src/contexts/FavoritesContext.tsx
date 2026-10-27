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

interface FavoritesContextData {
  favorites: Book[];
  isLoading: boolean;
  isFavorite: (bookId: string) => boolean;
  toggleFavorite: (book: Book) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextData | undefined>(
  undefined,
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = user
    ? `@entrepaginas:favorites:${user.id}`
    : null;

  useEffect(() => {
    let isActive = true;

    async function loadFavorites() {
      setIsLoading(true);
      setFavorites([]);

      if (!storageKey) {
        setIsLoading(false);
        return;
      }

      try {
        const storedFavorites = await AsyncStorage.getItem(storageKey);

        if (isActive && storedFavorites) {
          setFavorites(JSON.parse(storedFavorites) as Book[]);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      isActive = false;
    };
  }, [storageKey]);

  const isFavorite = useCallback(
    (bookId: string) => favorites.some((book) => book.id === bookId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (book: Book) => {
      if (!storageKey) return;

      const alreadyFavorite = favorites.some(
        (favorite) => favorite.id === book.id,
      );

      const updatedFavorites = alreadyFavorite
        ? favorites.filter((favorite) => favorite.id !== book.id)
        : [...favorites, book];

      setFavorites(updatedFavorites);

      try {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(updatedFavorites),
        );
      } catch (error) {
        console.error("Erro ao salvar favoritos:", error);
        setFavorites(favorites);
      }
    },
    [favorites, storageKey],
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, isLoading, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites deve ser utilizado dentro de FavoritesProvider.",
    );
  }

  return context;
}