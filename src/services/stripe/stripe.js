import Stripe from 'stripe';
import { config } from '../../config.js';
import { BadRequestError } from '../../errors/error-handler.js';
import { toDateString } from '../../utils/format-date.js';

class StripeService {
  constructor() {
    this.stripe = Stripe(config.STRIPE_SECRET_KEY);
  }

  createCheckoutSession = async (name, email, amount) => {
    try {
      let customer = await this.exsitingCustomer(email);
      if (!customer) {
        customer = await this.stripe.customers.create({
          email,
          name,
        });
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Bill Payment',
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        customer: customer.id,
        mode: 'payment',
        success_url: config.CLIENT_URL,
        cancel_url: config.CLIENT_URL,
      });
     return {url: session.url, sessionId: session.id, customerId: customer.id, provider: 'stripe'};
    } catch (error) {
      throw new BadRequestError(`${error.message}`);
    }
  };

  getCheckoutSession = async (sessionId) => {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return {
        id: session.id,
        customer_email: session.customer_details.email,
        customer_name: session.customer_details.name,
        amount: session.amount_total/100,
        status: session.status,
        currency: session.currency,
        created: toDateString(session.created),
      };
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };

  getCheckoutSessionsByEmail = async (email) => {
    const customer = await this.exsitingCustomer(email);

    if (!customer) {
      throw new BadRequestError(`No customer found with email:,${email}`);
    }

    const sessions = await this.stripe.checkout.sessions.list({
      customer: customer.id,
      limit: 100,
    });

    const sessionsData = sessions.data.map((session) => {
      return {
        id: session.id,
        customer_email: session.customer_details.email,
        customer_name: session.customer_details.name,
        amount: session.amount_total/100,
        status: session.status,
        currency: session.currency,
        created: toDateString(session.created),
      };
    });

    return sessionsData;
  };

  exsitingCustomer = async (email) => {
    const existingCustomers = await this.stripe.customers.list({ email, limit: 1 });

    let customer;

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    }

    return customer;
  };
}

export const stripeService = new StripeService();
