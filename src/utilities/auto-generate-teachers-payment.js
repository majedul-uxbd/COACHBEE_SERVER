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
const { TABLE_TEACHER_PAYMENTS_COLUMNS_NAME } = require("../DB/database-information/table-teacher-salary-columns-name");
const { TABLE_TEACHERS_COLUMNS_NAME } = require("../DB/database-information/table-teachers-columns-name");
const { TABLES } = require("../DB/database-information/tables");
const { pool } = require("../DB/db-pool");


const getTeachersListQuery = async () => {
    const _query = `
        SELECT
            ${TABLE_TEACHERS_COLUMNS_NAME.ID} AS teacherId,
            ${TABLE_TEACHERS_COLUMNS_NAME.FULLNAME} AS fullName,
            ${TABLE_TEACHERS_COLUMNS_NAME.SALARY} AS totalPayableAmount
        FROM
            ${TABLES.TBL_TEACHERS}
        WHERE
            ${TABLE_TEACHERS_COLUMNS_NAME.IS_ACTIVE} = 1;
    `;

    try {
        const [result] = await pool.query(_query);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};


const createBulkTeacherPaymentQuery = async (paymentsData) => {
    const _query = `
        INSERT IGNORE INTO ${TABLES.TBL_TEACHER_SALARY}
        (
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TEACHERS_ID},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.MONTH},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.YEAR},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.BONUS},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TOTAL_PAYABLE_AMOUNT},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.PAID_AMOUNT},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.DUES_AMOUNT},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.SALARY_STATUS}
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

/**
 * This function will be called every month to auto-generate payment records for 
 * all active teachers for the current month and year.
 * @returns 
 */
const autoGenerateTeacherPayment = async () => {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();

    try {
        const teacherList = await getTeachersListQuery();
        if (teacherList.length === 0) return;

        // Prepare bulk data
        const paymentsData = teacherList.map(teacher => [
            teacher.teacherId,
            month,
            year,
            null, // bonus default
            teacher.totalPayableAmount,
            null, // paidAmount default
            teacher.totalPayableAmount, // due = full amount
            'DUE' // payment status
        ]);

        // 🔥 Single DB call
        await createBulkTeacherPaymentQuery(paymentsData);

        console.log('✅ Payments generated successfully');
    } catch (error) {
        // console.log('🚀 ~ create-teacher-payment.js:60 ~ error:', error);
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
    autoGenerateTeacherPayment
}