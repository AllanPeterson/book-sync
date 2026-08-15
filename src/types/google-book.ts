export interface GoogleBook {
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  pageCount: number;
  categories: string[];
  language: string;
  description: string;
  thumbnail: string | null;
}