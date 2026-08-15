export class BookNotFoundError extends Error {
  constructor(isbn: string) {
    super(`Book with ISBN ${isbn} not found.`);
    this.name = 'BookNotFoundError';
  }
}