import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const stripe = new Stripe(SECRET_KEY, { apiVersion: '2020-08-27' });

var success = false

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    }
);

app.post("/create-payment-intent", async (req, res) => {
    console.log(req.body.amount);
    
    try
    {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount, // subunits of the currency (USD)
            currency: 'usd',
            payment_method_types: ['card'],});
            const clientSecret = paymentIntent.client_secret;
            res.json({clientSecret});
    }
    catch(err)
    {
        res.json(err);
    }
});


app.post("/payment-success", async (req, res) => {
    res.json({success})
})

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
//   const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    //{customer: null},
    {customer: customer.id},
    
    {apiVersion: '2020-08-27'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: null,
    payment_method_types: ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit', 'sofort'],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: null,
    publishableKey: 'pk_test_51L2ihZH8XcWRx3ZXYWgTAHXAy2192jRAEl3EQh56T5hKA5GSJP2FieJ2erTBIfeRFdpLPj4ltd3b4Sk0aD82v77u00rzVM0x0i'
  });
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_5e86c6e36d15de2025dbf2ed329247f494b17f6da8c3d024e42d998d3f45b0bf";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      success = true;
      console.log(`💰 Payment received!, ${paymentIntent.id}`);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));




