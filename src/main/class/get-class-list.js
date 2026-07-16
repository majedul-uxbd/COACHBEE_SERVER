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
const { TABLE_CLASS_COLUMNS_NAME } = require("../../DB/database-information/table-class-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


const getClassListDataQuery = async () => {
    const _query = `
    SELECT
        ${TABLE_CLASS_COLUMNS_NAME.ID},
        ${TABLE_CLASS_COLUMNS_NAME.CLASS_NAME}
    FROM
        ${TABLES.TBL_CLASSES}
    ORDER BY
        ${TABLE_CLASS_COLUMNS_NAME.ID} ASC
    `;
    try {
        const [result] = await pool.query(_query);
        // console.log('🚀 ~ get-class-list.js:27 ~ result:', result);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * This function is used to get the class list from the database.
 * @param {string} lg 
 */
const getClassList = async (lg) => {
    try {
        const classList = await getClassListDataQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                lg,
                classList
            )
        );
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lg
            )
        );
    }
}

module.exports = {
    getClassList
}