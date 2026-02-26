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


const deleteStudentDataQuery = async (uuid, studentId) => {
    const _query = `
    DELETE FROM
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
        return rows.affectedRows > 0 ? true : false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * @description This function deletes a student record from the database based on the provided student ID and user UUID.
 * @param {string} lgKey 
 * @param {{id:number,uuid:string}} authData 
 * @param {number} studentId 
 */
const deleteStudentData = async (lgKey, authData, studentId) => {
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

        const isDeleted = await deleteStudentDataQuery(authData.uuid, studentId);
        if (isDeleted === true) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    "student_deleted_successfully",
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
    deleteStudentData
}