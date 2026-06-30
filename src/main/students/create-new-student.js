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
const { format } = require("date-fns");
const { TABLE_STUDENT_COLUMNS_NAME } = require("../../DB/database-information/table-student-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_STUDENT_PAYMENTS_COLUMNS_NAME } = require("../../DB/database-information/table-student-payments-columns-name");

const insertStudentDataQuery = async (connection, authData, monthYear, studentData) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_STUDENTS}
        (
            ${TABLE_STUDENT_COLUMNS_NAME.UUID},
            ${TABLE_STUDENT_COLUMNS_NAME.FULLNAME},
            ${TABLE_STUDENT_COLUMNS_NAME.CLASS},
            ${TABLE_STUDENT_COLUMNS_NAME.GUARDIAN_PHONE},
            ${TABLE_STUDENT_COLUMNS_NAME.ADDRESS},
            ${TABLE_STUDENT_COLUMNS_NAME.STARTING_MONTH},
            ${TABLE_STUDENT_COLUMNS_NAME.MONTHLY_FEE}
        )
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const _values = [
        authData.uuid,
        studentData.fullName,
        studentData.class,
        studentData.guardianPhone,
        studentData.address,
        monthYear,
        studentData.monthly_fee
    ];
    try {
        const [result] = await connection.query(_query, _values);
        return result.insertId;
    } catch (error) {
        return Promise.reject(error);
    }
}


const insertStudentDataInPaymentTableQuery = async (connection, studentId, monthName, year, studentData) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_STUDENT_PAYMENTS}
        (
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.STUDENT_ID},
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.MONTH},
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.YEAR},
            ${TABLE_STUDENT_PAYMENTS_COLUMNS_NAME.TOTAL_PAYABLE_AMOUNT}
        )
    VALUES (?, ?, ?, ?);
    `;

    const _values = [
        studentId,
        monthName,
        year,
        studentData.monthly_fee
    ];
    try {
        await connection.query(_query, _values);
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
    const date = new Date();

    const monthName = format(date, 'MMMM');
    const year = format(date, 'yyyy');
    const monthYear = format(date, 'MMMM yyyy');
    const connection = await pool.getConnection();
    try {
        // Start Transaction
        connection.beginTransaction();
        // Insert Student Data
        const studentId = await insertStudentDataQuery(connection, authData, monthYear, studentData);
        // Insert Student Data in Payment Table
        await insertStudentDataInPaymentTableQuery(connection, studentId, monthName, year, studentData);
        // Commit Transaction
        await connection.commit();
        // Return Response
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'student_created_successfully',
                lg
            )
        );
    } catch (error) {
        // console.log("🚀 ~ createNewStudent ~ error:", error)

        // Rollback Transaction
        await connection.rollback();
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