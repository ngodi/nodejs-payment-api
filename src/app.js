import express, { urlencoded, json } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config } from './config.js';
import { databaseConnection } from './setupDatabase.js';

import paymentRoutes from './routes/payment.routes.js';
import { CustomError } from './errors/error-handler.js';
import { ValidationError } from './errors/validation-error.js';
import { handleStripeWebhook } from './webhooks/stripe-payments.js';
import { rateLimiter } from './services/rate-limit/express-rate-limiter.js';

export const app = express();

app.use(hpp());
app.use(helmet());
app.use(
  cors({
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use('/api/v1/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(compression());
app.use(json({ limit: '200mb' }));
app.use(urlencoded({ extended: true, limit: '200mb' }));

app.use(rateLimiter.applyLimiter());
app.use('/api/v1/payments', paymentRoutes);
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the payment service',
  });
});

app.use((error, _req, res, next) => {
  if (error instanceof CustomError || error instanceof ValidationError) {
    return res.status(error.statusCode).json(error.serializeErrors());
  }

  next();
});

app.listen(config.SERVER_PORT, () => {
  databaseConnection();
  console.log(`Server is running on port ${config.SERVER_PORT}`);
});
