import HTTP_STATUS from 'http-status-codes';
import { BadRequestError } from '../errors/error-handler.js';
import { stripeService } from '../services/stripe/stripe.js';
import { validationResult } from 'express-validator';
import { ValidationError } from '../errors/validation-error.js';
import { userService } from '../services/db/user.service.js';
import { createPaymentTransaction, getPaymentTransaction, getPaymentTransactions, updatePaymentTransaction } from '../services/db/payment.service.js';

export const makePayment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ValidationError('Validation Error', errors);
  }

  try {
    const { name, email, amount } = req.body;
    const {url, sessionId, customerId, provider } = await stripeService.createCheckoutSession(name, email, amount);
    
    const user = await userService.createUser(name, email); // ideally will be run in a background job
    await createPaymentTransaction(user.id, amount, provider, sessionId, customerId); // ideally will be run in a background job

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Payment session created successfully', status: 'success', data: {url, sessionId, customerId, provider} });
  } catch (error) {
    throw new BadRequestError(`${error.message}`);
  }
};

export const getStripeTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await stripeService.getCheckoutSession(transactionId);
    
    if (transaction && (transaction.status === 'completed' || transaction.status === 'failed')) {
      await updatePaymentTransaction(transactionId, transaction.status);
    }

    return res
      .status(HTTP_STATUS.OK)
      .json({ payment: transaction, status: "success", message: 'Transaction retrieved successfully' });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const getStripeTransactions = async (req, res) => {
  try {
    const { email } = req.query;
    const transactions = await stripeService.getCheckoutSessionsByEmail(email);

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Transactions retrieved successfully', status: "success", transactions });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await getPaymentTransaction(id);

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Transaction retrieved successfully', status: "success", transaction });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}

export const getTransactions = async (req, res) => {
  try {
    const { email } = req.query;

    const transactions = await getPaymentTransactions(email);

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Transaction retrieved successfully', status: "success", user: transactions });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}