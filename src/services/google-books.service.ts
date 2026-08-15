import { env } from '../config/env.js';
import { BookNotFoundError } from '../errors/book-not-found.error.js';
import { mapGoogleBook } from '../mappers/google-book.mapper.js';
import { GoogleBook } from '../types/google-book.js';

async function searchBooks(query: string): Promise<GoogleBook> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${env.GOOGLE_BOOKS_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch book from Google Books API.');
  }

  const data = await response.json();

  if (data.totalItems === 0) {
    throw new BookNotFoundError(query);
  }
  return mapGoogleBook(data);

}

export async function searchBookByIsbn(
  isbn: string,
) : Promise<GoogleBook> {

  return searchBooks(`isbn:${isbn}`)
}

export async function searchBookByName(
  name: string,
): Promise<GoogleBook> {
  return searchBooks(name);
}