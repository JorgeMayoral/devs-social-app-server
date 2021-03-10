const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());

// Routes
app.use('/api/v1/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server listening in ${NODE_ENV} mode on port ${PORT}...`);
});
