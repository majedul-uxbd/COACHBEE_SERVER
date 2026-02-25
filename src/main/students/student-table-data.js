/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 * 
 * @description 
 * 
 */

const { setServerResponse } = require("../../common/set-server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_STUDENT_COLUMNS_NAME } = require("../../DB/database-information/table-student-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


/**
 * Get the total number of Students.
 * @returns {Promise<number>} The total number of rows for the Students.
 */
const totalUserTableRowCount = async (authData) => {
    const query = `
    SELECT
        COUNT(*) AS totalRows
    FROM
        ${TABLES.TBL_STUDENTS}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ?;
    `;

    try {
        const [rows] = await pool.query(query, [authData.uuid]);
        return rows[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
};


const getStudentDetailsDataQuery = async (authData, paginationData) => {
    const _query = `
    SELECT
        ${TABLE_STUDENT_COLUMNS_NAME.ID},
        ${TABLE_STUDENT_COLUMNS_NAME.FULLNAME},
        ${TABLE_STUDENT_COLUMNS_NAME.GUARDIAN_PHONE},
        ${TABLE_STUDENT_COLUMNS_NAME.CLASS},
        ${TABLE_STUDENT_COLUMNS_NAME.MONTHLY_FEE},
        ${TABLE_STUDENT_COLUMNS_NAME.ADDRESS},
        ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE},
        ${TABLE_STUDENT_COLUMNS_NAME.CREATED_AT},
        ${TABLE_STUDENT_COLUMNS_NAME.UPDATED_AT}
    FROM
        ${TABLES.TBL_STUDENTS}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ?
    ORDER BY
            ${TABLE_STUDENT_COLUMNS_NAME.CREATED_AT} ${paginationData.sortOrder}
        LIMIT ? OFFSET ?;
    `;
    const _values = [
        authData.uuid,
        paginationData.itemsPerPage,
        paginationData.offset
    ];

    try {
        const [rows] = await pool.query(_query, _values);
        return rows;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * Retrieves Student table data with server-side pagination, total row count.
 *
 * @param {string} lgKey - Language key for localization.
 * @param {{ id: number,uuid:string, email: string }} authData - Authenticated user data.
 * @param {{ itemsPerPage: number, currentPageNumber: number, filterBy: string, sortOrder: string, offset: number }} paginationData - Pagination and filter information.
 * @returns {Promise<Object>} - Resolves with a server response containing metadata, table data, and pending data. Rejects with error on failure.
 */
const getStudentTableData = async (lgKey, authData, paginationData) => {
    try {
        const totalRows = await totalUserTableRowCount(authData);
        const StudentData = await getStudentDetailsDataQuery(authData, paginationData);

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
        console.log('🚀 -----------------------------------------------🚀');
        console.log('🚀 ~ :104 ~ getStudentTableData ~ error:', error);
        console.log('🚀 -----------------------------------------------🚀');
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
    getStudentTableData
}