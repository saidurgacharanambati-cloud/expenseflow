import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Public health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    success: true,
    service: 'ExpenseFlow API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// REST API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

// Direct path fallbacks for serverless environments
app.use('/transactions', transactionRoutes);
app.use('/budgets', budgetRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/profile', profileRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
