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

const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../common/set-server-response");
const { TABLES } = require("../../DB/database-information/tables");
const { TABLE_CLASS_COLUMNS_NAME } = require("../../DB/database-information/table-class-columns-name");
const { pool } = require("../../DB/db-pool");


const getClassesListQuery = async () => {
    const query = `
    SELECT
        ${TABLE_CLASS_COLUMNS_NAME.ID},
        ${TABLE_CLASS_COLUMNS_NAME.CLASS_NAME}
    FROM
        ${TABLES.TBL_CLASSES};
    `;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function is used to get the class list
 * @param {string} lg - Language key for localization
 * @returns {Promise<Object>} - Resolves with class list data. Rejects with error on failure.
 */
const getClassList = async (lg) => {
    try {
        const classList = await getClassesListQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                lg || 'en',
                classList
            )
        )
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lg || 'en'
            )
        )
    }
}

module.exports = {
    getClassList
}