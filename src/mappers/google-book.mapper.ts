import { GoogleBook } from '../types/google-book.js';
import { GoogleBooksResponse } from '../types/google-books-response.js';

export function mapGoogleBook(data: GoogleBooksResponse): GoogleBook {
  const volumeInfo = data.items?.[0]?.volumeInfo;

  if (!volumeInfo) {
    throw new Error('Book not found.');
  }

  const identifiers = volumeInfo.industryIdentifiers ?? [];
  const isbn13 = 
    identifiers.find((id) => id.type === 'ISBN_13')?.identifier ??
    identifiers.find((id) => id.type === 'ISBN_10')?.identifier ??
    '';

  return {
    isbn: isbn13,
    title: volumeInfo.title ?? '',
    authors: volumeInfo.authors ?? [],
    publisher: volumeInfo.publisher ?? '',
    publishedDate: volumeInfo.publishedDate ?? '',
    pageCount: volumeInfo.pageCount ?? 0,
    categories: volumeInfo.categories ?? [],
    language: volumeInfo.language ?? '',
    description: volumeInfo.description ?? '',
    thumbnail: volumeInfo.imageLinks?.thumbnail ?? null,
  };
}