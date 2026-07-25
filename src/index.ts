import { 
    getPendingBooks,
    updateBook,
} from './services/notion.service.js';
import { searchBookByIsbn } from './services/google-books.service.js';
import { getRichTextProperty, } from './utils/notion.util.js';


const books = await getPendingBooks();

for (const book of books) {
    const isbn = getRichTextProperty(book, 'ISBN');
    
    const googleBook = await searchBookByIsbn(isbn);

    await updateBook(book.id, googleBook);

    console.log(`Updated book: ${googleBook.title}`);
}

