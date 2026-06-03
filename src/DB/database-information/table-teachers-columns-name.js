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
 * @description This file contains the column names for the teachers table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_TEACHERS_COLUMNS_NAME = Object.freeze({
    ID: 'id',
    UUID: "uuid",
    FULLNAME: 'full_name',
    CLASS: 'class',
    PHONE: 'phone',
    SALARY: 'salary',
    ADDRESS: 'address',
    STARTING_MONTH: 'starting_month',
    IS_ACTIVE: 'is_active',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
});

module.exports = {
    TABLE_TEACHERS_COLUMNS_NAME
};