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

const { setServerResponse } = require("../../common/set-server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_STUDENT_COLUMNS_NAME } = require("../../DB/database-information/table-student-columns-name");
const { TABLE_STUDENT_PAYMENTS_COLUMNS_NAME } = require("../../DB/database-information/table-student-payments-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


const checkIsStudentExist = async (studentId, uuid) => {
    const _query = `
        SELECT
            ${TABLE_STUDENT_COLUMNS_NAME.ID}
        FROM
            ${TABLES.TBL_STUDENTS}
        WHERE
            ${TABLE_STUDENT_COLUMNS_NAME.ID} = ? AND
            ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ? AND
            ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = 1;
    `;
    const _values = [
        studentId,
        uuid
    ];

    try {
        const [result] = await pool.query(_query, _values);
        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}


const createStudentsPaymentDataQuery = async (paymentData) => {
    const _query = `
        INSERT INTO
            ${TABLES.TBL_STUDENT_PAYMENTS}
            (
                ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.STUDENT_ID},
                ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.MONTH},
                ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.YEAR},
                ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.TOTAL_PAYABLE_AMOUNT},
                ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.PAID_AMOUNT},
                ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.DUES_AMOUNT},
                ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.PAYMENT_STATUS}
            )
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const _values = [
        paymentData.studentId,
        paymentData.month,
        paymentData.year,
        paymentData.totalPayableAmount,
        paymentData.paidAmount,
        paymentData.dueAmount,
        paymentData.paymentStatus
    ];

    try {
        const [result] = await pool.query(_query, _values);
        if (result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
};


/**
 * This function creates a student payment record in the database based on the provided payment data. 
 * It validates the input data, checks if the student exists and is active, and then inserts the payment record into the database. 
 * 
 * @param {lg} lg - Language code for localization.
 * @param {{ id:number, uuid:string, email:string }} authData 
 * @param {{studentId:number, month:string, year:string, totalPayableAmount:number, paidAmount:number, dueAmount:number, paymentStatus:string }} paymentData - The payment data for the student.
 * @returns {Promise<Object>} The function returns a server response indicating the success or failure of the operation.
 */
const createStudentsPayment = async (lg, authData, paymentData) => {
    try {
        const isStudentExist = await checkIsStudentExist(paymentData.studentId, authData.uuid);
        if (isStudentExist === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'student_is_not_found_or_inactive',
                    lg || 'en'
                )
            )
        }
        const isInserted = await createStudentsPaymentDataQuery(paymentData);
        if (isInserted) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'student_payment_created_successfully',
                    lg || 'en',
                )
            )
        }
    } catch (error) {
        console.log('🚀 ~ create-student-payment.js:60 ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lgKey || 'en'
            )
        )
    }
};


module.exports = {
    createStudentsPayment
};