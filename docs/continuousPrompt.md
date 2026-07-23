# Book Sync - Project Context

## Overview

We're building a **Node.js + TypeScript** automation to synchronize books from a **Notion** database with the **Google Books API**.

This project replaces an existing automation previously built in **Make (Integromat)**. The Make blueprint is only a behavioral reference and **should not dictate the architecture** of this project.

The main goals are:

- Simplicity
- Readability
- Easy maintenance
- Low amount of dependencies
- No overengineering

---

## General Flow

The user manually creates a new book entry in a Notion database.

The only required fields to trigger synchronization are:

- **Book Title**
- **ISBN**

After adding one or more books, the user manually executes:

```bash
npm start
```

The application performs a single synchronization run and exits.

No cron jobs, watchers or webhooks are involved.

---

## Notion Query

The application must query the Notion database using **Notion API filters**, never fetching the entire database and filtering locally.

Only books matching the following conditions should be returned:

- ISBN is not empty
- Google API status is NOT "Found"

The field:

```text
Google API
```

is responsible for indicating whether a book has already been synchronized.

Books already marked as **Found** must be ignored.

---

## Google Books Search

Books are **always searched by ISBN**.

The title must **never** be used as the search query.

Flow:

```text
ISBN
    ↓
Google Books API
    ↓
Search Results
```

If only one result exists, use it.

If multiple books are returned:

1. Compare each returned title with the title stored in Notion.
2. If one matches, use that book.
3. Otherwise, use the first result.

The title is **only** a tie-breaker.

---

## Updating Notion

After retrieving book information:

- Update the existing Notion page.
- Fill the mapped properties.
- Set:

```text
Google API = Found
```

---

## Project Structure

```text
src/
│
├── index.ts
│
├── config/
│   ├── notion.ts
│   └── googleBooks.ts
│
├── services/
│   ├── bookSync.service.ts
│   ├── notion.service.ts
│   └── googleBooks.service.ts
│
├── utils/
│   ├── mapper.ts
│   └── matchBook.ts
│
├── constants/
│   └── notionFields.ts
│
└── types/
    ├── notion.ts
    └── googleBooks.ts
```

---

## File Responsibilities

## index.ts

Application entry point.

Its only responsibility is to start the synchronization process.

Example:

```ts
await syncBooks();
```

---

## bookSync.service.ts

Application orchestrator.

Responsible for the entire synchronization flow.

```text
Fetch pending books
        ↓
For each book
        ↓
Search Google Books
        ↓
Choose best result
        ↓
Map data
        ↓
Update Notion
```

Business rules belong here.

---

## notion.service.ts

Responsible **only** for communicating with the Notion API.

Examples:

- Query pending books
- Update pages
- Build filters

No business logic.

---

## googleBooks.service.ts

Responsible **only** for communicating with Google Books.

It should know nothing about Notion.

---

## mapper.ts

Transforms the Google Books response into the structure expected by the Notion API.

Centralizes all data transformation.

---

## matchBook.ts

Responsible for selecting the best Google Books result whenever multiple books are returned.

Uses the Notion title only as a tie-breaker.

---

## Technologies

- Node.js
- TypeScript
- Native Fetch API
- dotenv
- Notion SDK (preferred if it simplifies the implementation; otherwise native Fetch)

---

## Environment Variables

```env
NOTION_TOKEN=

NOTION_DATABASE_ID=

GOOGLE_BOOKS_API_KEY=
```

No secrets should ever be hardcoded.

---

## Development Principles

The project should always prioritize:

- Simple code
- Small functions
- Clear naming
- Minimal abstractions
- Functional approach over unnecessary classes
- Separation of responsibilities
- Readability over cleverness
- Scalability without premature optimization

Before implementing any new feature, first discuss the behavior and architecture to eliminate ambiguities and avoid unnecessary refactoring.
