import Stripe from 'stripe';
import { config } from '../../config.js';
import { BadRequestError } from '../../errors/error-handler.js';

class StripeService {
  constructor() {
    this.stripe = Stripe(config.STRIPE_SECRET_KEY);;
  }

  handlePayment = async (name, email, amount) => {
    try {
      const customer = await this.stripe.customers.create({
        metadata: { name, email },
      });

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
        success_url: `${config.CLIENT_URL}?success=true`,
        cancel_url: `${config.CLIENT_URL}?success=false`,
      });
      return session.url;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };

  handleWebhook = async (req, res) => {
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let event = req.body;
    
    if (endpointSecret) {
      const signature = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        throw new BadRequestError(`Webhook Error: ${err.message}`);
      }
    }

  try {
    const data = event.data.object;
    const eventType = event.type;
    if (eventType === 'checkout.session.completed') {
      const customerId = data.customer;
      const paymentIntentId = data.payment_intent;
      const amount = data.amount_total;
      const status = data.payment_status;
      const customer = await stripe.customers.retrieve(data.customer);
      const email = customer.metadata.email;
    } 
    res.send();
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  }
}

export const stripeService = new StripeService();


