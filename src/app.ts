//app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
};

// Use CORS middleware with specified options
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Mount user routes under the /api/users path
app.use('/api/users', userRoutes);

// Define a simple route to check if the API is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;

