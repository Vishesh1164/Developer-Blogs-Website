// Importing express 
const express = require('express');
const userRouter = require('./routers/userRouter');
const projectRouter = require('./routers/blogRouter');
const mongoSanitize = require('express-mongo-sanitize');
const contactRouter = require('./routers/contactRouter');
const thoughtRouter = require('./routers/thoughtRouter');
const adminRouter = require('./routers/adminRouter');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');



// Creating an express app
const app = express();
app.use(cookieParser());
app.use(mongoSanitize());
// Use PORT from env or default to 5000
const port = process.env.PORT || 5000;

// CORS setup
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: ['https://developer-blogs-website.vercel.app'],
     credentials: true, // You can add more origins or use a function for dynamic origins
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Routes setup
app.use('/user', userRouter);
app.use('/blog', projectRouter);
app.use('/contact', contactRouter);
app.use('/thought', thoughtRouter);
app.use('/admin', adminRouter);


// Root route - health check
app.get('/', (req, res) => {
  res.send('Response from Express server');
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
