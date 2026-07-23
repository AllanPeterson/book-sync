import { notion } from '../config/notion.js';
import { env } from '../config/env.js';

export async function validateConection(): Promise<void> {
    await notion.databases.retrieve({
        database_id: env.NOTION_DATABASE_ID,
    });
}