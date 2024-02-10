import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB in bytes //max filesize is 5MB for an image
  },
});

export default upload;
