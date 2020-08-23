const multer = require('multer');
const mkdirp = require('mkdirp');

const uploadsPath = 'images';

mkdirp.sync(uploadsPath)

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsPath);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

module.exports = multer({
  storage,
  fileFilter: (req, file, cb) => cb(null, allowedTypes.includes(file.mimetype))
})
