import cors from  'cors';
import express from 'express';
import 'dotenv/config';

import { connectMongoDB } from 'db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT || 3000;

app.use(logger);

app.use(cors());

// Middleware для парсингу JSON
app.use(express.json());



// Перший маршрут
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note by ID: ${noteId}` });
});


// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// Middleware для обробки помилок
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
