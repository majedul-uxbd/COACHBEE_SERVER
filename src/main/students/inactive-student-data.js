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
const { TABLE_STUDENT_COLUMNS_NAME } = require("../../DB/database-information/table-student-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


const checkIsStudentExist = async (uuid, studentId) => {
    const _query = `
    SELECT
        ${TABLE_STUDENT_COLUMNS_NAME.ID}
    FROM
        ${TABLES.TBL_STUDENTS}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ? AND
        ${TABLE_STUDENT_COLUMNS_NAME.ID} = ?
    `;
    const _values = [
        uuid,
        studentId
    ];
    try {
        const [rows] = await pool.query(_query, _values);
        return rows.length > 0 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
}


const getStudentCurrentStatus = async (uuid, studentId) => {
    const _query = `
    SELECT
        ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE}
    FROM
        ${TABLES.TBL_STUDENTS}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ? AND
        ${TABLE_STUDENT_COLUMNS_NAME.ID} = ?
    `;
    const _values = [
        uuid,
        studentId
    ];
    try {
        const [rows] = await pool.query(_query, _values);
        return rows[0][TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE];
    } catch (error) {
        return Promise.reject(error);
    }
}


const changeStudentStatusQuery = async (uuid, studentId, statusCode, updatedAt) => {
    const _query = `
    UPDATE
        ${TABLES.TBL_STUDENTS}
    SET
        ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = ?,
        ${TABLE_STUDENT_COLUMNS_NAME.UPDATED_AT} = ?
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ? AND
        ${TABLE_STUDENT_COLUMNS_NAME.ID} = ?
    `;
    const _values = [
        statusCode,
        updatedAt,
        uuid,
        studentId
    ];
    try {
        const [rows] = await pool.query(_query, _values);
        return rows.affectedRows > 0 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function changes the status of a student record in the database based on the provided student ID, 
 * user UUID, and status code.
 * @param {string} lgKey 
 * @param {{id:number,uuid:string}} authData 
 * @param {number} studentId 
 * @param {number} statusCode
 */
const changeStudentStatus = async (lgKey, authData, studentId, statusCode) => {
    const messageKey = statusCode === 1 ? "student_activated_successfully" : "student_inactivated_successfully";
    const updatedAt = new Date();
    try {
        const isExist = await checkIsStudentExist(authData.uuid, studentId);
        if (isExist === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "student_is_not_found",
                    lgKey
                )
            )
        }

        const currentStatus = await getStudentCurrentStatus(authData.uuid, studentId);
        if (currentStatus == 0 && statusCode == 0) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "student_has_already_inactive",
                    lgKey
                )
            )
        }

        if (currentStatus == 1 && statusCode == 1) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "student_has_already_active",
                    lgKey
                )
            )
        }

        const isChanged = await changeStudentStatusQuery(authData.uuid, studentId, statusCode, updatedAt);
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
    changeStudentStatus
}