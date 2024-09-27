const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // Use the original file name
  }
});

const upload = multer({ storage: storage });

// Handle file upload
app.post('/upload', upload.single('datasetFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ message: 'File uploaded successfully!', file: req.file });
});

// Serve the backend
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



