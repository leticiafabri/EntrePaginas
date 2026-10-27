import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useReadBooks } from "../contexts/ReadBooksContext";
import { Book } from "../types/Book";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  RootStackParamList,
  TabParamList,
} from "../navigation/AppNavigator";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Lidos">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ReadBooksScreen({ navigation }: Props) {
  const { readBooks, isLoading } = useReadBooks();

  function openBookDetails(book: Book) {
  navigation.navigate("BookDetails", { bookId: book.id });
}

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#702D3A" />
        <Text style={styles.loadingText}>Carregando seus livros...</Text>
      </View>
    );
  }

  if (readBooks.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emoji}>📚</Text>
        <Text style={styles.emptyTitle}>Sua estante está esperando!</Text>
        <Text style={styles.emptyText}>
          Quando você marcar um livro como lido e atribuir uma nota, ele
          aparecerá aqui.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={readBooks}
      keyExtractor={(item) => item.book.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Minha estante literária</Text>
          <Text style={styles.headerSubtitle}>
            {readBooks.length}{" "}
            {readBooks.length === 1
              ? "livro lido"
              : "livros lidos"}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
  style={styles.card}
  activeOpacity={0.8}
  onPress={() => openBookDetails(item.book)}
  accessibilityRole="button"
  accessibilityLabel={`Ver detalhes de ${item.book.title}. Autor: ${
    item.book.authors.join(", ") || "Autor não informado"
  }. Avaliação: ${item.rating} de 5 estrelas. Livro lido.`}
  accessibilityHint="Abre os detalhes do livro para consultar suas informações e alterar a avaliação"
>
          {item.book.coverUrl ? (
            <Image
              source={{ uri: item.book.coverUrl }}
              style={styles.cover}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.placeholderEmoji}>📖</Text>
              <Text style={styles.placeholderText}>Sem capa</Text>
            </View>
          )}

          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {item.book.title}
            </Text>

            <Text style={styles.author} numberOfLines={2}>
              {item.book.authors.length > 0
                ? item.book.authors.join(", ")
                : "Autor não informado"}
            </Text>

            <View style={styles.ratingContainer}>
              <View
  style={styles.stars}
  accessible
  accessibilityRole="text"
  accessibilityLabel={`Avaliação: ${item.rating} de 5 estrelas`}
>
  {[1, 2, 3, 4, 5].map((star) => (
    <Text
      key={star}
      style={[
        styles.star,
        star <= item.rating
          ? styles.filledStar
          : styles.emptyStar,
      ]}
      accessible={false}
    >
      ★
    </Text>
  ))}
</View>

              <Text style={styles.ratingText}>
                {item.rating}/5
              </Text>
            </View>

            <Text style={styles.readLabel}>✓ Livro lido</Text>
            <Text style={styles.detailsHint}>Toque para ver detalhes</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 28,
  },
  centered: {
    flex: 1,
    backgroundColor: "#F8F1E7",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  emoji: {
    fontSize: 54,
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#702D3A",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#66545A",
    textAlign: "center",
    lineHeight: 23,
    marginTop: 12,
  },
  loadingText: {
    marginTop: 12,
    color: "#66545A",
    fontSize: 15,
  },
  header: {
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#702D3A",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#66545A",
    marginTop: 5,
  },
card: {
  flexDirection: "row",
  backgroundColor: "#FFFFFF",
  borderRadius: 14,
  padding: 12,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "#E8DCD3",
  elevation: 2,
  minHeight: 44,
},
  cover: {
    width: 95,
    height: 140,
    borderRadius: 8,
    backgroundColor: "#E8DCD3",
  },
  coverPlaceholder: {
    width: 95,
    height: 140,
    borderRadius: 8,
    backgroundColor: "#EFE3D7",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 30,
  },
  placeholderText: {
    color: "#66545A",
    fontSize: 11,
    marginTop: 5,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#702D3A",
    lineHeight: 22,
  },
  author: {
    fontSize: 13,
    color: "#66545A",
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  stars: {
    flexDirection: "row",
  },
  star: {
    fontSize: 19,
    marginRight: 1,
  },
  filledStar: {
    color: "#D49A32",
  },
  emptyStar: {
    color: "#D9CCC1",
  },
  ratingText: {
    color: "#66545A",
    fontSize: 12,
    marginLeft: 5,
    fontWeight: "600",
  },
  readLabel: {
    color: "#527653",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
  },
  detailsHint: {
    color: "#8A7779",
    fontSize: 11,
    marginTop: 4,
  },
});