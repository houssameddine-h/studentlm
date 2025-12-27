import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { clearDocuments, uploadDocument } from './routes/documentRoutes.js';
import { query } from './routes/queryRoutes.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
const upload = multer({ dest: '/uploads/' });

// Routes
app.post('/api/upload', upload.array('files'), uploadDocument);
app.post('/api/query', query);
app.post('/api/clear', clearDocuments);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));