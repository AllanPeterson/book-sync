import { notion } from '../config/notion.js';
import { env } from '../config/env.js';
import { isPageObject } from '../utils/notion.util.js';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';

export async function validateConection(): Promise<void> {
    await notion.databases.retrieve({
        database_id: env.NOTION_DATABASE_ID,
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