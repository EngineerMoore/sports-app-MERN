// multer: handle file uploads locally
const multer = require('multer');
const path = require("path");

module.exports = {
  storage: multer.diskStorage({
    // destination: "../../files" aka it's being stored in files folder at root level
    destination: path.resolve(__dirname, "..", "..", "files"),
    // callback needed to pass the filename to the controller
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      const name = path.basename(file.originalname, ext)

      /* .replace contains regex for remove all spaces
        spaces = \s g=all, 2nd paramater = replacement string
      */
      cb(null, `${name.replace(/\s/g,``)}-${Date.now()}${ext}`)
    }
  })
}