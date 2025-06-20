const pdfParse = require('pdf-parse');

async function extractTextFromPDF(file) {
  const buffer = file.data;
  const data = await pdfParse(buffer);
  return data.text;
}

module.exports = { extractTextFromPDF };
