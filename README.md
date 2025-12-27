# StudentLM RAG Application

A simple Retrieval-Augmented Generation (RAG) application that allows users to upload documents and chat with an AI that answers questions based on the uploaded content.

![RAG Pipeline](https://img.shields.io/badge/RAG-Pipeline-blue) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![LangChain](https://img.shields.io/badge/🦜_LangChain-Enabled-green)

![StudentLM RAG pipeline diagram](/assets/rag_pipeline_diagram.svg "StudentLM RAG pipeline diagram")

## Overview

This project implements a complete RAG pipeline that:
1. Accepts document uploads (.txt, .md, .pdf)
2. Splits documents into semantic chunks
3. Generates embeddings using Google's `gemini-embedding-001` model
4. Stores vectors in ChromaDB
5. Retrieves relevant context for user queries
6. Generates contextual responses using `gemini-2.5-flash`

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend    │────▶│  ChromaDB   │
│   (React)   │     │  (Node.js)   │     │   Vector    │
│             │◀────│  + LangChain │◀────│   Store     │
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Gemini API  │
                    │  (Embeddings │
                    │  + LLM)      │
                    └──────────────┘
```

## Features

- 📄 **Document Upload**: Support for text, markdown, and pdf files
- 🔍 **Semantic Search**: Find relevant information using vector similarity
- 💬 **Interactive Chat**: Natural conversation interface
- 📚 **Source Citations**: Responses include source document references
- 🎯 **Context-Aware**: AI answers based on the uploaded documents

## Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Lucide React (icons)

### Backend
- Node.js & Express
- LangChain.js
- ChromaDB (vector database)
- Google Generative AI (Gemini)
- Multer (file uploads)


## Running the project

### 1. Clone the Repository

```bash
git clone https://github.com/houssameddine-h/studentlm.git
cd studentlm
```

### 2. Set Up ChromaDB

```bash
# Install ChromaDB
pip install chromadb

# Start ChromaDB server
chroma run --host localhost --port 8000
```

### 3. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
echo "PORT=3001" >> .env

# Start the backend server
npm start
```

The backend will run on `http://localhost:3001`

### 4. Set Up Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. **Start all services** (ChromaDB, Backend, Frontend)
2. **Open** `http://localhost:5173` in the browser
3. **Upload documents** using the upload button in the sidebar
4. **Wait** for processing to complete
5. **Ask questions** about your documents in the chat
6. **Get answers** with source citations!

## Example Use Cases

- 📚 Study notes Q&A
- 📄 Document summarization
- 🔬 Research paper analysis
- 📊 Report querying
- 📖 Knowledge base creation

## Configuration

### Backend Configuration

Edit `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

### Text Splitting Parameters

In `backend/config/langchain.js`, adjust chunking settings:

```javascript
const CHUNK_SIZE = 1000; // Adjust chunk size
const CHUNK_OVERLAP = 200; // Adjust chunk overlap
```

### Retrieval Settings

Change the number of retrieved documents in `backend/src/routes/queryRoutes.js`:

```javascript
const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 3, // Change this number
});
```

## 🔒 API Rate Limits

**Gemini Free Tier:**
- 60 requests per minute
- 1,500 requests per day
- Perfect for development and small projects

## Acknowledgments

- [LangChain](https://js.langchain.com/) for the RAG framework
- [ChromaDB](https://www.trychroma.com/) for vector storage
- [Google Gemini](https://ai.google.dev/) for embeddings and LLM
- [Anthropic Claude](https://www.anthropic.com/) for development assistance

---

**Built with ❤️ for learning and experimentation**