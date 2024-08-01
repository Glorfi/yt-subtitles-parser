import { createLogger, format, log, transports } from 'winston';
import 'winston-mongodb';

const loggerDb =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_LOGS_LINK
    : 'mongodb://127.0.0.1:27017/logs';

const loggerHost =
  process.env.NODE_ENV === 'production'
    ? 'ai-esl-teacher-toolkit-logger.vercel.app'
    : 'localhost';

const createMongoTransport = (retryCount = 0) => {
  return new transports.MongoDB({
    level: 'info',
    db: loggerDb ? loggerDb : '',
    options: { bufferCommands: false },
    collection: 'api_logs',
    expireAfterSeconds: 2592000,
  }).on('error', (err) => {
    console.error('Error connecting to MongoDB transport:', err);
    if (retryCount < 5) {
      // Max 5 retries
      console.log(`Retrying connection... Attempt ${retryCount + 1}`);
      setTimeout(() => {
        logger.clear(); // Clear existing transports
        logger.add(createMongoTransport(retryCount + 1)); // Add new transport
      }, 5000); // Retry after 5 seconds
    } else {
      console.error('Max retry attempts reached. Logging to console only.');
    }
  });
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    format.json()
  ),
  transports: [createMongoTransport()],
});

export default logger;

// transports: [
//   new transports.MongoDB({
//     level: 'info',
//     db: loggerDb ? loggerDb : '', //'mongodb://localhost:27017/logs', // Replace with your MongoDB URI
//     options: { useUnifiedTopology: true },
//     collection: 'api_logs',
//     expireAfterSeconds: 2592000,
//   }).on('error', (err) => {
//     console.error('Error connecting to MongoDB transport:');
//   }),
// ],
