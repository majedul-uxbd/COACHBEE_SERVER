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

const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME } = require("../../DB/database-information/table-project-requirement-details-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");
const { setServerResponse } = require("../set-server-response");


const getFinanceTeamStatusQuery = async (detailsId) => {
    const _query = `
    SELECT
        ${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.FINANCE_STATUS}
    FROM
        ${TABLES.TBL_PROJECT_REQUIREMENT_DETAILS}
    WHERE
        ${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.FINANCE_STATUS} = 'reviewed' AND
        ${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.ID} = ?;
    `;

    try {
        const [result] = await pool.query(_query, [detailsId]);
        if (result.length > 0) {
            return true;
        } return false;
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * Middleware to verify that an engineer is able to notify the finance team.
 * 
 * Checks if the engineer status for a specific project requirement detail is 'notified'.
 * 
 */
const isFinanceTeamAbleToNotifyEngineerTeam = async (req, res, next) => {
    const { lg, detailsId } = req.body;
    try {
        const isExist = await getFinanceTeamStatusQuery(detailsId);
        if (isExist === true) {
            next();
        } else {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "notify_engineer_team_is_not_possible",
                    lg
                )
            )
        }
    } catch (error) {
        return res.status(API_STATUS_CODE.INTERNAL_SERVER_ERROR).send(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                "internal_server_error",
                lg
            )
        )
    }
}

module.exports = {
    isFinanceTeamAbleToNotifyEngineerTeam
}