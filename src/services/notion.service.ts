import { notion } from '../config/notion.js';
import { env } from '../config/env.js';
import { isPageObject, getRichTextProperty, getOptionalRichTextProperty } from '../utils/notion.util.js';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { GoogleBook } from '../types/google-book.js';

export async function validateConection(): Promise<void> {
    await notion.databases.retrieve({
        database_id: env.NOTION_DATABASE_ID,
    });
}

export async function getDatabaseProperties() {
  return await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID!,
  });
}


export async function getPendingBooks(): Promise<PageObjectResponse[]> {
  const response = await notion.databases.query({
    database_id: env.NOTION_DATABASE_ID,
  });

  return response.results.filter(isPageObject);
}

export async function updateBook(
  page: PageObjectResponse,
  book: GoogleBook,
): Promise<void> {

  const currentIsbn = getOptionalRichTextProperty(page, 'ISBN');

  const properties: Record<string, any> = buildBookProperties(book);

  if (!currentIsbn && book.isbn) {
    properties.ISBN = {
      rich_text: [
        {
          text: {
            content: book.isbn,
          },
        },
      ],
    };
  }

  await notion.pages.update({
    page_id: page.id,
    properties,

    ...(book.thumbnail && {
      cover: {
        type: 'external',
        external: {
          url: book.thumbnail,
        },
      },
    }),
  });
}
    

export async function markBookAsNotFound(
  pageId: string,
): Promise<void> {

  await notion.pages.update({
  page_id: pageId,
  properties: buildNotFoundProperties(),
});

}

function buildNotFoundProperties() {
  return {
    'Google API': {
      select: {
        name: 'Not found',
      },
    },

    'API update on': {
      date: {
        start: new Date().toISOString(),
      },
    },
  };
}

function buildBookProperties(book: GoogleBook){
    return {
      'Book name': {
        title: [
          {
            text: {
              content: book.title,
            },
          },
        ],
      }, 

      Author: {
      rich_text: [
        {
          text: {
            content: book.authors.join(', '),
          },
        },
      ],
    },

    Publisher: {
      rich_text: [
        {
          text: {
            content: book.publisher,
          },
        },
      ],
    },

    'Publication date': {
      rich_text: [
        {
          text: {
            content: book.publishedDate,
          },
        },
      ],
    },

    'Page Count': {
      number: book.pageCount,
    },

    Genre: {
      rich_text: [
        {
          text: {
            content: book.categories.join(', '),
          },
        },
      ],
    },

    Language: {
      rich_text: [
        {
          text: {
            content: book.language,
          },
        },
      ],
    },

    Synopsys: {
      rich_text: [
        {
          text: {
            content: book.description,
          },
        },
      ],
    },

    'Google API': {
      select: {
        name: 'Found',
      },
    },

    'API update on': {
      date: {
        start: new Date().toISOString(),
      },
    },

    'cover url': {
      url: book.thumbnail || null,
    },
  };
};
