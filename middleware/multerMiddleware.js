import multer from "multer";
import DataParser from "datauri/parser.js";
import path from "path"; // od Node.js

// const storage = multer.diskStorage({    // spremamo na disk. render ne podržava više to, pa sad spremamo u  memory
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads"); // tu se nam spremaju svi uploads
//   },
//   filename: (req, file, cb) => {
//     const filename = file.originalname;
//     cb(null, filename);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage });

const parser = new DataParser();

export const formatImage = (file) => {
  // ovo nam dolazi iz req.file, ako se ne varam
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content; // ovo passamo cloudinary, nešto što može čitati iz memorije
};

export default upload;
