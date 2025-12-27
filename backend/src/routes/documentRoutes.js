import { CLIENT_ERROR_CODE, SERVER_ERROR_CODE } from "../../config/errors.js";
import { textSplitter } from "../../config/langchain.js";
import { embeddings } from "../../config/model.js";
import { collection, deleteCollection } from "../database/utils.js";
import fs from 'fs/promises';

export async function uploadDocument(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(CLIENT_ERROR_CODE).json({ error: 'No files to upload' });
        }
        const processedFiles = [];
        for (const file of req.files) {
            // Read file content
            const content = await fs.readFile(file.path, 'utf-8');
            // Split into chunks
            const chunks = await textSplitter.createDocuments([content], [
                { source: file.originalname }
            ]);
            // Generate embeddings for each chunk
            const texts = chunks.map(chunk => chunk.pageContent);
            const chunkEmbeddings = await embeddings.embedDocuments(texts);
            // Add to ChromaDB
            const ids = chunks.map((chunk, idx) => `${file.originalname}_${Date.now()}_${idx}`);
            const metadatas = chunks.map(chunk => ({ source: chunk.metadata.source }));
            await collection.add({
                ids,
                embeddings: chunkEmbeddings,
                documents: texts,
                metadatas,
            });
            processedFiles.push({
                name: file.originalname,
                chunks: chunks.length,
            });
            // Clean up uploaded file
            await fs.unlink(file.path);
        }

        res.json({
            success: true,
            files: processedFiles,
            message: `Processed ${processedFiles.length} file(s)`,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(SERVER_ERROR_CODE).json({ error: error.message });
    }
}

export async function clearDocuments(req, res) {
    try {
        await deleteCollection();
        res.json({ success: true, message: 'Documents cleared' });
    } catch (error) {
        console.error('Clear error:', error);
        res.status(SERVER_ERROR_CODE).json({ error: error.message });
    }
} 