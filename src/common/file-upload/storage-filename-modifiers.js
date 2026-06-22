/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const path = require("path");
const multer = require("multer");
const { requirementDir } = require("./upload-file-const-value");

// const normalize_path_folder = path.normalize(requirementDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = req.filePath;
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toUpperCase()
        .split(" ")
        .join("_") + Date.now();
    cb(null, fileName + fileExt);
  },
});

module.exports = {
  storage,
};
