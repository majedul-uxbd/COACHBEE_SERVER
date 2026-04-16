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
const { getStudentsPaymentInfoData } = require('../../main/payroll/get-student-payment-data');
const { authenticateToken } = require('../../middleware/jwt');
const { checkIsAdminActive } = require('../../restrictions/check-is-admin-active');
const { createStudentsPayment } = require('../../main/payroll/create-student-payment');
const { studentPaymentDataValidator } = require('../../middleware/payroll/student-payment-data-validator');
const payrollRouter = express.Router();

payrollRouter.use(authenticateToken);
payrollRouter.use(checkIsAdminActive);

/**
 * @description This is get student payments details route
 */
payrollRouter.post("/student-payments",
    isUserRoleAdmin,
    paginationData,
    async (req, res) => {
        const authData = req.auth;
        const { lg, paginationData, filterData } = req.body;
        getStudentsPaymentInfoData(lg, authData, paginationData, filterData)
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


/**
 * @description This is get salary details route
 */
payrollRouter.post("/create-student-payments",
    isUserRoleAdmin,
    studentPaymentDataValidator,
    async (req, res) => {
        const authData = req.auth;
        const { lg, paymentData } = req.body;
        createStudentsPayment(lg, authData, paymentData)
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