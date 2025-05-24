import { BadRequestError, NotFoundError } from '../../errors/error-handler.js';
import { PaymentModel } from '../../models/paymentModel.js';
import { UserModel } from '../../models/userModel.js';

export const createPaymentTransaction = async (userId, amount, provider, sessionId, customerId) => {
  try {
    const transaction = await PaymentModel.create({ userId, amount, provider, sessionId, customerId });

    return transaction;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const getPaymentTransaction = async (sessionId) => {
  try {
    const transaction = await PaymentModel.findOne({
    where: { sessionId },
    include: [
      {
        model: UserModel,
        attributes: ['name', 'email'],
      },
  ],
});

if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

    return transaction.get({ plain: true });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const getPaymentTransactions = async (email) => {
  try {
    const payments = await UserModel.findOne({
    where: { email },
    include: [
    {
      model: PaymentModel,
      attributes: ['sessionId', 'amount','provider', 'customerId', 'status', 'createdAt'],
    },
  ],
});


    return payments;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

export const updatePaymentTransaction = async (transactionId, status) => {
  try {
    await PaymentModel.update({ status: status}, { where: { sessionId: transactionId } });

  } catch (error) {
    console.error(error);
  }
};