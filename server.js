const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pdf = require('html-pdf');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Increase payload size limits
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static('public'));

// Route for index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to generate PDF
app.post('/generate-pdf', (req, res) => {
  const htmlContent = req.body.htmlContent;
  
  if (!htmlContent) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  const options = {
    format: 'A4',
    border: {
      top: '15mm',
      right: '15mm',
      bottom: '15mm',
      left: '15mm'
    },
    timeout: 30000 // Increase timeout to 30 seconds
  };

  // Generate PDF
  pdf.create(htmlContent, options).toBuffer((err, buffer) => {
    if (err) {
      console.error('Error generating PDF:', err);
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }
    
    res.contentType('application/pdf');
    res.send(buffer);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
