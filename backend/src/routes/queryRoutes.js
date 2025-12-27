import { embeddings, model, PROMPT } from "../../config/model.js";
import { collection } from "../database/utils.js";

export async function query(req, res) {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        // Generate query embedding
        const queryEmbedding = await embeddings.embedQuery(query);
        // Search in ChromaDB
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 3,
        });
        // Extract relevant documents
        const relevantDocs = results.documents[0] || [];
        const sources = results.metadatas[0] || [];
        // Build context from retrieved documents
        const context = relevantDocs
            .map((doc, idx) => `Document ${idx + 1} (${sources[idx]?.source}):\n${doc}`)
            .join('\n\n');
        // Create prompt for the model
        const prompt = PROMPT(context, query);
        // Query the model
        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        res.json({
            answer,
            sources: sources.map(s => s.source),
            retrievedDocs: relevantDocs.length,
        });
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ error: error.message });
    }
}