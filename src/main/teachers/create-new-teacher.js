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

const { format } = require("date-fns");
const { setServerResponse } = require("../../common/set-server-response");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_TEACHERS_COLUMNS_NAME } = require("../../DB/database-information/table-teachers-columns-name");
const { TABLE_TEACHER_PAYMENTS_COLUMNS_NAME } = require("../../DB/database-information/table-teacher-salary-columns-name");

const insertTeacherDataQuery = async (connection, authData, monthYear, teacherData) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_TEACHERS}
        (
            ${TABLE_TEACHERS_COLUMNS_NAME.UUID},
            ${TABLE_TEACHERS_COLUMNS_NAME.FULLNAME},
            ${TABLE_TEACHERS_COLUMNS_NAME.CLASS},
            ${TABLE_TEACHERS_COLUMNS_NAME.PHONE},
            ${TABLE_TEACHERS_COLUMNS_NAME.ADDRESS},
            ${TABLE_TEACHERS_COLUMNS_NAME.STARTING_MONTH},
            ${TABLE_TEACHERS_COLUMNS_NAME.SALARY}
        )
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const _values = [
        authData.uuid,
        teacherData.fullName,
        JSON.stringify(teacherData.class),
        teacherData.phone,
        teacherData.address,
        monthYear,
        teacherData.salary
    ];
    try {
        const [result] = await connection.query(_query, _values);
        return result.insertId;
    } catch (error) {
        return Promise.reject(error);
    }
}


const insertTeacherDataInPaymentTableQuery = async (connection, teacherId, monthName, year, teacherSalary) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_TEACHER_SALARY}
        (
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TEACHERS_ID},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.MONTH},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.YEAR},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TOTAL_PAYABLE_AMOUNT}
        )
    VALUES (?, ?, ?, ?);
    `;

    const _values = [
        teacherId,
        monthName,
        year,
        teacherSalary
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
 * phone:string,
 * address:string,
 * salary:number,
 * }} teacherData  
 * @description This function creates a new teacher record in the database using the provided teacher data. 
 * It returns a success message if the teacher is created successfully, or an error message 
 * if there is an issue during the creation process.
 */
const createNewTeacher = async (lg, authData, teacherData) => {
    const date = new Date();

    const monthName = format(date, 'MMMM');
    const year = format(date, 'yyyy');
    const monthYear = format(date, 'MMMM yyyy');
    const connection = await pool.getConnection();
    try {
        const teacherId = await insertTeacherDataQuery(connection, authData, monthYear, teacherData);
        await insertTeacherDataInPaymentTableQuery(connection, teacherId, monthName, year, teacherData.salary);
        await connection.commit();
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'teacher_created_successfully',
                lg
            )
        );

    } catch (error) {
        console.log('🚀 ~ :79 ~ createNewTeacher ~ error:', error);
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
    createNewTeacher
}