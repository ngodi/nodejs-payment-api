import { BadRequestError } from '../../errors/error-handler';
import { PaymentModel } from '../../models/paymentModel';

export const createPaymentTransaction = async (userId, amount) => {
  try {
    const transaction = await PaymentModel.create({ userId, amount });

    return transaction;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const getPaymentTransaction = async (transactionId) => {
  try {
    const transaction = await PaymentModel.findOne({ where: { id: transactionId } });

    return transaction;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};
