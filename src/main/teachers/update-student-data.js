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
const { format } = require("date-fns");
const { TABLE_TEACHERS_COLUMNS_NAME } = require("../../DB/database-information/table-teachers-columns-name");

const checkIsTeacherExist = async (uuid, teacherId) => {
    const _query = `
    SELECT
        ${TABLE_TEACHERS_COLUMNS_NAME.ID}
    FROM
        ${TABLES.TBL_TEACHERS}
    WHERE
        ${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ? AND
        ${TABLE_TEACHERS_COLUMNS_NAME.ID} = ? AND
        ${TABLE_TEACHERS_COLUMNS_NAME.IS_ACTIVE} = 1;
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



const updateTeacherDataQuery = async (authData, teacherData) => {
    let _query = `UPDATE ${TABLES.TBL_TEACHERS} SET`;
    let _values = [];

    if (teacherData.fullName) {
        _query += ` ${TABLE_TEACHERS_COLUMNS_NAME.FULLNAME} = ?`;
        _values.push(teacherData.fullName);
    }
    if (teacherData.class) {
        if (_values.length > 0) _query += ', ';
        _query += ` ${TABLE_TEACHERS_COLUMNS_NAME.CLASS} = ?`;
        _values.push(teacherData.class);
    }
    if (teacherData.phone) {
        if (_values.length > 0) _query += ', ';
        _query += ` ${TABLE_TEACHERS_COLUMNS_NAME.PHONE} = ?`;
        _values.push(teacherData.phone);
    }
    if (teacherData.address) {
        if (_values.length > 0) _query += ', ';
        _query += ` ${TABLE_TEACHERS_COLUMNS_NAME.ADDRESS} = ?`;
        _values.push(teacherData.address);
    }
    if (teacherData.salary) {
        if (_values.length > 0) _query += ', ';
        _query += ` ${TABLE_TEACHERS_COLUMNS_NAME.SALARY} = ?`;
        _values.push(teacherData.salary);
    }
    if (_values.length > 0) {
        _query += ', ';
        _query += ` ${TABLE_TEACHERS_COLUMNS_NAME.UPDATED_AT} = ?`;
        _values.push(teacherData.updatedAt);
    }

    // Final WHERE condition
    if (_values.length > 0) {
        _query += ` WHERE ${TABLE_TEACHERS_COLUMNS_NAME.ID} = ? AND ${TABLE_TEACHERS_COLUMNS_NAME.UUID} = ?`;
        _values.push(teacherData.id);
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
 * phone?:string,
 * address?:string,
 * salary?:number,
 * }} teacherData  
 * @description This function updates an existing teacher record in the database using the provided teacher data. 
 * It returns a success message if the teacher is updated successfully, or an error message 
 * if there is an issue during the update process.
 */
const updateTeacherData = async (lgKey, authData, teacherData) => {
    const updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    teacherData.updatedAt = updatedAt;
    try {
        const isExist = await checkIsTeacherExist(authData.uuid, teacherData.id);
        if (isExist === false) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "teacher_is_not_found",
                    lgKey
                )
            )
        }

        const isUpdated = await updateTeacherDataQuery(authData, teacherData);
        if (isUpdated) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'teacher_updated_successfully',
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
    updateTeacherData
}