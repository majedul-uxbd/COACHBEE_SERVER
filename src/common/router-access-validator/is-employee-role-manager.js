/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 * 
 * @description 
 * 
 */

const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_PROJECT_MEMBERS_COLUMNS_NAME } = require("../../DB/database-information/table-project-members-columns-name");
const { TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME } = require("../../DB/database-information/table-project-requirement-details-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");
const { setServerResponse } = require("../set-server-response");


const getEngineerRoleInProject = async (authData, detailsId) => {
    const _query = `
    SELECT
        member.${TABLE_PROJECT_MEMBERS_COLUMNS_NAME.ROLE}
    FROM
        ${TABLES.TBL_PROJECT_REQUIREMENT_DETAILS} AS details
    LEFT JOIN
        ${TABLES.TBL_PROJECT_MEMBERS} AS member
    ON
        details.${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.PROJECT_ID} = member.${TABLE_PROJECT_MEMBERS_COLUMNS_NAME.PROJECT_ID}
    WHERE
        details.${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.ID} = ? AND
        member.${TABLE_PROJECT_MEMBERS_COLUMNS_NAME.EMPLOYEE_ID} = ?;
    `;

    try {
        const [result] = await pool.query(_query, [detailsId, authData.id]);
        if (result.length > 0) {
            return result[0].role;
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * Middleware to verify that an employee has manager in a project.
 * 
 * Retrieves the employee's role for a specific project requirement detail and validates
 * that the role is 'manager'. Only employees with these roles are
 * authorized to proceed with the requested action.
 * 
 */
const isEmployeeRoleManager = async (req, res, next) => {
    const authData = req.auth;
    const { lg, detailsId } = req.body;
    try {
        const role = await getEngineerRoleInProject(authData, detailsId);
        if (role === 'manager' || authData.is_admin === 1) {
            next();
        } else if (role === 'leader' || role === 'member') {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "only_manager_can_perform_this_action",
                    lg
                )
            )
        } else {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "you_are_not_a_member_of_the_project",
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
    isEmployeeRoleManager
}