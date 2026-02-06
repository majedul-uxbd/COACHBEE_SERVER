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
 * @description This file contains the column names for the attendance table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_PAYMENT_COLUMNS_NAME = Object.freeze({
    ID: 'id',
    STUDENT_ID: 'students_id ',
    DATE: 'date',
    STATUS: 'status',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
});

module.exports = {
    TABLE_PAYMENT_COLUMNS_NAME
};