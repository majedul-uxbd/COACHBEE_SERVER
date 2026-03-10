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

const { randomUUID } = require('crypto');
const { setServerResponse } = require('../../common/set-server-response');
const { API_STATUS_CODE } = require('../../consts/error-status');
const { TABLES } = require('../../DB/database-information/tables');
const { TABLE_USERS_COLUMNS_NAME } = require('../../DB/database-information/table-user-columns-name');
const { pool } = require('../../DB/db-pool');
const hashPassword = require('bcrypt');

const checkAdminEmailExistsQuery = async (email) => {
    const _query = `
    SELECT 
        ${TABLE_USERS_COLUMNS_NAME.EMAIL}
    FROM
        ${TABLES.TBL_USERS}
    WHERE
        ${TABLE_USERS_COLUMNS_NAME.EMAIL} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [email]);
        if (result.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

const insertAdminDataQuery = async (uuid, userData) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_USERS}
        (
            ${TABLE_USERS_COLUMNS_NAME.UUID},
            ${TABLE_USERS_COLUMNS_NAME.FULLNAME},
            ${TABLE_USERS_COLUMNS_NAME.COACHING_NAME},
            ${TABLE_USERS_COLUMNS_NAME.EMAIL},
            ${TABLE_USERS_COLUMNS_NAME.ROLE},
            ${TABLE_USERS_COLUMNS_NAME.PASSWORD},
            ${TABLE_USERS_COLUMNS_NAME.PLAN}
        )
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const _values = [
        uuid,
        userData.fullName,
        userData.coachingName,
        userData.email,
        "admin",
        userData.password,
        userData.plan || 'TRAIL'
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
 * @param {string} lgKey - Language key for response messages
 * @param {{
 * fullName:string,
 * coachingName:string,
 * email:string,
 * password:string
 * plan:string
 * }} userData  - The user data for the new admin to be created
 * @description This function creates a new admin user in the database. It first checks if the email already exists, 
 * and if not, it inserts the new admin data into the database.
 * @returns success message if the admin is created successfully, or an error message if there is an issue during the process.
 */
const createNewAdmin = async (lgKey, userData) => {
    const uuid = randomUUID(); // e.g. 550e8400-e29b-41d4-a716-446655440000

    try {
        const isEmailExists = await checkAdminEmailExistsQuery(userData.email);
        if (isEmailExists) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'email_has_already_exist',
                    lgKey
                )
            );
        }

        const hashedPassword = await hashPassword.hash(userData.password, 10);
        userData.password = hashedPassword;

        const isInserted = await insertAdminDataQuery(uuid, userData);
        if (isInserted) {
            return Promise.resolve(
                setServerResponse(
                    API_STATUS_CODE.OK,
                    'admin_created_successfully',
                    lgKey
                )
            );
        }
    } catch (error) {
        console.log('🚀 ------------------------------------------🚀');
        console.log('🚀 ~ :116 ~ createNewAdmin ~ error:', error);
        console.log('🚀 ------------------------------------------🚀');
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
    createNewAdmin
}