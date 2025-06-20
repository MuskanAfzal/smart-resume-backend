const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const dotenv = require('dotenv');
const { analyzeResume } = require('./services/ai');
const { extractTextFromPDF } = require('./utils/pdfParser');

dotenv.config();
const app = express();

// ✅ Allow CORS from Vercel or all origins (for now)
app.use(cors());

// Middleware
app.use(fileUpload());
app.use(express.json());

// ✅ Analyze Route
app.post('/analyze', async (req, res) => {
  if (!req.files || !req.files.resume) {
    console.log('❌ No file received');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('📄 Resume file received:', req.files.resume.name);

  try {
    const text = await extractTextFromPDF(req.files.resume);
    console.log('📝 Extracted text length:', text.length);

    const feedback = await analyzeResume(text);
    console.log('✅ Feedback received from OpenAI');

    res.json({ feedback });
  } catch (err) {
    console.error('❌ Error in /analyze:', err.message);
    res.status(500).json({ error: 'Analysis failed', details: err.message });
  }
});

// ✅ Port fix for deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
