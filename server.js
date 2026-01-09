const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

const userRoutes = require('./routes/userroutes');

app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  res.send('Referral Management System API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});