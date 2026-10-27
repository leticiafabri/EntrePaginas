import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Book } from "../types/Book";
import { useFavorites } from "../contexts/FavoritesContext";

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export default function BookCard({ book, onPress }: BookCardProps) {
  const { isFavorite } = useFavorites();
  const favorite = isFavorite(book.id);

  const authorText = book.authors.join(", ") || "Autor não informado";

  const yearText = book.firstPublishYear
    ? `Publicado em ${book.firstPublishYear}`
    : "Ano não informado";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${book.title}. ${authorText}. ${yearText}.${
        favorite ? " Livro nos favoritos." : ""
      } Ver detalhes do livro.`}
      accessibilityHint="Abre a página com mais informações sobre este livro"
    >
      <View style={styles.coverContainer}>
        {book.coverUrl ? (
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.cover}
            resizeMode="cover"
            accessible={false}
          />
        ) : (
          <View
            style={[styles.cover, styles.noCover]}
            accessible={false}
          >
            <Text style={styles.noCoverIcon}>📚</Text>
            <Text style={styles.noCoverText}>Sem capa</Text>
          </View>
        )}

        {favorite && (
          <View
            style={styles.favoriteBadge}
            accessible={false}
          >
            <Text style={styles.favoriteIcon}>♥</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={3}>
        {book.title}
      </Text>

      <Text style={styles.author} numberOfLines={2}>
        {authorText}
      </Text>

      <Text style={styles.year}>
        {yearText}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E8DCD3",
  },
  coverContainer: {
    position: "relative",
  },
  cover: {
    width: "100%",
    height: 170,
    borderRadius: 7,
    backgroundColor: "#E8DCD3",
  },
  noCover: {
    justifyContent: "center",
    alignItems: "center",
  },
  noCoverIcon: {
    fontSize: 34,
  },
  noCoverText: {
    color: "#66545A",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
  favoriteBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteIcon: {
    color: "#702D3A",
    fontSize: 23,
  },
  title: {
    color: "#702D3A",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    lineHeight: 19,
  },
  author: {
    color: "#423B3D",
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  year: {
    color: "#66545A",
    fontSize: 11,
    marginTop: 6,
  },
});