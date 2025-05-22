import express from 'express';
import { getTransactions, getTransaction, getStripeTransaction,getStripeTransactions, makePayment } from '../controllers/payment.controller.js';
import { validatePayment } from '../validators/validate-payment.js';

const router = express.Router();

router.post('/', validatePayment, makePayment);
router.get('/stripe', getStripeTransactions);
router.get('/stripe/:transactionId', getStripeTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransaction);

export default router;
