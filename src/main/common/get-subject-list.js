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
const { TABLE_SUBJECT_COLUMNS_NAME } = require("../../DB/database-information/table-subject-columns-name");
const { pool } = require("../../DB/db-pool");


const getSubjectsListQuery = async () => {
    const query = `
    SELECT
        ${TABLE_SUBJECT_COLUMNS_NAME.ID},
        ${TABLE_SUBJECT_COLUMNS_NAME.SUBJECT_NAME}
    FROM
        ${TABLES.TBL_SUBJECTS};
    `;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function is used to get the subject list
 * @param {string} lg - Language key for localization
 * @returns {Promise<Object>} - Resolves with subject list data. Rejects with error on failure.
 */
const getSubjectList = async (lg) => {
    try {
        const subjectList = await getSubjectsListQuery();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                lg || 'en',
                subjectList
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
    getSubjectList
}