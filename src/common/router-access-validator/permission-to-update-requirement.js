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

const _ = require('lodash');
const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_PROJECT_ENG_REQUIREMENT_COLUMNS_NAME } = require("../../DB/database-information/table-project-eng-requirement-columns-name");
const { TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME } = require("../../DB/database-information/table-project-requirement-details-columns-name");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");
const { setServerResponse } = require("../set-server-response");
const { deleteUploadedFile } = require('../../utilities/delete-uploaded-file');


const getBudgetStatus = async (requirementId) => {
    const _query = `
    SELECT
        ${TABLE_PROJECT_ENG_REQUIREMENT_COLUMNS_NAME.BUDGET_STATUS}
    FROM
        ${TABLES.TBL_PROJECT_ENG_REQUIREMENTS}
    WHERE
        (
            ${TABLE_PROJECT_ENG_REQUIREMENT_COLUMNS_NAME.BUDGET_STATUS} = 'approved' OR
            ${TABLE_PROJECT_ENG_REQUIREMENT_COLUMNS_NAME.BUDGET_STATUS} =  'rejected'
        ) AND
        ${TABLE_PROJECT_ENG_REQUIREMENT_COLUMNS_NAME.ID} = ?;
    `;

    try {
        const [result] = await pool.query(_query, [requirementId]);
        if (result.length > 0) {
            return true;
        } return false
    } catch (error) {
        return Promise.reject(error);
    }
}

const getEngineerStatus1Status = async (detailsId) => {
    const _query = `
    SELECT
        ${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.SALES_SUPPORT}
    FROM
        ${TABLES.TBL_PROJECT_REQUIREMENT_DETAILS}
    WHERE
        ${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.SALES_SUPPORT} = 'YES' AND
        ${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.ID} = ?;
    `;

    try {
        const [result] = await pool.query(_query, [detailsId]);
        if (result.length > 0) {
            return true;
        } return false
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * Middleware to authorize requirement update operations based on budget status.
 *
 * Validates that a project engineering requirement has a 'pending' budget status before allowing updates.
 * Only requirements with 'pending' status can be updated; all other statuses are denied.
 */
const hasPermissionToUpdateRequirement = async (req, res, next) => {
    const { lg, detailsId, requirementId } = req.body;
    try {
        const budgetStatus = await getBudgetStatus(requirementId);
        console.log('🚀 ~ permission-to-update-requirement.js:77 ~ budgetStatus:', budgetStatus);
        const engineerStatus = await getEngineerStatus1Status(detailsId);
        console.log('🚀 ~ permission-to-update-requirement.js:79 ~ engineerStatus:', engineerStatus);
        if (budgetStatus === true) {
            if (req.file) {
                deleteUploadedFile(req.file);
            }
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "requirement_update_not_allowed_yet",
                    lg
                )
            )
        }
        if (engineerStatus === true) {
            next();
        } else {
            if (req.file) {
                deleteUploadedFile(req.file);
            }
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "create_project_requirement_first",
                    lg
                )
            )
        }
    } catch (error) {
        console.log('🚀 ~ create-new-requirement.js:68 ~ error:', error);
        if (req.file) {
            deleteUploadedFile(req.file);
        }
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
    hasPermissionToUpdateRequirement
}