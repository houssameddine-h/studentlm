import { ChromaClient } from 'chromadb';
import { COLLECTION_NAME } from '../../config/chromadb.js';

// Initialize client
export const chromaClient = new ChromaClient();

export let collection = initCollection();

async function initCollection() {
  try {
    // Try to get existing collection or create new one
    try {
      collection = await chromaClient.getCollection({ name: COLLECTION_NAME });
      console.log('Using existing collection');
    } catch {
      collection = await chromaClient.createCollection({ name: COLLECTION_NAME });
      console.log('Created new collection');
    }
  } catch (error) {
    console.error('ChromaDB initialization error:', error);
  }
}

export async function deleteCollection() {
    await chromaClient.deleteCollection({ name: COLLECTION_NAME });
    collection = await initCollection();
}