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
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


const getStudentListQuery = async (authData) => {
    const _query = `
        SELECT
            ${TABLE_STUDENT_COLUMNS_NAME.ID},
            ${TABLE_STUDENT_COLUMNS_NAME.FULLNAME}
        FROM
            ${TABLES.TBL_STUDENTS}
        WHERE
            ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ? AND
            ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = 1;
    `;

    try {
        const [result] = await pool.query(_query, [authData.uuid]);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};


/**
 * This function retrieves a list of students based on the provided auth UUID data.
 * 
 * @param {lg} lg - Language code for localization.
 * @param {{ id:number, uuid:string, email:string }} authData Authenticate user data
 */
const getStudentList = async (lg, authData) => {
    try {
        const studentList = await getStudentListQuery(authData);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                "get_data_successfully",
                lg || "en",
                studentList
            )
        )
    } catch (error) {
        // console.log('🚀 ~ get-student-list.js:45 ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                "internal_server_error",
                lg || "en"
            )
        )
    }
}

module.exports = {
    getStudentList
}