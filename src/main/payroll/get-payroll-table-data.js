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
const { TABLE_TEACHER_PAYMENTS_COLUMNS_NAME } = require("../../DB/database-information/table-teacher-payments-columns-name");
const { TABLE_TEACHERS_COLUMNS_NAME } = require("../../DB/database-information/table-teachers-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


/**
 * Get the total number of Table Data.
 * @returns {Promise<number>} The total number of rows for the table data.
 */
const totalTeachersPaymentRowCount = async (authData) => {
    const query = `
    SELECT
        COUNT(*) AS totalRows
    FROM
        ${TABLES.TBL_TEACHERS} AS teacher
    LEFT JOIN
        ${TABLES.TBL_TEACHER_PAYMENTS} AS payment
    ON
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.UUID} = payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TEACHERS_UUID}
    WHERE
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ?;
    `;

    try {
        const [rows] = await pool.query(query, [authData.uuid]);
        return rows[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
};


const getTeachersPaymentDetailsDataQuery = async (authData, paginationData) => {
    const _query = `
    SELECT
        -- Teacher table columns --
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.FULLNAME},
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.SALARY},
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.FULLNAME},
        -- Payment table columns --
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.ID},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TEACHERS_UUID},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.MONTH},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.SALARY_AMOUNT},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.BONUS},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.PAID_AMOUNT},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.NOTE},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.PAID_AT},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.CREATED_AT},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.UPDATED_AT}
    FROM
        ${TABLES.TBL_TEACHERS} AS teacher
    LEFT JOIN
        ${TABLES.TBL_TEACHER_PAYMENTS} AS payment
    ON
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.UUID} = payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TEACHERS_UUID}
    WHERE
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ?
    ORDER BY
            payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.CREATED_AT} ${paginationData.sortOrder}
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
const getTeachersPaymentInfoData = async (lgKey, authData, paginationData) => {
    try {
        const totalRows = await totalTeachersPaymentRowCount(authData);
        const StudentData = await getTeachersPaymentDetailsDataQuery(authData, paginationData);

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
        console.log('🚀 ------------------------------------------------🚀');
        console.log('🚀 ~ :106 ~ getTeachersPaymentInfoData ~ error:', error);
        console.log('🚀 ------------------------------------------------🚀');
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
    getTeachersPaymentInfoData
}