import { BookNotFoundError } from './errors/book-not-found.error.js';
import { searchBookByIsbn, searchBookByName } from './services/google-books.service.js';

import { 
    getPendingBooks,
    updateBook,
    markBookAsNotFound,
} from './services/notion.service.js';

import { 
    getOptionalRichTextProperty,
    getRichTextProperty,
    getTitleProperty,
 } from './utils/notion.util.js';


console.log('1. Iniciando...');

const books = await getPendingBooks();

console.log('2. Livros encontrados: ', books.length);

for (const book of books) {
console.log(`3. Processando livro: ${book.id}`);
    const isbn = getOptionalRichTextProperty(book, 'ISBN');
    const title = getTitleProperty(book, 'Book name');

    console.log('4 - ISBN:', isbn);

    try {      
        let googleBook;

        if (isbn) {
            console.log('5 - Buscando por ISBN');
            googleBook = await searchBookByIsbn(isbn);
        } else {
            console.log('5 - ISBN não encontrado. Buscando por nome');
            googleBook = await searchBookByName(title);
        }

        console.log('6 - Encontrou');

        await updateBook(book, googleBook);

        console.log(`Updated book: ${googleBook.title}`);
    } catch (error) {

        console.log('7 - Caiu no catch');

        if (error instanceof BookNotFoundError) {
            if (title) {
                try {
                const googleBook = await searchBookByName(title);

                await updateBook(book, googleBook);

                console.log(`Updated by title: ${googleBook.title}`);

                continue;
                } catch (error) {
                    console.log('Busca por nome falhou:', error);
                }
            }

            await markBookAsNotFound(book.id);

            console.log(`Book not found: ${isbn}`);

            continue;
        }
    }
}
