import express from 'express';
import { makePayment } from '../controllers/payment.controller.js';
import { validatePayment } from '../validators/validate-payment.js';

const router = express.Router();

router.post('/make-payment', validatePayment, makePayment);

export default router;