const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const { version } = require('./../package.json');

// Database Configuration Import
const connectDB = require('./config/db');

// Custom Middleware Imports
const { notFound, errorHandler } = require('./middleware/error.middleware');
const loggingMiddleware = require('./middleware/logging.middleware');

// Route Imports
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

const Logger = require('./utils/logger');

dotenv.config();

const app = express();

//Environment Variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI =
  NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

// Database Connection
connectDB(MONGO_URI);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(loggingMiddleware());

app.use(cors());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);

app.use('/health', (req, res) => res.send('ok'));
app.use('/version', (req, res) => res.send(version));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  Logger.debug(`Server listening in ${NODE_ENV} mode on port ${PORT}...`);
});

module.exports = { app, server };
