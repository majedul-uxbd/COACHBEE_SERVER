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


const studentTotalPayableAmount = async (studentId, uuid) => {
    const query = `
    SELECT
        ${TABLE_STUDENT_COLUMNS_NAME.MONTHLY_FEE} AS totalPayableAmount
    FROM
        ${TABLES.TBL_STUDENTS}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.ID} = ? AND
        ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ?;
    `;

    try {
        const [rows] = await pool.query(query, [studentId, uuid]);
        if (rows.length > 0) {
            return rows[0].totalPayableAmount || 0;
        } return 400;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * 
 * @param {lg} lg - Language code for localization.
 * @param {number} studentId - The ID of the student for whom to get the total payable amount.
 * @param {{ id: number,uuid:string, email: string }} authData - Authenticated user data.
 * @returns {Promise<{ totalPayableAmount: number }>} The total payable amount for the student.
 */
const getStudentTotalPayableAmount = async (lg, studentId, authData) => {
    try {
        const totalPayableAmount = await studentTotalPayableAmount(studentId, authData.uuid);
        if (totalPayableAmount === 400) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "total_payable_amount_is_not_found",
                    lg,
                    0
                )
            );
        }
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                "get_data_successfully",
                lg,
                totalPayableAmount,
            )
        );
    } catch (error) {
        // console.log('🚀 ~ get-student-total-payable-amount.js:43 ~ error:', error);

        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                "internal_server_error",
                lg,
            )
        );
    }
};

module.exports = {
    getStudentTotalPayableAmount
}