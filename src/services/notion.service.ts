import { notion } from '../config/notion.js';
import { env } from '../config/env.js';
import { isPageObject } from '../utils/notion.util.js';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { GoogleBook } from '../types/google-book.js';
import { url } from 'node:inspector';

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
    filter: {
      and: [
        {
          property: 'ISBN',
          rich_text: {
            is_not_empty: true,
          },
        },
        {
          property: 'Google API',
          select: {
            does_not_equal: 'Found',
          },
        },
      ],
    },
  });

  return response.results.filter(isPageObject);

}

export async function updateBook(
    pageId: string,
    book: GoogleBook,
  ): Promise<void> {

    await notion.pages.update({
      page_id: pageId,
      properties: buildBookProperties(book),
    });

  }

function buildBookProperties(book: GoogleBook) {
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
