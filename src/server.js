import cors from  'cors';
import express from 'express';
import 'dotenv/config';

import { connectMongoDB } from 'db/connectMongoDB.js';
import { logger } from './middleware/logger.js';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';

const app = express();

// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT || 3000;

// Глобальні middleware
app.use(logger);         // 1. Логер першим — бачить усі запити
app.use(express.json()); // 2. Парсинг JSON-тіла
app.use(cors());         // 3. Дозвіл для запитів з інших доменів


// підключаємо групу маршрутів нотаток
app.use(notesRouter);

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
