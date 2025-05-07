const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { priceId, userId, examId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `https://www.iccpracticeexams.com/exams?success=true&examId=${examId}`,
      cancel_url: `https://www.iccpracticeexams.com/exams?canceled=true`,
      metadata: { userId, examId },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/check-access', (req, res) => {
  const { userId, examId } = req.body;

  // For now, always require payment
  res.json({ hasAccess: false });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
