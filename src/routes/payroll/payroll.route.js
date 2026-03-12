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



const express = require('express');
const { isUserRoleAdmin } = require('../../middleware/check-user-role');
const { paginationData } = require('../../middleware/pagination-data');
const { getTeachersPaymentInfoData } = require('../../main/payroll/get-payroll-table-data');
const { authenticateToken } = require('../../middleware/jwt');
const { checkIsAdminActive } = require('../../restrictions/check-is-admin-active');
const payrollRouter = express.Router();

payrollRouter.use(authenticateToken);
payrollRouter.use(checkIsAdminActive);

/**
 * @description This is get salary details route
 */
payrollRouter.post("/table-data",
    isUserRoleAdmin,
    paginationData,
    async (req, res) => {
        const authData = req.auth;
        const { lg, paginationData } = req.body;
        getTeachersPaymentInfoData(lg, authData, paginationData)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    data: data.result
                })
            })
            .catch(error => {
                return res.status(error.statusCode).send({
                    status: error.status,
                    message: error.message,
                })
            })
    }
);


module.exports = {
    payrollRouter
}