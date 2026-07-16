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


const insertClassNameQuery = async (className) => {
    const _query = `
        INSERT IGNORE INTO
            ${TABLES.TBL_CLASSES}
            (
                ${TABLE_CLASS_COLUMNS_NAME.CLASS_NAME}
            )
        VALUES (?)
    `;
    try {
        const [result] = await pool.query(_query, [className]);
        return result.affectedRows >= 0 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * This function creates a new class name in the database.
 * @param {string} lgKey 
 * @param {string} className 
 * @returns 
 */
const createClassName = async (lgKey, className) => {
    if (!className) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "class_name-is_required",
                lgKey
            )
        );
    }

    try {
        const isCreated = await insertClassNameQuery(className);
        if (isCreated) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    "class_name_created_successfully",
                    lgKey
                )
            );
        }
    } catch (error) {
        console.log('🚀 ~ create-class-name.js:41 ~ error:', error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                "internal_server_error",
                lgKey
            )
        );
    }
}

module.exports = {
    createClassName
}