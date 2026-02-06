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


/**
 * @description This file contains the column names for the otp verification table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_OTP_VERIFICATION_COLUMNS_NAME = Object.freeze({
    ID: 'id',
    EMAIL: 'email',
    OTP: 'otp',
    EXPIRY_DATE: 'expiry_date',
    CREATED_AT: 'created_at'
});

module.exports = {
    TABLE_OTP_VERIFICATION_COLUMNS_NAME
};