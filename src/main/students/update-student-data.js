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
const { TABLE_STUDENT_COLUMNS_NAME } = require("../../DB/database-information/table-student-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { format } = require("date-fns");

const checkIsStudentExist = async (uuid, studentId) => {
    const _query = `
    SELECT
        ${TABLE_STUDENT_COLUMNS_NAME.ID}
    FROM
        ${TABLES.TBL_STUDENTS}
    WHERE
        ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ? AND
        ${TABLE_STUDENT_COLUMNS_NAME.ID} = ? AND
        ${TABLE_STUDENT_COLUMNS_NAME.IS_ACTIVE} = 1;
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



const updateStudentDataQuery = async (authData, studentData) => {
    let _query = `UPDATE ${TABLES.TBL_STUDENTS} SET`;
    let _values = [];

    if (studentData.fullName) {
        _query += ` ${TABLE_STUDENT_COLUMNS_NAME.FULLNAME} = ?`;
        _values.push(studentData.fullName);
    }
    if (studentData.class) {
        if (_values.length > 0) _query += ', ';
        _query += ` ${TABLE_STUDENT_COLUMNS_NAME.CLASS} = ?`;
        _values.push(studentData.class);
    }
    if (studentData.guardianPhone) {
        if (_values.length > 0) _query += ', ';
        _query += ` ${TABLE_STUDENT_COLUMNS_NAME.GUARDIAN_PHONE} = ?`;
        _values.push(studentData.guardianPhone);
    }
    if (studentData.address) {
        if (_values.length > 0) _query += ', ';
        _query += ` ${TABLE_STUDENT_COLUMNS_NAME.ADDRESS} = ?`;
        _values.push(studentData.address);
    }
    if (studentData.monthlyFee) {
        if (_values.length > 0) _query += ', ';
        _query += ` ${TABLE_STUDENT_COLUMNS_NAME.MONTHLY_FEE} = ?`;
        _values.push(studentData.monthlyFee);
    }
    if (_values.length > 0) {
        _query += ', ';
        _query += ` ${TABLE_STUDENT_COLUMNS_NAME.UPDATED_AT} = ?`;
        _values.push(studentData.updatedAt);
    }

    // Final WHERE condition
    if (_values.length > 0) {
        _query += ` WHERE ${TABLE_STUDENT_COLUMNS_NAME.ID} = ? AND ${TABLE_STUDENT_COLUMNS_NAME.UUID} = ?`;
        _values.push(studentData.id);
        _values.push(authData.uuid);
    }

    // console.log({
    //     Query: _query,
    //     Values: _values
    // })

    try {
        const [result] = await pool.query(_query, _values);
        if (result && result.affectedRows > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * @param {string} lgKey 
 * @param {{ id: number, uuid: string, email: string }} authData 
 * @param {{
 * id:number,
 * fullName?:string,
 * class?:string,
 * guardianPhone?:string,
 * address?:string,
 * monthly_fee?:number,
 * }} studentData  
 * @description This function updates an existing student record in the database using the provided student data. 
 * It returns a success message if the student is updated successfully, or an error message 
 * if there is an issue during the update process.
 */
const updateStudentData = async (lgKey, authData, studentData) => {
    const updatedAt = new Date();
    studentData.updatedAt = updatedAt;
    try {
        const isExist = await checkIsStudentExist(authData.uuid, studentData.id);
        if (isExist === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "student_is_not_found",
                    lgKey
                )
            )
        }

        const isUpdated = await updateStudentDataQuery(authData, studentData);
        if (isUpdated) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'student_updated_successfully',
                    lgKey
                )
            );
        }
    } catch (error) {
        console.error("Error: ", error);
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lgKey
            )
        );
    }
}

module.exports = {
    updateStudentData
}