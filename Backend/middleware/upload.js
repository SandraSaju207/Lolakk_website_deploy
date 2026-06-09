import multer from 'multer';
import path from 'path';

// Configure where and how to store the images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists in your backend root!
  },
  filename: (req, file, cb) => {
    // Save as: timestamp-originalname.jpg
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
export default upload;