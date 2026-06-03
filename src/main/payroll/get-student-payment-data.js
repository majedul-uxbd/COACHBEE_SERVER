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
const { TABLE_STUDENT_PAYMENTS_COLUMNS_NAME } = require("../../DB/database-information/table-student-payments-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


/**
 * Get the total number of Table Data.
 * @returns {Promise<number>} The total number of rows for the table data.
 */
const totalStudentsPaymentRowCount = async (authData, filterData) => {
    let filterQuery = "";
    const values = [authData.uuid];

    // 👉 Add filters dynamically
    if (filterData?.month) {
        filterQuery += ` AND payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.MONTH} = ?`;
        values.push(filterData.month);
    }

    if (filterData?.year) {
        filterQuery += ` AND payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.YEAR} = ?`;
        values.push(filterData.year);
    }

    const query = `
    SELECT
        COUNT(*) AS totalRows
    FROM
        ${TABLES.TBL_STUDENTS} AS student
    LEFT JOIN
        ${TABLES.TBL_STUDENT_PAYMENTS} AS payment
    ON
        student.${TABLE_STUDENT_COLUMNS_NAME.ID} = payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.STUDENT_ID}
    WHERE
        student.${TABLE_STUDENT_COLUMNS_NAME.UUID} = ?
        ${filterQuery}
        ;
    `;

    try {
        const [rows] = await pool.query(query, values);
        return rows[0].totalRows;
    } catch (error) {
        return Promise.reject(error);
    }
};


const getStudentsPaymentDetailsDataQuery = async (authData, paginationData, filterData = null) => {
    let filterQuery = "";
    const values = [authData.uuid];

    // 👉 Dynamic filters
    if (filterData?.month) {
        filterQuery += ` AND payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.MONTH} = ?`;
        values.push(filterData.month);
    }

    if (filterData?.year) {
        filterQuery += ` AND payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.YEAR} = ?`;
        values.push(filterData.year);
    }

    // 👉 Pagination 
    values.push(paginationData.itemsPerPage);
    values.push(paginationData.offset);

    const _query = `
    SELECT
        -- Student Information --
        student.${TABLE_STUDENT_COLUMNS_NAME.ID} AS studentId,
        student.${TABLE_STUDENT_COLUMNS_NAME.UUID},
        student.${TABLE_STUDENT_COLUMNS_NAME.FULLNAME} AS fullName,
        student.${TABLE_STUDENT_COLUMNS_NAME.CLASS},
        -- Payment Information --
        payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.ID} AS paymentId,
        payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.MONTH},
        payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.YEAR},
        payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.TOTAL_PAYABLE_AMOUNT} AS totalPayableAmount,
        payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.PAID_AMOUNT} AS paidAmount,
        payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.DUES_AMOUNT} AS duesAmount,
        payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.PAYMENT_STATUS} AS paymentStatus,
        payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.CREATED_AT} AS paymentDate,
        payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.UPDATED_AT} AS paymentUpdatedDate

    FROM
        ${TABLES.TBL_STUDENTS} AS student
    LEFT JOIN
        ${TABLES.TBL_STUDENT_PAYMENTS} AS payment
    ON
        student.${TABLE_STUDENT_COLUMNS_NAME.ID} = payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.STUDENT_ID}
    WHERE
        student.${TABLE_STUDENT_COLUMNS_NAME.UUID} = ? AND
        student.${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = 1
        ${filterQuery}
    ORDER BY
            payment.${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.CREATED_AT} ${paginationData.sortOrder}
        LIMIT ? OFFSET ?;
    `;

    try {
        const [rows] = await pool.query(_query, values);
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
 * @param {{month:string, year:string}} filterData - Filter data for month and year.
 * @returns {Promise<Object>} - Resolves with a server response containing metadata, table data, and pending data. Rejects with error on failure.
 */
const getStudentsPaymentInfoData = async (lgKey, authData, paginationData, filterData) => {
    try {
        const totalRows = await totalStudentsPaymentRowCount(authData, filterData);
        const StudentData = await getStudentsPaymentDetailsDataQuery(authData, paginationData, filterData);

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
        // console.log('🚀 ~ :106 ~ getStudentsPaymentInfoData ~ error:', error);
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
    getStudentsPaymentInfoData
}
