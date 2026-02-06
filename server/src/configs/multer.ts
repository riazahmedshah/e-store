import multer, { memoryStorage } from "multer";

const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
})

export const userProfileMiddleware = upload.single('profilePhoto');
export const productImageMiddleware = upload.single('productPhoto');
export const productImagesMiddleware = upload.array('productsPhoto',4);