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

const insertStudentDataQuery = async (authData, studentData) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_STUDENTS}
        (
            ${TABLE_STUDENT_COLUMNS_NAME.UUID},
            ${TABLE_STUDENT_COLUMNS_NAME.FULLNAME},
            ${TABLE_STUDENT_COLUMNS_NAME.CLASS},
            ${TABLE_STUDENT_COLUMNS_NAME.GUARDIAN_PHONE},
            ${TABLE_STUDENT_COLUMNS_NAME.ADDRESS},
            ${TABLE_STUDENT_COLUMNS_NAME.MONTHLY_FEE}
        )
    VALUES (?, ?, ?, ?, ?, ?);
    `;

    const _values = [
        authData.uuid,
        studentData.fullName,
        studentData.class,
        studentData.guardianPhone,
        studentData.address,
        studentData.monthly_fee
    ];
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
 * @param {string} lg 
 * @param {{ id: number, uuid: string, email: string }} authData 
 * @param {{
 * fullName:string,
 * class:string,
 * guardianPhone:string,
 * address:string,
 * monthly_fee:number,
 * }} studentData  
 * @description This function creates a new student record in the database using the provided student data. 
 * It returns a success message if the student is created successfully, or an error message 
 * if there is an issue during the creation process.
 */
const createNewStudent = async (lg, authData, studentData) => {
    try {
        const isInserted = await insertStudentDataQuery(authData, studentData);
        if (isInserted) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'student_created_successfully',
                    lg
                )
            );
        }
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
    createNewStudent
}