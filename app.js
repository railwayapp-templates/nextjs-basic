const express = require('express');
const path = require('path');
require('dotenv').config();
const indexRouter = require('./routes/index');
const clientRouter = require('./src/routes/client.route');
const otpRouter = require('./src/routes/otp.route');
const { connectDB } = require('./src/config/database');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the router for handling routes
app.use('/', indexRouter);
app.use('/api/client', clientRouter);
app.use('/api/otp', otpRouter);

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  });

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('Server startup aborted due to database error.');
    process.exit(1);
  }
};

startServer();
