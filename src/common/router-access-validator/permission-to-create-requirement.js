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
const { deleteUploadedFile } = require("../../utilities/delete-uploaded-file");
const { setServerResponse } = require("../set-server-response");


const getEngineerStatus = async (detailsId) => {
    const _query = `
    SELECT
        ${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.ENGINEER_STATUS_1}
    FROM
        ${TABLES.TBL_PROJECT_REQUIREMENT_DETAILS}
    WHERE
        ${TABLE_PROJECT_REQUIREMENT_DETAILS_COLUMNS_NAME.ID} = ?;
    `;

    try {
        const [result] = await pool.query(_query, [detailsId]);
        return result[0].engineer_status_1;
    } catch (error) {
        return Promise.reject(error);
    }
}

/**
 * Middleware to verify that an engineer has permission to create a new requirement.
 *
 * Checks if the engineer's status for a specific project requirement detail is 'notified'.
 * Only engineers with 'notified' status are allowed to proceed with creating a new requirement.
 */
const hasPermissionToCreateRequirement = async (req, res, next) => {
    const { lg, detailsId } = req.body;
    try {
        const status = await getEngineerStatus(detailsId);
        if (status === 'notified') {
            next();
        }
        else if (status === 'reviewed') {
            if (req.file) {
                deleteUploadedFile(req.file);
            }
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "requirement_has_already_created",
                    lg
                )
            )
        }
        else {
            if (req.file) {
                deleteUploadedFile(req.file);
            }
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    "requirement_creation_not_allowed_yet",
                    lg
                )
            )
        }
    } catch (error) {
        // console.log('🚀 ~ create-new-requirement.js:68 ~ error:', error);
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
    hasPermissionToCreateRequirement
}