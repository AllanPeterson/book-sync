import { env } from '../config/env.js';
import { mapGoogleBook } from '../mappers/google-book.mapper.js';
import { GoogleBook } from '../types/google-book.js';

export async function searchBookByIsbn(isbn: string,) : Promise<GoogleBook> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${env.GOOGLE_BOOKS_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch book from Google Books API.');
  }

  const data = await response.json();
  return mapGoogleBook(data);
}