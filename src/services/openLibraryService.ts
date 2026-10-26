import {
  Book,
  BookSearchResponse,
  OpenLibraryBook,
} from "../types/Book";

const BASE_URL = "https://openlibrary.org";

function mapOpenLibraryBook(book: OpenLibraryBook): Book {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  return {
    id: book.key,
    title: book.title,
    authors: book.author_name ?? [],
    coverUrl,
    firstPublishYear: book.first_publish_year ?? null,
    editionCount: book.edition_count ?? 0,
  };
}

export async function searchBooks(
  query: string,
  page: number = 1,
  limit: number = 20,
): Promise<{ books: Book[]; total: number }> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return { books: [], total: 0 };
  }

  const params = new URLSearchParams({
    q: trimmedQuery,
    page: String(page),
    limit: String(limit),
    fields:
      "key,title,author_name,cover_i,first_publish_year,edition_count",
  });

  const response = await fetch(
    `${BASE_URL}/search.json?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar os livros. Tente novamente.");
  }

  const data: BookSearchResponse = await response.json();

  return {
    books: data.docs.map(mapOpenLibraryBook),
    total: data.numFound,
  };
}

export async function getBookDetails(bookId: string): Promise<Book> {
  const response = await fetch(
    `${BASE_URL}${bookId}.json`,
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar os detalhes do livro.");
  }

  const data = await response.json();

  return {
    id: bookId,
    title: data.title ?? "Título indisponível",
    authors: [],
    coverUrl: data.covers?.[0]
      ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
      : null,
    firstPublishYear: null,
    editionCount: 0,
    description:
      typeof data.description === "string"
        ? data.description
        : data.description?.value,
  };
}