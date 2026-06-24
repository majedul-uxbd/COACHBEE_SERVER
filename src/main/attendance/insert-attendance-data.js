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
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


const checkIsStudentExist = async (studentId) => {
    const _query = `
    SELECT
        ${TABLE_STUDENT_COLUMNS_NAME.ID}
    FROM
        ${TABLES.TBL_STUDENTS}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.ID} = ?
    `;
    const _values = [
        studentId
    ];
    try {
        const [rows] = await pool.query(_query, _values);
        return rows.length > 0 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
}


const insertAttendanceQuery = async (authData, attendanceData) => {
    console.log('🚀 ~ insert-attendance-data.js:42 ~ authData:', authData);

    const _query = `
    INSERT INTO
        ${TABLES.TBL_ATTENDANCE} 
        (
            ${TABLE_ATTENDANCE_COLUMNS_NAME.STUDENT_ID},
            ${TABLE_ATTENDANCE_COLUMNS_NAME.DATE},
            ${TABLE_ATTENDANCE_COLUMNS_NAME.PRESENT},
            ${TABLE_ATTENDANCE_COLUMNS_NAME.ABSENT},
            ${TABLE_ATTENDANCE_COLUMNS_NAME.ATTENDANCE_BY}
        )
        VALUES ( ?, ?, ?, ?, ?)
    `;

    const _values = [
        attendanceData.studentId,
        attendanceData.date,
        attendanceData.present,
        attendanceData.absent,
        authData.id
    ]

    try {
        const [rows] = await pool.query(_query, _values);
        return rows.affectedRows > 0 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * Inserts attendance data into the database.
 * @param {string} lgKey - The language key for localization.
 * @param {{
 * studentId: number,
 * date: string,
 * present: boolean,
 * absent: boolean
 * }} attendanceData - The attendance data to insert.
 * @param {{
 * uuid:string,
 * }} authData - The authentication data.
 * @returns {Promise<object>} - The result of the insertion. If data
 */
const insertAttendanceData = async (lgKey, attendanceData, authData) => {
    try {
        const isExist = await checkIsStudentExist(attendanceData.studentId);
        if (isExist === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "student_is_not_found",
                    lgKey
                )
            )
        }

        const isInserted = await insertAttendanceQuery(authData, attendanceData);
        if (isInserted === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    "attendance_marked_successfully",
                    lgKey
                )
            )
        }

    } catch (error) {
        console.log("Error in insertAttendanceData :", error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                "internal_server_error",
                lgKey
            )
        )
    }
}


module.exports = {
    insertAttendanceData
}