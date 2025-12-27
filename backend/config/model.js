import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: process.env.MODEL });

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: process.env.EMBEDDINGS_MODEL,
});

export const PROMPT = (context, query) => `You are an AI assistant designed to help students by answering questions based on context (documents they upload). Answer the question based on the context provided. Provide response in plaintext format (don't use markdown format). If the context doesn't contain relevant information, say so.

Context:
${context}

Question: ${query}

Answer:`;