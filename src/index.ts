import { validateConection } from './services/notion.service.js';
import { getPendingBooks } from './services/notion.service.js';
import { mapGoogleBook } from './mappers/google-book.mapper.js';
import { searchBookByIsbn } from './services/google-books.service.js';

import { 
    getRichTextProperty, 
    getTitleProperty
} from './utils/notion.util.js';

const books = await getPendingBooks();

for (const book of books) {
    const isbn = getRichTextProperty(book, 'ISBN');
    
    const googleBook = await searchBookByIsbn(isbn);

    console.log(googleBook);
}

