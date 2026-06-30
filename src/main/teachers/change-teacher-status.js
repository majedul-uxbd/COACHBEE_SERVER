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

const { format } = require('date-fns');
const { setServerResponse } = require("../../common/set-server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_TEACHERS_COLUMNS_NAME } = require("../../DB/database-information/table-teachers-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


const checkIsTeacherExist = async (uuid, teacherId) => {
    const _query = `
    SELECT
        ${TABLE_TEACHERS_COLUMNS_NAME.ID}
    FROM
        ${TABLES.TBL_TEACHERS}
    WHERE
        ${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ? AND
        ${TABLE_TEACHERS_COLUMNS_NAME.ID} = ?
    `;
    const _values = [
        uuid,
        teacherId
    ];
    try {
        const [rows] = await pool.query(_query, _values);
        return rows.length > 0 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getTeacherCurrentStatus = async (uuid, teacherId) => {
    const _query = `
    SELECT
        ${TABLE_TEACHERS_COLUMNS_NAME.IS_ACTIVE}
    FROM
        ${TABLES.TBL_TEACHERS}
    WHERE
        ${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ? AND
        ${TABLE_TEACHERS_COLUMNS_NAME.ID} = ?
    `;
    const _values = [
        uuid,
        teacherId
    ];
    try {
        const [rows] = await pool.query(_query, _values);
        return rows[0][TABLE_TEACHERS_COLUMNS_NAME.IS_ACTIVE];
    } catch (error) {
        return Promise.reject(error);
    }
}


const changeTeacherStatusQuery = async (uuid, teacherId, statusCode, updatedAt) => {
    const _query = `
    UPDATE
        ${TABLES.TBL_TEACHERS}
    SET
        ${TABLE_TEACHERS_COLUMNS_NAME.IS_ACTIVE} = ?,
        ${TABLE_TEACHERS_COLUMNS_NAME.UPDATED_AT} = ?
    WHERE
        ${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ? AND
        ${TABLE_TEACHERS_COLUMNS_NAME.ID} = ?
    `;
    const _values = [
        statusCode,
        updatedAt,
        uuid,
        teacherId
    ];
    try {
        const [rows] = await pool.query(_query, _values);
        return rows.affectedRows > 0 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function changes the status of a teacher record in the database based on the provided teacher ID, 
 * user UUID, and status code.
 * @param {string} lgKey 
 * @param {{id:number,uuid:string}} authData 
 * @param {number} teacherId 
 * @param {number} statusCode
 */
const changeTeacherStatus = async (lgKey, authData, teacherId, statusCode) => {
    const messageKey = statusCode === 1 ? "teacher_activated_successfully" : "teacher_inactivated_successfully";
    const updatedAt = new Date();
    try {
        const isExist = await checkIsTeacherExist(authData.uuid, teacherId);
        if (isExist === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "teacher_is_not_found",
                    lgKey
                )
            )
        }

        const currentStatus = await getTeacherCurrentStatus(authData.uuid, teacherId);
        if (currentStatus == 0 && statusCode == 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "teacher_has_already_inactive",
                    lgKey
                )
            )
        }

        if (currentStatus == 1 && statusCode == 1) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "teacher_has_already_active",
                    lgKey
                )
            )
        }

        const isChanged = await changeTeacherStatusQuery(authData.uuid, teacherId, statusCode, updatedAt);
        if (isChanged === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    messageKey,
                    lgKey
                )
            )
        }
    } catch (error) {
        // console.log('🚀 ~ :143 ~ changeTeacherStatus ~ error:', error);
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
    changeTeacherStatus
}