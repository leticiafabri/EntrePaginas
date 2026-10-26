export interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  firstPublishYear: number | null;
  editionCount: number;
  description?: string;
}

export interface BookSearchResponse {
  docs: OpenLibraryBook[];
  numFound: number;
  start: number;
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  edition_count?: number;
}