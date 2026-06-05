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
    TEACHERS_ID: 'teachers_id ',
    MONTH: 'month',
    YEAR: 'year',
    BONUS: 'bonus',
    TOTAL_PAYABLE_AMOUNT: 'total_payable_amount',
    PAID_AMOUNT: 'paid_amount',
    DUES_AMOUNT: 'dues_amount',
    NOTE: 'note',
    SALARY_STATUS: 'salary_status',
    // IS_ACTIVE: 'is_active',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
});

module.exports = {
    TABLE_TEACHER_PAYMENTS_COLUMNS_NAME
};