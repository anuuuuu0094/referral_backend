const express = require('express');
const dotenv = require('dotenv');
 const cors = require('cors');
 const helmet = require('helmet');
 const morgan = require('morgan');


dotenv.config();

// Routes
const candidateRoutes = require('./routes/candidateRoutes');
const userRoutes = require('./routes/userRoutes');

// DB
const connectDB = require('./config/db');
connectDB();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/users', userRoutes);




// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Root
app.get('/', (req, res) => {
  res.json(
    { message: 'Welcome to the Referral Management System API' }
  );
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});