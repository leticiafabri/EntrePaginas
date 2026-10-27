import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Book } from "../types/Book";
import { getBookDetails } from "../services/openLibraryService";
import { useFavorites } from "../contexts/FavoritesContext";
import { useReadBooks } from "../contexts/ReadBooksContext";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "BookDetails">;

export default function BookDetailsScreen({ route, navigation }: Props) {
  const { bookId } = route.params;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isRead, getRating, markAsRead, removeReadBook } = useReadBooks();

  const [selectedRating, setSelectedRating] = useState(0);
  const [savingReading, setSavingReading] = useState(false);

  const favorite = book ? isFavorite(book.id) : false;
  const alreadyRead = book ? isRead(book.id) : false;
  const savedRating = book ? getRating(book.id) : undefined;

  const [description, setDescription] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoading(true);
      setError("");
      setBook(null);
      setDescription("");

      try {
        const result = await getBookDetails(bookId);

        if (active) {
          setBook(result);
          setDescription(result.description ?? "");
          navigation.setOptions({ title: result.title });
        }
      } catch {
        if (active) {
          setError("Não foi possível carregar os detalhes do livro.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBook();

    return () => {
      active = false;
    };
  }, [bookId, navigation]);

  useEffect(() => {
    setSelectedRating(savedRating ?? 0);
  }, [bookId, savedRating]);


  async function handleReadingAction() {
    if (!book) {
      return;
    }

    if (alreadyRead) {
      Alert.alert(
        "Remover livro dos lidos?",
        "A nota e o registro de leitura deste livro serão removidos.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Remover",
            style: "destructive",
            onPress: async () => {
              try {
                await removeReadBook(book.id);
                setSelectedRating(0);
                Alert.alert("Livro removido", "O registro de leitura foi removido.");
              } catch {
                Alert.alert(
                  "Erro",
                  "Não foi possível remover o registro de leitura.",
                );
              }
            },
          },
        ],
      );

      return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
      Alert.alert(
        "Escolha uma nota",
        "Selecione de 1 a 5 estrelas antes de marcar o livro como lido.",
      );
      return;
    }

    setSavingReading(true);

    try {
      await markAsRead(book, selectedRating);
      Alert.alert("Leitura registrada!", "Sua avaliação foi salva. ⭐");
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível salvar sua avaliação. Tente novamente.",
      );
    } finally {
      setSavingReading(false);
    }
  }

  async function handleUpdateRating() {
    if (!book || !alreadyRead) {
      return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
      Alert.alert("Escolha uma nota", "A nota deve ser de 1 a 5 estrelas.");
      return;
    }

    setSavingReading(true);

    try {
      await markAsRead(book, selectedRating);
      Alert.alert("Nota atualizada!", "Sua avaliação foi salva. ⭐");
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar sua nota.");
    } finally {
      setSavingReading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size="large"
          color="#702D3A"
          accessibilityLabel="Carregando detalhes do livro"
        />
        <Text style={styles.statusText}>Carregando livro...</Text>
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || "Livro não encontrado."}</Text>

        <TouchableOpacity
          style={styles.readButton}
          onPress={() => navigation.replace("BookDetails", { bookId })}
          accessibilityRole="button"
          accessibilityLabel="Tentar carregar os detalhes novamente"
          accessibilityState={{
  disabled: savingReading,
  busy: savingReading,
}}
        >
          <Text style={styles.readButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {book.coverUrl ? (
        <Image
          source={{ uri: book.coverUrl }}
          style={styles.cover}
          resizeMode="contain"
          accessibilityLabel={`Capa do livro ${book.title}`}
        />
      ) : (
        <View style={[styles.cover, styles.noCover]}>
          <Text style={styles.noCoverEmoji}>📚</Text>
          <Text style={styles.noCoverText}>Capa indisponível</Text>
        </View>
      )}

      <Text style={styles.title}>{book.title}</Text>

      <Text style={styles.authors}>
        {book.authors.length > 0
          ? book.authors.join(", ")
          : "Autor não informado"}
      </Text>

      <TouchableOpacity
        style={[
          styles.favoriteButton,
          favorite && styles.favoriteButtonActive,
        ]}
        onPress={() => void toggleFavorite(book)}
        accessibilityRole="button"
        accessibilityLabel={
          favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          
        }
        accessibilityState={{
  disabled: savingReading,
  busy: savingReading,
}}
      >
        <Text
          style={[
            styles.favoriteButtonText,
            favorite && styles.favoriteButtonTextActive,
          ]}
        >
          {favorite ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos"}
        </Text>
      </TouchableOpacity>

      <View style={styles.readingCard}>
        <Text style={styles.sectionTitle}>
          {alreadyRead ? "Sua avaliação" : "Já leu este livro?"}
        </Text>

        <Text style={styles.ratingSubtitle}>
          {alreadyRead
            ? "Você pode alterar sua nota abaixo."
            : "Avalie sua leitura de 1 a 5 estrelas."}
        </Text>

        <View
          style={styles.starsContainer}
          accessibilityRole="radiogroup"
          accessibilityLabel="Avaliação do livro de uma a cinco estrelas"
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <TouchableOpacity
key={rating}
onPress={() => setSelectedRating(rating)}
accessibilityRole="radio"
accessibilityLabel={`${rating} ${
  rating === 1 ? "estrela" : "estrelas"
}`}
accessibilityState={{
  disabled: savingReading,
  busy: savingReading,
}}
accessibilityHint="Seleciona esta nota para avaliar o livro"
hitSlop={4}
style={styles.starButton}
            >
              <Text
                style={[
                  styles.star,
                  rating <= selectedRating && styles.selectedStar,
                ]}
              >
                {rating <= selectedRating ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.ratingLabel}>
          {selectedRating > 0
            ? `${selectedRating} de 5 estrelas`
            : "Toque nas estrelas para dar sua nota"}
        </Text>

        {alreadyRead ? (
          <TouchableOpacity
  style={styles.readButton}
  onPress={() => void handleUpdateRating()}
  disabled={savingReading || selectedRating === savedRating}
  accessibilityRole="button"
  accessibilityLabel={
    savingReading ? "Salvando nova nota" : "Salvar nova nota"
  }
  accessibilityHint="Atualiza a avaliação deste livro"
  accessibilityState={{
    disabled: savingReading || selectedRating === savedRating,
    busy: savingReading,
  }}
>
            <Text style={styles.readButtonText}>
              {savingReading ? "Salvando..." : "Salvar nova nota"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
  style={styles.readButton}
  onPress={() => void handleReadingAction()}
  disabled={savingReading}
  accessibilityRole="button"
  accessibilityLabel={
    savingReading ? "Salvando leitura" : "Marcar livro como lido"
  }
  accessibilityHint="Adiciona este livro à sua lista de livros lidos após selecionar uma nota"
  accessibilityState={{
    disabled: savingReading,
    busy: savingReading,
  }}
>
            <Text style={styles.readButtonText}>
              {savingReading ? "Salvando..." : "✓ Marcar como lido"}
            </Text>
          </TouchableOpacity>
        )}

        {alreadyRead && (
          <Text style={styles.readStatus}>
            ✓ Este livro está na sua lista de lidos.
          </Text>
        )}

        {alreadyRead && (
          <TouchableOpacity
  style={styles.removeReadButton}
  onPress={() => void handleReadingAction()}
  accessibilityRole="button"
  accessibilityLabel="Remover livro dos lidos"
  accessibilityHint="Remove o registro de leitura e a avaliação deste livro"
  hitSlop={8}
>
            <Text style={styles.removeReadText}>
              Remover dos livros lidos
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.metadataCard}>
        <Text style={styles.metadataLabel}>Primeira publicação</Text>
        <Text style={styles.metadataValue}>
          {book.firstPublishYear ?? "Não informado"}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.metadataLabel}>Quantidade de edições</Text>
        <Text style={styles.metadataValue}>{book.editionCount}</Text>
      </View>

      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Sobre o livro</Text>

        <Text style={styles.description}>
  {description ||
    "Ainda não há uma descrição disponível para este livro."}
</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1E7",
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8F1E7",
  },
  statusText: {
    color: "#66545A",
    fontSize: 15,
    marginTop: 12,
  },
  error: {
    color: "#A32626",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 16,
  },
  cover: {
    width: 190,
    height: 280,
    borderRadius: 10,
    backgroundColor: "#E8DCD3",
    marginBottom: 24,
  },
  noCover: {
    justifyContent: "center",
    alignItems: "center",
  },
  noCoverEmoji: {
    fontSize: 48,
  },
  noCoverText: {
    color: "#66545A",
    marginTop: 8,
  },
  title: {
    color: "#702D3A",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 32,
  },
  authors: {
    color: "#66545A",
    fontSize: 17,
    textAlign: "center",
    marginTop: 12,
  },
  favoriteButton: {
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#702D3A",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 20,
  },
  favoriteButtonActive: {
    backgroundColor: "#702D3A",
  },
  favoriteButtonText: {
    color: "#702D3A",
    fontSize: 15,
    fontWeight: "bold",
  },
  favoriteButtonTextActive: {
    color: "#FFFFFF",
  },
  readingCard: {
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E8DCD3",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#702D3A",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "stretch",
  },
  ratingSubtitle: {
    alignSelf: "stretch",
    color: "#66545A",
    fontSize: 14,
    lineHeight: 21,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  starButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
      minWidth: 44,
  minHeight: 44,
  alignItems: "center",
  justifyContent: "center",

  },
  star: {
    fontSize: 38,
    color: "#C8B8A8",
  },
  selectedStar: {
    color: "#D99A24",
  },
  ratingLabel: {
    color: "#66545A",
    fontSize: 14,
    marginBottom: 16,
  },
  readButton: {
    backgroundColor: "#702D3A",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
    alignSelf: "stretch",
  },
  readButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  readStatus: {
    color: "#47734D",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
  },
  removeReadButton: {
  marginTop: 14,
  padding: 8,
  minHeight: 44,
  justifyContent: "center",
  alignItems: "center",
},
  removeReadText: {
    color: "#A32626",
    fontSize: 14,
    fontWeight: "600",
  },
  metadataCard: {
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E8DCD3",
  },
  metadataLabel: {
    color: "#66545A",
    fontSize: 14,
  },
  metadataValue: {
    color: "#702D3A",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8DCD3",
    marginVertical: 14,
  },
  descriptionSection: {
    alignSelf: "stretch",
    marginTop: 28,
  },
  description: {
    color: "#423B3D",
    fontSize: 16,
    lineHeight: 25,
  },
});