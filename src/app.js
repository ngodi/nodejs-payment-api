import express, { urlencoded, json } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config } from './config.js';
//import rateLimit from 'express-rate-limit';

const app = express();

app.use(hpp());
app.use(helmet());
app.use(
  cors({
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);
app.use(compression());
app.use(json({ limit: '200mb' }));
app.use(urlencoded({ extended: true, limit: '200mb' }));


  app.use((error, _req, res, next) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);
