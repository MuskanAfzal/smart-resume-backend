const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const dotenv = require('dotenv');
const { analyzeResume } = require('./services/ai');
const { extractTextFromPDF } = require('./utils/pdfParser');

dotenv.config();
const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());

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

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
