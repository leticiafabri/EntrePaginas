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

const STORAGE_KEY = "@entrepaginas:favorites";

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

export function FavoritesProvider({
  children,
}: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedFavorites) {
          const parsedFavorites: Book[] = JSON.parse(storedFavorites);
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadFavorites();
  }, []);

  const isFavorite = useCallback(
    (bookId: string) => favorites.some((book) => book.id === bookId),
    [favorites],
  );

  const toggleFavorite = useCallback(async (book: Book) => {
    let updatedFavorites: Book[] = [];

    setFavorites((currentFavorites) => {
      const alreadyFavorite = currentFavorites.some(
        (favorite) => favorite.id === book.id,
      );

      updatedFavorites = alreadyFavorite
        ? currentFavorites.filter((favorite) => favorite.id !== book.id)
        : [...currentFavorites, book];

      return updatedFavorites;
    });

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedFavorites),
      );
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
    }
  }, []);

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