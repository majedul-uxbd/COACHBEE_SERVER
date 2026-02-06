/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 * 
 * @description 
 * 
 */


const multer = require("multer");
const path = require('path');
// const { storage } = require("../nameStorage/storage-filename-modifiers");
const { uploadFileSize } = require("./upload-file-const-value");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/excel-file'); // folder must exist
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

/**
 * Multer middleware for validating uploaded CSV files.
 *
 * - Stores files in memory.
 * - Only allows files with mimetype 'text/csv'.
 * - Limits file size based on uploadFileSize constant.
 * - Returns an error if the file is not a CSV.
 *
 * Use for endpoints that accept CSV uploads and require strict validation.
 */
const uploadExcelFileValidator = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.xls', '.xlsx'];
    const ext = path.extname(file.originalname);

    if (!allowed.includes(ext)) {
      return cb(new Error('Only Excel files are allowed (.xls, .xlsx)'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: uploadFileSize,
  },
});

module.exports = {
  uploadExcelFileValidator
};
