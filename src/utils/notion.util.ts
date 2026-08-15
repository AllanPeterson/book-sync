import {
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints.js';

export function isPageObject(
  result:
    | PageObjectResponse
    | PartialPageObjectResponse
    | DatabaseObjectResponse
    | PartialDatabaseObjectResponse,
): result is PageObjectResponse {
  return result.object === 'page' && 'properties' in result;
}

export function getOptionalRichTextProperty(
  page: PageObjectResponse,
  propertyName: string,
): string | null {
  const property = page.properties[propertyName];

  if (!property || property.type !== 'rich_text') {
    throw new Error(`Property "${propertyName}" is not a rich_text property.`);
  }

  if (property.rich_text.length === 0) {
    return null;
  }

  return property.rich_text[0]?.plain_text ?? null;
}

export function getRichTextProperty(
  page: PageObjectResponse,
  propertyName: string,
): string {
  const property = page.properties[propertyName];

  if (!property || property.type !== 'rich_text') {
    throw new Error(`Property "${propertyName}" is not a rich_text property.`);
  }

  const value = property.rich_text[0]?.plain_text;

  if (!value) {
    throw new Error(`Property "${propertyName}" is empty.`);
  }

  return value;
}

export function getTitleProperty(
    page: PageObjectResponse,
    propertyName: string,
): string {
    const property = page.properties[propertyName];

    if (!property || property.type !== 'title') {
        throw new Error(`Property "${propertyName}" is not a title property.`);
    }

     const value = property.title[0]?.plain_text;

  if (!value) {
    throw new Error(`Property "${propertyName}" is empty.`);
  }

  return value;
}
