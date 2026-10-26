import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Book } from "../types/Book";
import { searchBooks } from "../services/openLibraryService";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Catalog: undefined;
  Favorites: undefined;
  BookDetails: { book: Book };
};

type CatalogNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Catalog"
>;


export default function CatalogScreen() {
const navigation = useNavigation<CatalogNavigationProp>();
  const [query, setQuery] = useState("Harry Potter");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadBooks(searchTerm: string) {
    setLoading(true);
    setError("");

    try {
      const result = await searchBooks(searchTerm);
      setBooks(result.books);

      if (result.books.length === 0) {
        setError("Nenhum livro encontrado. Tente outra pesquisa.");
      }
    } catch {
      setError("Não foi possível carregar os livros. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBooks("Harry Potter");
  }, []);

  function renderBook({ item }: { item: Book }) {
return (
  <TouchableOpacity
    style={styles.bookCard}
    activeOpacity={0.75}
    onPress={() => navigation.navigate("BookDetails", { book: item })}
    accessibilityRole="button"
    accessibilityLabel={`Ver detalhes de ${item.title}`}
  >
    {item.coverUrl ? (
      <Image
        source={{ uri: item.coverUrl }}
        style={styles.cover}
        resizeMode="cover"
        accessibilityLabel={`Capa do livro ${item.title}`}
      />
    ) : (
      <View style={[styles.cover, styles.noCover]}>
        <Text style={styles.noCoverText}>📚</Text>
        <Text style={styles.noCoverLabel}>Sem capa</Text>
      </View>
    )}

    <View style={styles.bookInfo}>
      <Text style={styles.bookTitle} numberOfLines={3}>
        {item.title}
      </Text>

      <Text style={styles.bookAuthor} numberOfLines={2}>
        {item.authors.join(", ") || "Autor não informado"}
      </Text>

      <Text style={styles.bookYear}>
        {item.firstPublishYear
          ? `Publicado em ${item.firstPublishYear}`
          : "Ano não informado"}
      </Text>
    </View>
  </TouchableOpacity>
);
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
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => void loadBooks(query)}
          accessibilityRole="button"
          accessibilityLabel="Buscar livros"
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
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => void loadBooks(query)}
            accessibilityRole="button"
          >
            <Text style={styles.searchButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultsTitle}>Livros encontrados</Text>
          }
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
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8DCD3",
    gap: 14,
  },
  cover: {
    width: 90,
    height: 132,
    borderRadius: 6,
    backgroundColor: "#E8DCD3",
  },
  noCover: {
    justifyContent: "center",
    alignItems: "center",
  },
  noCoverText: {
    fontSize: 28,
  },
  noCoverLabel: {
    color: "#66545A",
    fontSize: 11,
    marginTop: 4,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "center",
  },
  bookTitle: {
    color: "#702D3A",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
  },
  bookAuthor: {
    color: "#423B3D",
    fontSize: 14,
    marginTop: 8,
  },
  bookYear: {
    color: "#66545A",
    fontSize: 12,
    marginTop: 8,
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
  },
});