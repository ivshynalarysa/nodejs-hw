import cors from  'cors';
import express from 'express';
import 'dotenv/config';
import pino from 'pino-http';

const app = express();

// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware для парсингу JSON
app.use(express.json());

app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// Перший маршрут
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note by ID: ${noteId}` });
});

app.get('/test-error', (req, res, next) => {
  throw new Error('Simulated server error');
});

// Middleware 404 (після всіх маршрутів)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware для обробки помилок
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const isProd = process.env.NODE_ENV === 'prodaction';
  res.status(500).json({
    message: isProd
    ? 'Internal Server Error' : err.message,

  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
