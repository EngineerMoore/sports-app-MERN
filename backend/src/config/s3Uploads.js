const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');


// never hard code you access key info

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: process.env.BUCKET_REGION
})

module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket:'mern-sport-app',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);

      // passing ext as a second argument removes the ext from the file name
      const name = path.basename(file.originalname, ext);

      cb(null, `${name.replace(/\s/g, '')}-${Date.now()}${ext}`);
    }
  })
})