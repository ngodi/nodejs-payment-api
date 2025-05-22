import { config } from '../config.js';
import HTTP_STATUS from 'http-status-codes';
import { updatePaymentTransaction } from '../services/db/payment.service.js';
import { stripeService } from '../services/stripe/stripe.js';

export const handleStripeWebhook = async (req, res) => {
  const endpointSecret = config.STRIPE_WEBHOOK_SECRET;
  let event = req.body;
  if (endpointSecret) {
    const signature = req.headers['stripe-signature'];
    try {
      event = stripeService.stripe.webhooks.constructEvent(
        `${req.body}`,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(err);
    }
  }

  try {
    const data = event.data.object;
    const eventType = event.type;
    if (eventType === 'checkout.session.completed') {
      // better handled in a background job
      // TODO: add websocket to notify the user
      await updatePaymentTransaction(data.id, 'completed');
    } else if (
      eventType === 'checkout.session.async_payment_failed' ||
      eventType === 'checkout.session.expired' ||
      eventType === 'payment_intent.payment_failed'
    ) {
      // better handled in a background job
      // TODO: add websocket to notify the user
      await updatePaymentTransaction(data.id, 'failed');
    }
    res.send(HTTP_STATUS.OK);
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
