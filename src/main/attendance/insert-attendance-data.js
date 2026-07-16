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
const { format } = require("date-fns");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { isDateValid, isAttendanceStatusValid } = require("../../common/data-validator");
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
        return rows.length > 0;
    } catch (error) {
        return Promise.reject(error);
    }
}


const insertAttendanceQuery = async (attendanceRows) => {
    if (!Array.isArray(attendanceRows) || attendanceRows.length === 0) {
        return false;
    }

    const rowPlaceholders = attendanceRows.map(() => `(?, ?, ?, ?)`).join(", ");
    const _query = `
    INSERT IGNORE INTO
        ${TABLES.TBL_ATTENDANCE}
        (
            ${TABLE_ATTENDANCE_COLUMNS_NAME.STUDENT_ID},
            ${TABLE_ATTENDANCE_COLUMNS_NAME.DATE},
            ${TABLE_ATTENDANCE_COLUMNS_NAME.STATUS},
            ${TABLE_ATTENDANCE_COLUMNS_NAME.ATTENDANCE_BY}
        )
        VALUES ${rowPlaceholders}
    `;

    const _values = attendanceRows.flat();
    try {
        const [rows] = await pool.query(_query, _values);
        return true;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * Inserts attendance data into the database.
 * @param {string} lgKey - The language key for localization.
 * @param {Array<Object>} attendanceData - The attendance data array to insert.
 * @param {{ id: string }} authData - The authentication data.
 * @returns {Promise<object>} - The result of the insertion.
 */
const insertAttendanceData = async (lgKey, attendanceData, authData) => {
    console.log('🚀 ~ insert-attendance-data.js:87 ~ attendanceData:', attendanceData);

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'attendance_data_is_required',
                lgKey || 'en'
            )
        );
    }

    const attendanceRows = [];
    for (const item of attendanceData) {
        const studentId = item.studentId;
        const status = item.status || item.type;
        const dateValue = item.date ? item.date : format(new Date(), 'yyyy-MM-dd');

        if (!studentId || !status) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'student_id_and_status_are_required',
                    lgKey || 'en'
                )
            );
        }

        const validStatus = isAttendanceStatusValid(status);
        if (validStatus !== true) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    validStatus,
                    lgKey || 'en'
                )
            );
        }

        if (item.date) {
            const validDate = isDateValid(dateValue);
            if (validDate !== true) {
                return Promise.reject(
                    setServerResponse(
                        API_STATUS_CODE.BAD_REQUEST,
                        validDate,
                        lgKey || 'en'
                    )
                );
            }
        }

        attendanceRows.push([
            studentId,
            format(new Date(dateValue), 'yyyy-MM-dd'),
            status,
            authData.id
        ]);
    }

    try {
        const isInserted = await insertAttendanceQuery(attendanceRows);
        if (isInserted === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'attendance_marked_successfully',
                    lgKey || 'en'
                )
            );
        }

    } catch (error) {
        console.error('🚀 ~ insert-attendance-data.js:160 ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lgKey || 'en'
            )
        );
    }
}


module.exports = {
    insertAttendanceData
}