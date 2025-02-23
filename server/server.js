require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for development
app.use(cors());

// הגדרת מקום השמירה של התמונות
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // השם של הקובץ
  }
});

const upload = multer({ storage: storage });

// יצירת תיקיית uploads אם לא קיימת
const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Route להעלאת תמונה
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.send({ url: imageUrl }); // החזרת ה-URL של התמונה
});

// הגדרת Route להגיש את התמונה
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
