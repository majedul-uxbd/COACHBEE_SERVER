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
 * @description This file contains the path to the placeholder image used in the user's profile.
 */
const placeholderImagePath = 'uploads/placeholder/placeholder-image.png';

/**
 * OTP expire time
 */
const OTP_EXPIRED_PERIOD_IN_MINS = 15;

const FRONTEND_URL = 'http://192.168.88.13:3000/coachbee/en';
const VERIFY_OTP_URL = 'verify-otp';
const USER_LOGIN = 'login';



module.exports = {
    placeholderImagePath,
    OTP_EXPIRED_PERIOD_IN_MINS,
    FRONTEND_URL,
    VERIFY_OTP_URL,
    USER_LOGIN
}