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


/**
 * Get the total number of Students.
 * @returns {Promise<number>} The total number of rows for the Students.
 */
const totalUserTableRowCount = async () => {
    const query = `
    SELECT
        COUNT(*) AS totalRows
    FROM
        ${TABLES.TBL_ATTENDANCE} AS attendance
    LEFT JOIN
        ${TABLES.TBL_STUDENTS} AS student
    ON
        attendance.${TABLE_ATTENDANCE_COLUMNS_NAME.STUDENT_ID} = student.${TABLE_STUDENT_COLUMNS_NAME.ID}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = 1;
    `;

    try {
        const [rows] = await pool.query(query);
        return rows[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
};

//TODO: This is Temp Solution. I need to fix this.
const getStudentDetailsDataQuery = async (date, studentClass) => {
    // const _query = `
    // SELECT
    //     attendance.${TABLE_ATTENDANCE_COLUMNS_NAME.ID} AS attendanceId,
    //     attendance.${TABLE_ATTENDANCE_COLUMNS_NAME.STUDENT_ID} AS studentId,
    //     student.${TABLE_STUDENT_COLUMNS_NAME.FULLNAME} AS fullName,
    //     student.${TABLE_STUDENT_COLUMNS_NAME.CLASS},
    //     attendance.${TABLE_ATTENDANCE_COLUMNS_NAME.PRESENT},
    //     attendance.${TABLE_ATTENDANCE_COLUMNS_NAME.ABSENT},
    //     attendance.${TABLE_ATTENDANCE_COLUMNS_NAME.DATE} AS attendanceDate
    // FROM
    //     ${TABLES.TBL_ATTENDANCE} AS attendance
    // LEFT JOIN
    //     ${TABLES.TBL_STUDENTS} AS student
    // ON
    //     attendance.${TABLE_ATTENDANCE_COLUMNS_NAME.STUDENT_ID} = student.${TABLE_STUDENT_COLUMNS_NAME.ID}
    // WHERE
    //     student.${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = 1
    // ORDER BY
    //     student.${TABLE_STUDENT_COLUMNS_NAME.CREATED_AT} ${paginationData.sortOrder}
    //     LIMIT ? OFFSET ?;
    // `;

    const _query = `
    SELECT
        ${TABLE_STUDENT_COLUMNS_NAME.ID} AS studentId,
        ${TABLE_STUDENT_COLUMNS_NAME.FULLNAME},
        ${TABLE_STUDENT_COLUMNS_NAME.CLASS}
    FROM
        ${TABLES.TBL_STUDENTS}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = 1
        AND ${TABLE_STUDENT_COLUMNS_NAME.CLASS} = ?
    `;
    // const _values = [
    //     studentClass,
    // ];
    // console.log({
    //     query: _query,
    //     values: _values
    // });
    try {
        const [rows] = await pool.query(_query, studentClass);
        // console.log("🚀 ~ getStudentDetailsDataQuery ~ rows:", rows)
        return rows;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * Retrieves Student table data with server-side pagination, total row count.
 *
 * @param {string} lgKey - Language key for localization.
 * @param {string} date - The date for which to retrieve attendance data.
 * @param {string} studentClass - The class of students to retrieve.
 * @returns {Promise<Object>} - Resolves with a server response containing metadata, table data, and pending data. Rejects with error on failure.
 */
const getStudentListData = async (lgKey, date, studentClass) => {
    if (!date || !studentClass) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'missing_required_parameters',
                lgKey || 'en'
            )
        )
    }
    try {
        const totalRows = await totalUserTableRowCount();
        const StudentData = await getStudentDetailsDataQuery(date, studentClass);

        const result = {
            metadata: {
                totalRows: totalRows,
            },
            tableData: StudentData
        };
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                lgKey || 'en',
                result
            )
        )
    } catch (error) {
        // console.log("🚀 ~ getStudentListData ~ error:", error)
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