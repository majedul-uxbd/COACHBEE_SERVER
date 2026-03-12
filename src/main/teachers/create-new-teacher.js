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
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_TEACHERS_COLUMNS_NAME } = require("../../DB/database-information/table-teachers-columns-name");

const insertTeacherDataQuery = async (authData, studentData) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_TEACHERS}
        (
            ${TABLE_TEACHERS_COLUMNS_NAME.UUID},
            ${TABLE_TEACHERS_COLUMNS_NAME.FULLNAME},
            ${TABLE_TEACHERS_COLUMNS_NAME.CLASS},
            ${TABLE_TEACHERS_COLUMNS_NAME.PHONE},
            ${TABLE_TEACHERS_COLUMNS_NAME.ADDRESS},
            ${TABLE_TEACHERS_COLUMNS_NAME.SALARY}
        )
    VALUES (?, ?, ?, ?, ?, ?);
    `;

    const _values = [
        authData.uuid,
        studentData.fullName,
        JSON.stringify(studentData.class),
        studentData.phone,
        studentData.address,
        studentData.salary
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
 * phone:string,
 * address:string,
 * salary:number,
 * }} teacherData  
 * @description This function creates a new teacher record in the database using the provided teacher data. 
 * It returns a success message if the teacher is created successfully, or an error message 
 * if there is an issue during the creation process.
 */
const createNewTeacher = async (lg, authData, teacherData) => {
    try {
        const isInserted = await insertTeacherDataQuery(authData, teacherData);
        if (isInserted) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'teacher_created_successfully',
                    lg
                )
            );
        }
    } catch (error) {
        // console.log('🚀 -------------------------------------------🚀');
        // console.log('🚀 ~ :79 ~ createNewTeacher ~ error:', error);
        // console.log('🚀 -------------------------------------------🚀');
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