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


/**
 * @description This file contains the column names for the users table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_USERS_COLUMNS_NAME = Object.freeze({
    ID: 'id',
    FULLNAME: 'full_name',
    EMAIL: 'email',
    PASSWORD: 'password',
    IS_ADMIN: 'is_admin',
    IMAGE_URL: 'image_url',
    IS_ACTIVE: 'is_active',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
});

module.exports = {
    TABLE_USERS_COLUMNS_NAME
};