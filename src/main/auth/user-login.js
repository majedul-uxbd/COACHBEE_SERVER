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

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");
const { API_STATUS_CODE } = require('../../consts/error-status');
const { setServerResponse } = require('../../common/set-server-response');
const { TABLE_USERS_COLUMNS_NAME } = require('../../DB/database-information/table-user-columns-name');
const { TABLE_TEACHERS_COLUMNS_NAME } = require('../../DB/database-information/table-teachers-columns-name');


/**
 * Queries the database for a user by email and returns user info or status code.
 * @param {string} email - The user's email address.
 * @returns {Promise<Object|number|boolean>} User info object if found and active, 2 if pending, 0 if inactive, false if not found.
 */
const userLoginQuery = async (email) => {
    const _query = `
        SELECT
            ${TABLE_USERS_COLUMNS_NAME.ID},
            ${TABLE_USERS_COLUMNS_NAME.UUID},
            ${TABLE_USERS_COLUMNS_NAME.FULLNAME},
            ${TABLE_USERS_COLUMNS_NAME.EMAIL},
            ${TABLE_USERS_COLUMNS_NAME.ROLE},
            ${TABLE_USERS_COLUMNS_NAME.PASSWORD},
            ${TABLE_USERS_COLUMNS_NAME.IMAGE_URL}
        FROM
            ${TABLES.TBL_USERS}
        WHERE
            ${TABLE_USERS_COLUMNS_NAME.EMAIL} = ? AND
            ${TABLE_USERS_COLUMNS_NAME.IS_ACTIVE} = 1;
        `;

    try {
        const [rows] = await pool.query(_query, [email]);
        if (rows.length > 0) {
            return Promise.resolve(rows[0]);
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * Queries the database for a user by email and returns user info or status code.
 * @param {string} email - The user's email address.
 * @returns {Promise<Object|number|boolean>} User info object if found and active, 2 if pending, 0 if inactive, false if not found.
 */
const teacherLoginQuery = async (email) => {
    const _query = `
        SELECT
            ${TABLE_TEACHERS_COLUMNS_NAME.ID},
            ${TABLE_TEACHERS_COLUMNS_NAME.UUID},
            ${TABLE_TEACHERS_COLUMNS_NAME.FULLNAME},
            ${TABLE_TEACHERS_COLUMNS_NAME.EMAIL},
            ${TABLE_TEACHERS_COLUMNS_NAME.ROLE},
            ${TABLE_TEACHERS_COLUMNS_NAME.PASSWORD}
        FROM
            ${TABLES.TBL_TEACHERS}
        WHERE
            ${TABLE_TEACHERS_COLUMNS_NAME.EMAIL} = ? AND
            ${TABLE_TEACHERS_COLUMNS_NAME.IS_ACTIVE} = 1;
        `;

    try {
        const [rows] = await pool.query(_query, [email]);
        if (rows.length > 0) {
            return Promise.resolve(rows[0]);
        }
        return false;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * Generates a JWT token for the given user info.
 * @param {{ id: number, uuid: string, email: string, role: string }} userInfo - The user information for the token payload.
 * @returns {string} The generated JWT token.
 * @description This function will generate a unique user token.
 */
const generateToken = (userInfo) => {
    const token = jwt.sign(
        {
            id: userInfo.id,
            uuid: userInfo.uuid,
            email: userInfo.email,
            role: userInfo.role,
        },
        process.env.SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
    );

    return token;
};


/**
 * Handles user login by validating credentials and returning a server response with a token on success.
 * @param {{ lg: string, email: string, password: string }} userData - The user login data.
 * @returns {Promise<Object>} The server response indicating success or failure, with a token and user info on success.
 * @description This function handles user login by validated user data.
 */
const userLogin = async (userData) => {
    let userInfo;

    try {
        userInfo = await userLoginQuery(userData.email);
        if (_.isEmpty(userInfo)) {
            userInfo = await teacherLoginQuery(userData.email);
        }
        console.log('🚀 ~ user-login.js:121 ~ userInfo:', userInfo);
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_email_or_password',
                userData.lg,
            )
        );
    }

    if (userInfo === false) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'user_not_found_or_user_is_not_active',
                userData.lg
            )
        );
    }

    let isPasswordCorrect;
    try {
        isPasswordCorrect = await bcrypt.compare(
            userData.password,
            userInfo.password
        ); //compare user passwords
    } catch (error) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_email_or_password',
                userData.lg,
            )
        );
    }
    if (isPasswordCorrect === false) {
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'invalid_email_or_password',
                userData.lg,
            )
        );
    }
    const token = generateToken(userInfo);
    console.log('🚀 ~ user-login.js:173 ~ token:', token);
    user = {
        token: token,
        id: userInfo.id,
        uuid: userInfo.uuid,
        fullName: userInfo.full_name,
        email: userInfo.email,
        role: userInfo.role,
        image_url: userInfo.image_url,
    }

    return Promise.resolve(
        setServerResponse(
            API_STATUS_CODE.OK,
            'user_logged_in_successfully',
            userData.lg,
            user
        )
    );
}

module.exports = {
    userLogin
};