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
const { TABLE_TEACHER_PAYMENTS_COLUMNS_NAME } = require("../../DB/database-information/table-teacher-salary-columns-name");
const { TABLE_TEACHERS_COLUMNS_NAME } = require("../../DB/database-information/table-teachers-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


const checkIsTeacherExist = async (teacherId, uuid) => {
    const _query = `
        SELECT
            ${TABLE_TEACHERS_COLUMNS_NAME.ID}
        FROM
            ${TABLES.TBL_TEACHERS}
        WHERE
            ${TABLE_TEACHERS_COLUMNS_NAME.ID} = ? AND
            ${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ? AND
            ${TABLE_TEACHERS_COLUMNS_NAME.IS_ACTIVE} = 1;
    `;
    const _values = [
        teacherId,
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


const updateTeacherSalaryDataQuery = async (salaryData) => {
    const _query = `
        UPDATE
            ${TABLES.TBL_TEACHER_SALARY}
        SET
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.MONTH} = ?,
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.YEAR} = ?,
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.BONUS} = ?,
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TOTAL_PAYABLE_AMOUNT} = ?,
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.PAID_AMOUNT} = ?,
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.DUES_AMOUNT} = ?,
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.SALARY_STATUS} = ?,
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.NOTE} = ?,
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.UPDATED_AT} = ?
        WHERE
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TEACHERS_ID} = ?
    `;
    const _values = [
        salaryData.month,
        salaryData.year,
        salaryData.bonus,
        salaryData.totalPayableAmount,
        salaryData.paidAmount,
        salaryData.dueAmount,
        salaryData.paymentStatus,
        salaryData.notes || "",
        salaryData.updatedAt,
        salaryData.teacherId,
    ];

    // console.log({
    //     Query: _query,
    //     Values: _values
    // })

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
 * This function updates a teacher's salary record in the database based on the provided payment data. 
 * It validates the input data, checks if the teacher exists and is active, and then updates the salary record in the database. 
 * 
 * @param {lg} lg - Language code for localization.
 * @param {{ id:number, uuid:string, email:string }} authData 
 * @param {{teacherId:number, month:string, year:string, bonus:number, totalPayableAmount:number, paidAmount:number, dueAmount:number, paymentStatus:string, note:string }} salaryData - The payment data for the teacher.
 * @returns {Promise<Object>} The function returns a server response indicating the success or failure of the operation.
 */
const updateTeachersSalary = async (lg, authData, salaryData) => {
    const updatedAt = new Date();
    salaryData.updatedAt = updatedAt;
    try {
        const isTeacherExist = await checkIsTeacherExist(salaryData.teacherId, authData.uuid);
        if (isTeacherExist === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'teacher_is_not_found_or_inactive',
                    lg || 'en'
                )
            )
        }
        const isUpdated = await updateTeacherSalaryDataQuery(salaryData);
        if (isUpdated) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'teacher_salary_updated_successfully',
                    lg || 'en',
                )
            )
        }
    } catch (error) {
        console.log('🚀 ~ update-teacher-payment.js:130 ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lg || 'en'
            )
        )
    }
};


module.exports = {
    updateTeachersSalary
};