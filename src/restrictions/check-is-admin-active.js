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

const { setServerResponse } = require("../common/set-server-response");
const { API_STATUS_CODE } = require("../consts/error-status");
const { TABLE_USERS_COLUMNS_NAME } = require("../DB/database-information/table-user-columns-name");
const { TABLES } = require("../DB/database-information/tables");
const { pool } = require("../DB/db-pool");


const checkIsAdminActiveQuery = async (uuid) => {
    const _query = `
    SELECT
        ${TABLE_USERS_COLUMNS_NAME.ID}
    FROM
        ${TABLES.TBL_USERS}
    WHERE
        ${TABLE_USERS_COLUMNS_NAME.UUID} = ?;
    `;
    try {
        const [result] = await pool.query(_query, [uuid]);
        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * 
 * @description Middleware function to check if the admin user is active based on the provided authentication data. 
 * It verifies the user's status in the database and allows access to the next middleware or route handler 
 * if the user is active. If the user is not active or an error occurs, it sends an appropriate response to the client.
 * @returns 
 */
const checkIsAdminActive = async (req, res, next) => {
    const authData = req.auth;
    try {
        const isAdminActive = await checkIsAdminActiveQuery(authData.uuid);
        if (isAdminActive === true) {
            next();
        } else {
            return res.status(API_STATUS_CODE.UNAUTHORIZED).send(
                setServerResponse(
                    API_STATUS_CODE.UNAUTHORIZED,
                    'invalid_user',
                    'en',
                )
            );
        }
    } catch (error) {
        return res.status(API_STATUS_CODE.INTERNAL_SERVER_ERROR).send(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                'en',
            )
        );
    }
}

module.exports = {
    checkIsAdminActive
}