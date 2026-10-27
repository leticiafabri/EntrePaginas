import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Book } from "../types/Book";

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export default function BookCard({ book, onPress }: BookCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${book.title}`}
    >
      {book.coverUrl ? (
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.cover}
          resizeMode="cover"
          accessibilityLabel={`Capa do livro ${book.title}`}
        />
      ) : (
        <View style={[styles.cover, styles.noCover]}>
          <Text style={styles.noCoverIcon}>📚</Text>
          <Text style={styles.noCoverText}>Sem capa</Text>
        </View>
      )}

      <Text style={styles.title} numberOfLines={3}>
        {book.title}
      </Text>

      <Text style={styles.author} numberOfLines={2}>
        {book.authors.join(", ") || "Autor não informado"}
      </Text>

      <Text style={styles.year}>
        {book.firstPublishYear
          ? `Publicado em ${book.firstPublishYear}`
          : "Ano não informado"}
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