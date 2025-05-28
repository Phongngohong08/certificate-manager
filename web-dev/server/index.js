require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const swagger = require('./swagger');

const app = express();

// Middleware
const allowedOrigins = ['http://localhost:3000', 'http://localhost'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockchaincertificate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API routes
// Serve static files from the public directory
app.use(express.static('public'));

// Swagger API Documentation
app.use('/api-docs', swagger.serve, swagger.setup);

// Set up custom Swagger UI
swagger.serveCustomUI(app);

// API routes
app.use('/api/university', require('./routes/university'));
app.use('/api/student', require('./routes/student'));
app.use('/api/certificate', require('./routes/certificate'));
app.use('/api/verify', require('./routes/verify'));
app.use('/api', require('./routes/api'));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API health check
 *     tags: [Health]
 *     description: Check if the API is running properly
 *     responses:
 *       200:
 *         description: API is running properly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
