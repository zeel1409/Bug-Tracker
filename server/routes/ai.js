const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const { protect } = require('../middleware/auth');

// Initialize the Anthropc client safely (it will use process.env.ANTHROPIC_API_KEY if not explicitly passed, but we should make sure it doesnt crash on boot if missing)
let anthropic;
try {
  if (process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
} catch (e) {
  console.log('Anthropic API key not configured yet.');
}

// POST /api/ai/generate-description
router.post('/generate-description', protect, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Ticket title is required to generate description' });
    }

    if (!anthropic) {
      return res.status(500).json({ message: 'Anthropic API key is not configured on the server. Please add ANTHROPIC_API_KEY to your .env file.' });
    }

    const prompt = `You are an expert QA Engineer and Project Manager. 
I am creating a bug tracker ticket. The title of the ticket is: "${title}".
Please write a professional, concise, and structured ticket description (2-3 sentences max) that expands on this title. 
Do not include any pleasantries, just return the raw text for the ticket description.`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }]
    });

    const description = message.content[0].text;
    res.json({ description });

  } catch (err) {
    console.error('Claude API Error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to generate description from AI' });
  }
});

module.exports = router;
