import express from 'express';
import { getPayments, makePayment } from '../controllers/payment.controller.js';
import { validatePayment } from '../validators/validate-payment.js';

const router = express.Router();

router.post('/pay', validatePayment, makePayment);
router.get('/', getPayments);
router.get('/:transactionId', getPayments);

export default router;
