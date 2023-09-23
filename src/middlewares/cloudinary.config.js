import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import sharp from 'sharp';
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'books_online_backend',
    resource_type: 'image',
  },
  transformer: async function (req, file, cb) {
    const stream = await sharp({ sequentialRead: true, sequentialWrite: true })
      .resize({ width: 500, fit: 'fill' })
      .jpeg({ quality: 80 })
      .rotate(90)
      .png({ quality: 80 })
      .toBuffer();
    cb(null, stream);
  },
});
export { cloudinary };
const uploadCloud = multer({ storage });

export default uploadCloud;
