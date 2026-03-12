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
 * @description This file contains the column names for the teacher payments table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_TEACHER_PAYMENTS_COLUMNS_NAME = Object.freeze({
    ID: 'id',
    TEACHERS_UUID: 'teachers_uuid ',
    MONTH: 'month',
    SALARY_AMOUNT: 'salary_amount',
    BONUS: 'bonus',
    PAID_AMOUNT: "paid_amount",
    NOTE: 'note',
    PAID_AT: 'paid_at',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
});

module.exports = {
    TABLE_TEACHER_PAYMENTS_COLUMNS_NAME
};