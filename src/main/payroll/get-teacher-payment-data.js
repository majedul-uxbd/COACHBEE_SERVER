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
const totalTeachersPaymentRowCount = async (authData, filterData) => {
    let filterQuery = "";
    const values = [authData.uuid];

    // 👉 Add filters dynamically
    if (filterData?.month) {
        filterQuery += ` AND payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.MONTH} = ?`;
        values.push(filterData.month);
    }

    if (filterData?.year) {
        filterQuery += ` AND payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.YEAR} = ?`;
        values.push(filterData.year);
    }

    const query = `
    SELECT
        COUNT(*) AS totalRows
    FROM
        ${TABLES.TBL_TEACHERS} AS teacher
    LEFT JOIN
        ${TABLES.TBL_TEACHER_PAYMENTS} AS payment
    ON
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.ID} = payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TEACHERS_ID}
    WHERE
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ?
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


const getTeachersPaymentDetailsDataQuery = async (authData, paginationData, filterData = null) => {
    let filterQuery = "";
    const values = [authData.uuid];

    // 👉 Dynamic filters
    if (filterData?.month) {
        filterQuery += ` AND payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.MONTH} = ?`;
        values.push(filterData.month);
    }

    if (filterData?.year) {
        filterQuery += ` AND payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.YEAR} = ?`;
        values.push(filterData.year);
    }

    // 👉 Pagination 
    values.push(paginationData.itemsPerPage);
    values.push(paginationData.offset);

    const _query = `
    SELECT
        -- Teacher Information --
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.ID} AS teacherId,
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.UUID},
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.FULLNAME} AS fullName,
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.CLASS},
        -- Payment Information --
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.ID} AS salaryId,
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.MONTH},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.YEAR},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.BONUS},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TOTAL_PAYABLE_AMOUNT} AS totalPayableAmount,
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.PAID_AMOUNT} AS paidAmount,
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.DUES_AMOUNT} AS duesAmount,
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.NOTE},
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.SALARY_STATUS} AS salaryStatus,
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.CREATED_AT} AS salaryDate,
        payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.UPDATED_AT} AS salaryUpdatedDate

    FROM
        ${TABLES.TBL_TEACHERS} AS teacher
    LEFT JOIN
        ${TABLES.TBL_TEACHER_PAYMENTS} AS payment
    ON
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.ID} = payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TEACHERS_ID}
    WHERE
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ? AND
        teacher.${TABLE_TEACHERS_COLUMNS_NAME.IS_ACTIVE}  = 1
        ${filterQuery}
    ORDER BY
            payment.${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.CREATED_AT} ${paginationData.sortOrder}
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
 * Retrieves Teacher table data with server-side pagination, total row count.
 *
 * @param {string} lgKey - Language key for localization.
 * @param {{ id: number,uuid:string, email: string }} authData - Authenticated user data.
 * @param {{ itemsPerPage: number, currentPageNumber: number, filterBy: string, sortOrder: string, offset: number }} paginationData - Pagination and filter information.
 * @param {{month:string, year:string}} filterData - Filter data for month and year.
 * @returns {Promise<Object>} - Resolves with a server response containing metadata, table data, and pending data. Rejects with error on failure.
 */
const getTeachersPaymentInfoData = async (lgKey, authData, paginationData, filterData) => {
    try {
        const totalRows = await totalTeachersPaymentRowCount(authData, filterData);
        const TeacherData = await getTeachersPaymentDetailsDataQuery(authData, paginationData, filterData);

        const result = {
            metadata: {
                totalRows: totalRows,
            },
            tableData: TeacherData
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
        console.log('🚀 ~ :152 ~ getTeachersPaymentInfoData ~ error:', error);
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
