import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Book } from "../types/Book";
import { searchBooks } from "../services/openLibraryService";
import BookCard from "../components/BookCard";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Catalog: undefined;
  Favorites: undefined;
  BookDetails: { bookId: string };
};

type CatalogNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Catalog"
>;

const PAGE_SIZE = 20;

export default function CatalogScreen() {
  const navigation = useNavigation<CatalogNavigationProp>();

  const [query, setQuery] = useState("Harry Potter");
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [loadMoreError, setLoadMoreError] = useState("");

  const hasMore = books.length < totalBooks;

  const loadBooks = useCallback(async (searchTerm: string) => {
    const trimmedQuery = searchTerm.trim();

    if (!trimmedQuery) {
      setBooks([]);
      setTotalBooks(0);
      setPage(1);
      setError("Digite um título ou autor para pesquisar.");
      return;
    }

    setLoading(true);
    setError("");
    setLoadMoreError("");
    setBooks([]);
    setPage(1);
    setTotalBooks(0);

    try {
      const result = await searchBooks(trimmedQuery, 1, PAGE_SIZE);

      setBooks(result.books);
      setTotalBooks(result.total);

      if (result.books.length === 0) {
        setError("Nenhum livro encontrado. Tente outra pesquisa.");
      }
    } catch {
      setError("Não foi possível carregar os livros. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBooks("Harry Potter");
  }, [loadBooks]);

  async function loadMoreBooks() {
    if (loading || loadingMore || refreshing || !hasMore || books.length === 0) {
      return;
    }

    const nextPage = page + 1;

    setLoadingMore(true);
    setLoadMoreError("");

    try {
      const result = await searchBooks(query.trim(), nextPage, PAGE_SIZE);

      setBooks((currentBooks) => {
        const existingIds = new Set(currentBooks.map((book) => book.id));
        const newBooks = result.books.filter(
          (book) => !existingIds.has(book.id),
        );

        return [...currentBooks, ...newBooks];
      });

      setPage(nextPage);
      setTotalBooks(result.total);
    } catch {
      setLoadMoreError("Não foi possível carregar mais livros.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function refreshBooks() {
    if (refreshing || loading) {
      return;
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Digite um título ou autor para pesquisar.");
      return;
    }

    setRefreshing(true);
    setError("");
    setLoadMoreError("");

    try {
      const result = await searchBooks(trimmedQuery, 1, PAGE_SIZE);

      setBooks(result.books);
      setTotalBooks(result.total);
      setPage(1);

      if (result.books.length === 0) {
        setError("Nenhum livro encontrado. Tente outra pesquisa.");
      }
    } catch {
      setError("Não foi possível atualizar os livros. Tente novamente.");
    } finally {
      setRefreshing(false);
    }
  }

  function openBookDetails(book: Book) {
  navigation.navigate("BookDetails", { bookId: book.id });
}

  function renderBook({ item }: { item: Book }) {
    return (
      <BookCard
        book={item}
        onPress={() => openBookDetails(item)}
      />
    );
  }

  function renderListFooter() {
    if (loadingMore) {
      return (
        <ActivityIndicator
          size="small"
          color="#702D3A"
          style={styles.footerLoader}
          accessibilityLabel="Carregando mais livros"
        />
      );
    }

    if (loadMoreError) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerError}>{loadMoreError}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => void loadMoreBooks()}
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar mais livros novamente"
          >
            <Text style={styles.searchButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View style={styles.intro}>
        <Text style={styles.heading}>Descubra sua próxima leitura</Text>

        <Text style={styles.subtitle}>
          Explore livros do mundo inteiro.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Pesquise por título ou autor"
          placeholderTextColor="#8A7779"
          accessibilityLabel="Pesquisar livros por título ou autor"
          returnKeyType="search"
          onSubmitEditing={() => void loadBooks(query)}
          editable={!loading && !refreshing}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => void loadBooks(query)}
          accessibilityRole="button"
          accessibilityLabel="Buscar livros"
          disabled={loading || refreshing}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#702D3A"
          style={styles.loader}
          accessibilityLabel="Carregando livros"
        />
      ) : error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.error}>{error}</Text>

          {query.trim().length > 0 && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => void loadBooks(query)}
              accessibilityRole="button"
              accessibilityLabel="Tentar carregar os livros novamente"
            >
              <Text style={styles.searchButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          key="books-grid"
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={() => void loadMoreBooks()}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={() => void refreshBooks()}
          ListHeaderComponent={
            <Text style={styles.resultsTitle}>
              Livros encontrados ({totalBooks.toLocaleString("pt-BR")})
            </Text>
          }
          ListFooterComponent={renderListFooter}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E7",
  },
  intro: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  heading: {
    color: "#702D3A",
    fontSize: 23,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#66545A",
    fontSize: 15,
    marginTop: 6,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8C8C1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: "#352A2C",
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: "#702D3A",
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  loader: {
    marginTop: 40,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  resultsTitle: {
    color: "#702D3A",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 12,
  },
  row: {
    gap: 12,
  },
  messageContainer: {
    alignItems: "center",
    padding: 24,
  },
  error: {
    color: "#A32626",
    textAlign: "center",
    fontSize: 15,
  },
  retryButton: {
    backgroundColor: "#702D3A",
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    alignItems: "center",
  },
  footerLoader: {
    paddingVertical: 20,
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  footerError: {
    color: "#A32626",
    textAlign: "center",
    fontSize: 14,
  },
});