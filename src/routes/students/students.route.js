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
const studentRoute = express.Router();

studentRoute.use(authenticateToken);

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
 * @description This is create new student route
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
 * @description This is delete new student route
 */
studentRoute.post("/delete",
    isUserRoleAdmin,
    async (req, res) => {
        const authData = req.auth;
        const { lg } = req.body;
        deleteStudentData(lg, authData)
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


module.exports = {
    studentRoute
}