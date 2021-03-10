const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieSession = require('cookie-session');
const connectDB = require('./config/db');

// Route Imports
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();

//Environment Variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI = process.env.MONGO_URI;
const COOKIES_SECRET_KEY = process.env.COOKIES_SECRET_KEY;

connectDB(MONGO_URI);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(
  cookieSession({
    name: 'session',
    keys: [COOKIES_SECRET_KEY],
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    cookie: {
      secure: true,
      httpOnly: true,
    },
  }),
);

// Routes
app.use('/api/v1/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server listening in ${NODE_ENV} mode on port ${PORT}...`);
});
