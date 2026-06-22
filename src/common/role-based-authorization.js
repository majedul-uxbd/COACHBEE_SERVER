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

const { API_STATUS_CODE } = require("../consts/error-status");
const { deleteUploadedFile } = require("../utilities/delete-uploaded-file");
const { setServerResponse } = require("./set-server-response");


const DEPARTMENT = Object.freeze({
    SALES: "sales",
    FINANCE: "finance",
    ENGINEER: "engineer"
});


/**
 *@description This middleware checks if the employee has an admin role or not.
 * If the employee is an admin, it allows the request to proceed to the next middleware
 */
const isEmployeeRoleAdmin = (req, res, next) => {
    const authData = req.auth;
    const lgKey = req.body.lg || 'en';

    if (authData.isAdmin === 1) {
        next();
    } else {
        return res.status(API_STATUS_CODE.NOT_ACCEPTABLE).send(
            setServerResponse(
                API_STATUS_CODE.NOT_ACCEPTABLE,
                'you_are_not_allowed_for_the_request',
                lgKey,
            )
        );
    }
};


/**
 *@description This middleware checks if the employee from sales department.
 * If the employee  from sales department, it allows the request to proceed to the next middleware
 */
const isEmployeeFromSalesDepartment = (req, res, next) => {
    const authData = req.auth;
    const lgKey = req.body.lg || 'en';

    if (authData.department === DEPARTMENT.SALES || authData.isAdmin === 1) {
        next();
    } else {
        return res.status(API_STATUS_CODE.NOT_ACCEPTABLE).send(
            setServerResponse(
                API_STATUS_CODE.NOT_ACCEPTABLE,
                'you_are_not_allowed_for_the_request',
                lgKey,
            )
        );
    }
};

/**
 *@description This middleware checks if the employee from finance department.
 * If the employee is an admin, it allows the request to proceed to the next middleware
 */
const isEmployeeFromFinanceDepartment = (req, res, next) => {
    const authData = req.auth;
    const lgKey = req.body.lg || 'en';

    if (authData.department === DEPARTMENT.FINANCE || authData.isAdmin === 1) {
        next();
    } else {
        return res.status(API_STATUS_CODE.NOT_ACCEPTABLE).send(
            setServerResponse(
                API_STATUS_CODE.NOT_ACCEPTABLE,
                'you_are_not_allowed_for_the_request',
                lgKey,
            )
        );
    }
};

/**
 *@description This middleware checks if the employee from engineer department.
 * If the employee is an admin, it allows the request to proceed to the next middleware
 */
const isEmployeeFromEngineerDepartment = (req, res, next) => {
    const authData = req.auth;
    const lgKey = req.body.lg || 'en';

    if (authData.department === DEPARTMENT.ENGINEER || authData.isAdmin === 1) {
        next();
    } else {
        if (req.file) {
            deleteUploadedFile(req.file);
        }
        return res.status(API_STATUS_CODE.NOT_ACCEPTABLE).send(
            setServerResponse(
                API_STATUS_CODE.NOT_ACCEPTABLE,
                'you_are_not_allowed_for_the_request',
                lgKey,
            )
        );
    }
};


module.exports = {
    isEmployeeRoleAdmin,
    isEmployeeFromSalesDepartment,
    isEmployeeFromFinanceDepartment,
    isEmployeeFromEngineerDepartment
}