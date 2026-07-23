/// <reference types="node" />
import 'dotenv/config';

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = Object.freeze({
  NOTION_TOKEN: getEnv('NOTION_TOKEN'),
  NOTION_DATABASE_ID: getEnv('NOTION_DATABASE_ID'),
  GOOGLE_BOOKS_API_KEY: getEnv('GOOGLE_BOOKS_API_KEY'),
});