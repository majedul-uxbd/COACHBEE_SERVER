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
const { TABLE_ATTENDANCE_COLUMNS_NAME } = require("../../DB/database-information/table-attendance-columns-name");
const { TABLE_STUDENT_COLUMNS_NAME } = require("../../DB/database-information/table-student-columns-name");
const { TABLE_TEACHERS_COLUMNS_NAME } = require("../../DB/database-information/table-teachers-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


const getStudentDetailsDataQuery = async (studentClass = null) => {
    let _query = `
    SELECT
        ${TABLE_STUDENT_COLUMNS_NAME.ID} AS studentId,
        ${TABLE_STUDENT_COLUMNS_NAME.FULLNAME} AS fullName,
        ${TABLE_STUDENT_COLUMNS_NAME.CLASS}
    FROM
        ${TABLES.TBL_STUDENTS}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = 1
    `;

    const _values = [];
    if (studentClass != null && studentClass !== '') {
        _query += `
        AND ${TABLE_STUDENT_COLUMNS_NAME.CLASS} = ?`;
        _values.push(studentClass);
    }

    try {
        const [rows] = await pool.query(_query, _values);
        return rows;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * Retrieves Student list data based on the provided class.
 *
 * @param {string} lgKey - Language key for localization.
 * @param {string} studentClass - The class of students to retrieve.
 * @returns {Promise<Object>} - Resolves with a server response containing metadata, table data, and pending data. Rejects with error on failure.
 */
const getStudentListData = async (lgKey, studentClass = null) => {
    console.log('🚀 ~ student-list-data.js:57 ~ studentClass:', studentClass);
    let studentData = [];
    try {
        if (studentClass === null || studentClass === undefined || studentClass === '') {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'get_data_successfully',
                    lgKey || 'en',
                    studentData = []
                )
            )
        }
        // const totalRows = await totalUserTableRowCount();
        studentData = await getStudentDetailsDataQuery(studentClass);
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                lgKey || 'en',
                studentData
            )
        )
    } catch (error) {
        console.log("🚀 ~ getStudentListData ~ error:", error)
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lgKey || 'en'
            )
        )
    }
}

module.exports = {
    getStudentListData
}