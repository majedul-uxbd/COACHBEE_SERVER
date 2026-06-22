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
const { TABLE_USERS_COLUMNS_NAME } = require("../../DB/database-information/table-user-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");


/**
 * Retrieves personal data of a user from the database based on authentication data.
 *
 * @param {{ id: number, email: string }} authData - Authenticated user data.
 * @returns {Promise<Object>} - Resolves with user personal data object if found. Rejects with error on failure.
 */
const getUserPersonalData = async (authData) => {
    const _query = `
        SELECT
            ${TABLE_USERS_COLUMNS_NAME.ID},
            ${TABLE_USERS_COLUMNS_NAME.FULLNAME},
            ${TABLE_USERS_COLUMNS_NAME.EMAIL},
            ${TABLE_USERS_COLUMNS_NAME.ROLE},
            ${TABLE_USERS_COLUMNS_NAME.IMAGE_URL},
            ${TABLE_USERS_COLUMNS_NAME.CREATED_AT}, 
            ${TABLE_USERS_COLUMNS_NAME.UPDATED_AT}
        FROM
            ${TABLES.TBL_USERS}
        WHERE
            ${TABLE_USERS_COLUMNS_NAME.ID} = ? AND
            ${TABLE_USERS_COLUMNS_NAME.UUID} = ? AND
            ${TABLE_USERS_COLUMNS_NAME.EMAIL} = ? AND
            ${TABLE_USERS_COLUMNS_NAME.IS_ACTIVE} = 1;
    `;

    const _values = [
        authData.id,
        authData.uuid,
        authData.email,
    ];
    try {
        const [rows] = await pool.query(_query, _values);
        return rows[0];
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * Retrieves personal data of a user and returns a standardized server response.
 *
 * @param {{ id: number,  email: string }} authData - Authenticated user data.
 * @returns {Promise<Object>} - Resolves with a server response containing user data on success, or an error response on failure.
 */
const getPersonalData = async (authData) => {
    const lgKey = 'en'; // Default language key
    try {
        const userData = await getUserPersonalData(authData);
        // console.log({
        //     path: __filename,
        //     userData
        // });
        if (!userData) {
            return Promise.reject(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'user_not_found_or_user_is_not_active',
                    lgKey || 'en'
                )
            );
        }
        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'get_data_successfully',
                lgKey || 'en',
                userData
            )
        );
    } catch (error) {
        console.log('🚀 ------------------------------------------🚀');
        console.log('🚀 ~ :87 ~ getPersonalData ~ error:', error);
        console.log('🚀 ------------------------------------------🚀');
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lgKey || 'en'
            )
        );
    }
};

module.exports = {
    getPersonalData
};