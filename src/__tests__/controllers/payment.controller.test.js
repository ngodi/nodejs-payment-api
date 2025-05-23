import request from 'supertest';
import express, { json } from 'express';
import { makePayment, getTransaction } from '../../controllers/payment.controller.js';
import * as stripeServiceModule from '../../services/stripe/stripe.js';
import * as userServiceModule from '../../services/db/user.service.js';
import * as paymentServiceModule from '../../services/db/payment.service.js';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestError, ValidationError } from '../../errors/error-handler.js';

jest.mock('../../services/stripe/stripe.js');
jest.mock('../../services/db/user.service.js');
jest.mock('../../services/db/payment.service.js');

const app = express();
app.use(json());
app.post('/api/v1/payments', makePayment);
app.get('/api/v1/payments/:id', getTransaction);

app.use((err, _req, res, next) => {
  if (err instanceof BadRequestError || err instanceof ValidationError) {
     res.status(err.statusCode).send(err.serializeErrors());
  } 

next();
});

describe('POST /api/v1/payments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and URL when payment is successful', async () => {
    stripeServiceModule.stripeService.createCheckoutSession.mockResolvedValue({
      url: 'https://checkout.stripe.com/session/abc123',
      sessionId: 'sess_123',
      customerId: 'cus_123',
      provider: 'stripe',
    });

    userServiceModule.userService.createUser.mockResolvedValue({
      id: 'user_123',
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    paymentServiceModule.createPaymentTransaction.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/v1/payments')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        amount: 20,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url', 'https://checkout.stripe.com/session/abc123');

    expect(stripeServiceModule.stripeService.createCheckoutSession).toHaveBeenCalledWith(
      'Jane Doe',
      'jane@example.com',
      20
    );

    expect(userServiceModule.userService.createUser).toHaveBeenCalledWith('Jane Doe', 'jane@example.com');
    expect(paymentServiceModule.createPaymentTransaction).toHaveBeenCalledWith('user_123', 20, 'stripe', 'sess_123', 'cus_123');
  });

  it('should return 400 on stripe service failure', async () => {
    stripeServiceModule.stripeService.createCheckoutSession.mockRejectedValue(
      new BadRequestError('Stripe failed')
    );

    const res = await request(app)
      .post('/api/v1/payments')
      .send({ name: 'Test User', email: 'test@example.com', amount: 10 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Stripe failed');
    expect(res.body).toHaveProperty('status', 'error');
  });
});

describe('GET /api/v1/payments/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and transaction data when found', async () => {
    const mockTransaction = {
      id: 'txn_123',
      amount: 100,
      sessionId: 'sess_abc',
      provider: 'stripe',
      userId: 'user_1',
      User: {
        name: 'Test User',
        email: 'test@example.com',
      }
    };

    paymentServiceModule.getPaymentTransaction.mockResolvedValue(mockTransaction);

    const res = await request(app).get('/api/v1/payments/sess_abc');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Transaction retrieved successfully');
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.transaction).toMatchObject(mockTransaction);
    expect(paymentServiceModule.getPaymentTransaction).toHaveBeenCalledWith('sess_abc');
  });

  it('should return 400 when an error is thrown', async () => {
    paymentServiceModule.getPaymentTransaction.mockRejectedValue(new BadRequestError('Transaction not found'));

    const res = await request(app).get('/api/v1/payments/invalid_id');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Transaction not found');
    expect(res.body).toHaveProperty('status', 'error');
  });
});