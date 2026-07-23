import { Client } from "@notionhq/client";
import { env } from "./env.js";

export const notion = new Client({
    auth: env.NOTION_TOKEN,
});