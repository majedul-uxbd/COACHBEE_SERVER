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
 * @description This file contains the column names for the subject table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_SUBJECT_COLUMNS_NAME = Object.freeze({
    ID: 'id',
    SUBJECT_NAME: "subject_name",
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
});

module.exports = {
    TABLE_SUBJECT_COLUMNS_NAME
};