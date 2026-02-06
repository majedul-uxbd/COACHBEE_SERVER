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
const { uploadFileSize } = require("./upload-file-const-value");
const { storage } = require("./storage-filename-modifiers");

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
const uploadFileValidator = multer({
  // storage: multer.memoryStorage(),
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only .csv or .pdf file is allowed!"));
    }
  },
  limits: {
    fileSize: uploadFileSize,
  },
});

module.exports = {
  uploadFileValidator,
};
