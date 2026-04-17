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

const { setServerResponse } = require("../common/set-server-response");
const { API_STATUS_CODE } = require("../consts/error-status");
const { TABLE_STUDENT_COLUMNS_NAME } = require("../DB/database-information/table-student-columns-name");
const { TABLE_STUDENT_PAYMENTS_COLUMNS_NAME } = require("../DB/database-information/table-student-payments-columns-name");
const { TABLES } = require("../DB/database-information/tables");
const { pool } = require("../DB/db-pool");


const getStudentListQuery = async () => {
    const _query = `
        SELECT
            ${TABLE_STUDENT_COLUMNS_NAME.ID} AS studentId,
            ${TABLE_STUDENT_COLUMNS_NAME.FULLNAME} AS fullName,
            ${TABLE_STUDENT_COLUMNS_NAME.MONTHLY_FEE} AS totalPayableAmount
        FROM
            ${TABLES.TBL_STUDENTS}
        WHERE
            ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = 1;
    `;

    try {
        const [result] = await pool.query(_query);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};


const createBulkStudentPaymentQuery = async (paymentsData) => {
    const _query = `
        INSERT IGNORE INTO ${TABLES.TBL_STUDENT_PAYMENTS}
        (
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.STUDENT_ID},
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.MONTH},
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.YEAR},
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.TOTAL_PAYABLE_AMOUNT},
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.PAID_AMOUNT},
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.DUES_AMOUNT},
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.PAYMENT_STATUS}
        )
        VALUES ?
    `;

    try {
        const [result] = await pool.query(_query, [paymentsData]);
        return result.affectedRows > 0;
    } catch (error) {
        return Promise.reject(error);
    }
};


const autoGenerateStudentPayment = async () => {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();

    try {
        const studentList = await getStudentListQuery();
        if (studentList.length === 0) return;

        // Prepare bulk data
        const paymentsData = studentList.map(student => [
            student.studentId,
            month,
            year,
            student.totalPayableAmount,
            null, // paidAmount default
            student.totalPayableAmount, // due = full amount
            'DUE' // payment status
        ]);

        // 🔥 Single DB call
        await createBulkStudentPaymentQuery(paymentsData);

        console.log('✅ Payments generated successfully');
    } catch (error) {
        // console.log('🚀 ~ create-student-payment.js:60 ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                'en'
            )
        )
    }
}

module.exports = {
    autoGenerateStudentPayment
}