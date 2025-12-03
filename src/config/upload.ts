import multer from "multer";

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (request, file, callback) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    callback(null, uniqueName);
  }
});

export const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    fieldSize: 15 * 1024 * 1024,
  },
  fileFilter: (request, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Only JPG and PNG images are allowed"));
    }
  }
}).array("images", 5);
