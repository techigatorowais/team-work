import multer from 'multer';
import path from 'path';

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where files will be stored
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    // Specify the filename format
    // cb(null, `${Date.now()}-${file.originalname}`);
    // const sanitizedFilename = file.originalname
    // .replace(/\s+/g, '-') // Replace spaces with hyphens
    // .replace(/[^a-zA-Z0-9.-]/g, ''); // Remove all characters except letters, numbers, hyphens, and dots
    const sanitizedFilename = file.originalname
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9.-]/g, "")
    .toLowerCase();

  // Specify the filename format with the sanitized filename
  cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});

// Initialize multer with the storage config
const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for handling file uploads
  },
};

const handler = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file' });
    }
    // After successful upload, send back the file info
    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  });
};

export default handler;
