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

const path = require('path');


/**
 * @description Upload image saved file directory
 */
const imageDir = path.join(process.cwd(), "/uploads/profile-images");
const requirementDir = path.join(process.cwd(), "/uploads/project-requirements");
const engRequirementDir = path.join(process.cwd(), "/uploads/eng-requirements");

/**
 * @description Upload image file mimetype
 */
const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

/**
 * @description Upload file maximum size
 */
const uploadFileSize = 10240000; //10MB

module.exports = {
  imageDir,
  requirementDir,
  engRequirementDir,
  fileTypes,
  uploadFileSize
};
