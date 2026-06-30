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
const { updateStudentsPayment } = require('../../main/payroll/update-student-payment');
const { getTeachersPaymentInfoData } = require('../../main/payroll/get-teacher-payment-data');
const { teachersSalaryDataValidator } = require('../../middleware/payroll/teacher-salary-data-validator');
const { updateTeachersSalary } = require('../../main/payroll/update-teacher-payment');
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
 * HINTS: Not Implemented in front-end 
 * @description This is create student payments route
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


/**
 * @description This is update student payments route
 */
payrollRouter.post("/update-student-payment",
    isUserRoleAdmin,
    studentPaymentDataValidator,
    async (req, res) => {
        const authData = req.auth;
        const { lg, paymentData } = req.body;
        updateStudentsPayment(lg, authData, paymentData)
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
 * @description This is get teacher salary details route
 */
payrollRouter.post("/teacher-salary",
    isUserRoleAdmin,
    paginationData,
    async (req, res) => {
        const authData = req.auth;
        const { lg, paginationData, filterData } = req.body;
        getTeachersPaymentInfoData(lg, authData, paginationData, filterData)
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
 * @description This is update teachers salary route
 */
payrollRouter.post("/update-teachers-salary",
    isUserRoleAdmin,
    teachersSalaryDataValidator,
    async (req, res) => {
        const authData = req.auth;
        const { lg, salaryData } = req.body;
        updateTeachersSalary(lg, authData, salaryData)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    data: data.result
                })
            })
            .catch(error => {
                // console.log("🚀 ~ error:", error)
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