/**
 * @author Md Majedul Islam 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Md. Majedul Islam
 * 
 * @description 
 * 
 */

const express = require("express");
const { paginationData } = require("../../middleware/pagination-data");
const { getStudentTableData } = require("../../main/students/student-table-data");
const { createNewStudent } = require("../../main/students/create-new-student");
const { studentDataValidator } = require("../../middleware/student/student-data-validator");
const { authenticateToken } = require("../../middleware/jwt");
const { isUserRoleAdmin } = require("../../middleware/check-user-role");
const { checkIsAdminActive } = require("../../restrictions/check-is-admin-active");
const { deleteStudentData } = require("../../main/students/delete-student-data");
const { changeStudentStatus } = require("../../main/students/inactive-student-data");
const { updateStudentData } = require("../../main/students/update-student-data");
const { getStudentTotalPayableAmount } = require("../../main/students/get-student-total-payable-amount");
const studentRoute = express.Router();

studentRoute.use(authenticateToken);
studentRoute.use(checkIsAdminActive);

/**
 * @description This is get student details route
 */
studentRoute.post("/table-data",
    isUserRoleAdmin,
    paginationData,
    async (req, res) => {
        const authData = req.auth;
        const { lg, paginationData } = req.body;
        getStudentTableData(lg, authData, paginationData)
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
 * @description This route is used to create new student
 */
studentRoute.post("/create",
    isUserRoleAdmin,
    studentDataValidator,
    async (req, res) => {
        const authData = req.auth;
        const { lg, studentData } = req.body;
        createNewStudent(lg, authData, studentData)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message
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
 * @description This route is used to delete student
 */
studentRoute.post("/delete",
    isUserRoleAdmin,
    async (req, res) => {
        const authData = req.auth;
        const { lg, id } = req.body;
        deleteStudentData(lg, authData, id)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message
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
 * @description This route is used to change student status
 */
studentRoute.post("/change-status",
    isUserRoleAdmin,
    async (req, res) => {
        const authData = req.auth;
        const { lg, id, statusCode } = req.body;
        changeStudentStatus(lg, authData, id, statusCode)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message
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
 * @description This route is used to update student
 */
studentRoute.post("/update",
    isUserRoleAdmin,
    studentDataValidator,
    async (req, res) => {
        const authData = req.auth;
        const { lg, studentData } = req.body;
        updateStudentData(lg, authData, studentData)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message
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
 * @description This is get student total payable amount route
 */
studentRoute.post("/total-payable-amount",
    async (req, res) => {
        const { lg, studentId } = req.body;
        const authData = req.auth;
        getStudentTotalPayableAmount(lg, studentId, authData)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    totalPayableAmount: data.result
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
    studentRoute
}