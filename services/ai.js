const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function analyzeResume(text) {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192', // ✅ updated working model
        messages: [
          {
            role: 'system',
            content: 'You are an HR assistant reviewing resumes.',
          },
          {
            role: 'user',
            content: `Analyze this resume and provide feedback:\n${text}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Groq API error:', error.response?.data || error.message);
    throw new Error('Groq analysis failed');
  }
}

module.exports = { analyzeResume };
