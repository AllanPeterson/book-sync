import { validateConection } from './services/notion.service.js';

console.log('Validating Notion connection...');
await validateConection();
console.log('Notion connection validated successfully.');