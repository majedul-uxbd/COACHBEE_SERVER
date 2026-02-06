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
 * @description This file contains the column names for the users table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_EMPLOYEES_COLUMNS_NAME = Object.freeze({
    ID: 'id',
    EMPLOYEE_ID: 'employee_id',
    FULLNAME: 'full_name',
    EMAIL: 'email',
    DEPARTMENT: 'department',
    IS_ADMIN: 'is_admin',
    IS_ACTIVE: 'is_active',
    IMAGE_URL: 'image_url',
    PASSWORD: 'password',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
});

module.exports = {
    TABLE_EMPLOYEES_COLUMNS_NAME
};