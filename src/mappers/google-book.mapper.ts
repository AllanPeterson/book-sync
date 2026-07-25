import { GoogleBook } from '../types/google-book.js';
import { GoogleBooksResponse } from '../types/google-books-response.js';

export function mapGoogleBook(data: GoogleBooksResponse): GoogleBook {
  const volumeInfo = data.items?.[0]?.volumeInfo;

  if (!volumeInfo) {
    throw new Error('Book not found.');
  }

  return {
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