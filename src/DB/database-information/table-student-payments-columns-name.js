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
 * @description This file contains the column names for the student payments table in the database.
 * It is used to ensure consistency in column naming across the application.
 */
const TABLE_STUDENT_PAYMENTS_COLUMNS_NAME = Object.freeze({
    ID: 'id',
    STUDENT_ID: 'student_id ',
    MONTH: 'month',
    YEAR: 'year',
    TOTAL_PAYABLE_AMOUNT: 'total_payable_amount',
    PAID_AMOUNT: 'paid_amount',
    DUES_AMOUNT: 'dues_amount',
    PAYMENT_STATUS: 'payment_status',
    IS_ACTIVE: 'is_active',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at'
});

module.exports = {
    TABLE_STUDENT_PAYMENTS_COLUMNS_NAME
};