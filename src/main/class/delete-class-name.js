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


const isClassNameExistQuery = async (classId) => {
    const _query = `
        SELECT
            ${TABLE_CLASS_COLUMNS_NAME.ID}
        FROM
            ${TABLES.TBL_CLASS}
        WHERE
            ${TABLE_CLASS_COLUMNS_NAME.ID} = ?
    `;
    try {
        const [result] = await pool.query(_query, [classId]);
        return result.length >= 1 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
};


const deleteClassNameQuery = async (classId) => {
    const _query = `
        DELETE FROM
            ${TABLES.TBL_CLASS}
        WHERE
            ${TABLE_CLASS_COLUMNS_NAME.ID} = ?
    `;
    try {
        const [result] = await pool.query(_query, [classId]);
        return result.affectedRows >= 1 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * This function delete a class name from the database.
 * @param {string} lgKey 
 * @param {number} classId 
 * @returns 
 */
const deleteClassName = async (lgKey, classId) => {
    if (!classId) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "id_is_required",
                lgKey
            )
        );
    }

    try {
        const isClassExist = await isClassNameExistQuery(classId);
        if (!isClassExist) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "class_name_is_not_found_or_deleted",
                    lgKey
                )
            );
        }
        const isDeleted = await deleteClassNameQuery(classId);
        if (isDeleted) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    "class_name_deleted_successfully",
                    lgKey
                )
            );
        }
    } catch (error) {
        // console.log('🚀 ~ delete-class-name.js:41 ~ error:', error);
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
    deleteClassName
}