export interface GoogleBooksResponse {
  items: {
    volumeInfo: {
      title?: string;
      authors?: string[];
      publisher?: string;
      publishedDate?: string;
      pageCount?: number;
      categories?: string[];
      language?: string;
      description?: string;
      imageLinks?: {
        thumbnail?: string | null;
      };
    };
  }[];
}