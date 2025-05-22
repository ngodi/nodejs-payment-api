import HTTP_STATUS from 'http-status-codes';
import { BadRequestError } from "../errors/error-handler.js";
import { stripeService } from "../services/stripe/stripe.js";
import { validationResult } from 'express-validator';
import { ValidationError } from "../errors/validation-error.js";

export const makePayment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
  throw new ValidationError("Validation Error", errors);
  }

  try {
    const { name, email, amount } = req.body;
    const url = await stripeService.createCheckoutSession(name, email, amount);

    return res.status(HTTP_STATUS.OK).json({message: "Payment session created successfully", url});
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}

export const getPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await stripeService.getCheckoutSession(transactionId);

    return res.status(HTTP_STATUS.OK).json({ message: "Transaction retrieved successfully", transaction });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}

export const getPayments = async (req, res) => {
  try {
    const { email } = req.query;
    const transactions = await stripeService.getCheckoutSessionsByEmail(email);

    return res.status(HTTP_STATUS.OK).json({ message: "Transactions retrieved successfully", transactions});
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}