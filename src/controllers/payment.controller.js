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
    const response = await stripeService.handlePayment(name, email, amount);

    return res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}