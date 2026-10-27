import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFavorites } from "../contexts/FavoritesContext";
import { Book } from "../types/Book";

export default function FavoritesScreen() {
  const { favorites, isLoading, toggleFavorite } = useFavorites();

  function renderBook({ item }: { item: Book }) {
    return (
      <View style={styles.bookCard}>
        {item.coverUrl ? (
          <Image
            source={{ uri: item.coverUrl }}
            style={styles.cover}
            resizeMode="cover"
            accessibilityLabel={`Capa do livro ${item.title}`}
          />
        ) : (
          <View style={[styles.cover, styles.noCover]}>
            <Text style={styles.noCoverEmoji}>📚</Text>
          </View>
        )}

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>

          <Text style={styles.author}>
            {item.authors.join(", ") || "Autor não informado"}
          </Text>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => void toggleFavorite(item)}
            accessibilityRole="button"
            accessibilityLabel={`Remover ${item.title} dos favoritos`}
          >
            <Text style={styles.removeButtonText}>
              ♥ Remover dos favoritos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Carregando seus favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Meus favoritos </Text>

      <Text style={styles.subtitle}>
        Seus livros especiais, reunidos em um só lugar.
      </Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderBook}
        contentContainerStyle={[
          styles.list,
          favorites.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>
              Sua estante está vazia
            </Text>
            <Text style={styles.emptyText}>
              Explore o catálogo e adicione seus livros favoritos!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E7",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  heading: {
    color: "#702D3A",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#66545A",
    fontSize: 15,
    marginTop: 6,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
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
    alignItems: "center",
    justifyContent: "center",
  },
  noCoverEmoji: {
    fontSize: 28,
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
  author: {
    color: "#66545A",
    fontSize: 14,
    marginTop: 8,
  },
  removeButton: {
    alignSelf: "flex-start",
    backgroundColor: "#702D3A",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 12,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F1E7",
  },
  message: {
    color: "#66545A",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#702D3A",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyText: {
    color: "#66545A",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
});