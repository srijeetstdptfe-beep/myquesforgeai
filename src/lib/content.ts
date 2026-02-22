import fs from 'fs';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'src/content');

export function getCollectionData<T>(collection: string): T[] {
    const collectionPath = path.join(CONTENT_PATH, collection);
    if (!fs.existsSync(collectionPath)) return [];

    const files = fs.readdirSync(collectionPath);
    return files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const filePath = path.join(collectionPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content) as T;
        });
}

export function getEntryData<T>(collection: string, slug: string): T | null {
    const filePath = path.join(CONTENT_PATH, collection, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as T;
}
