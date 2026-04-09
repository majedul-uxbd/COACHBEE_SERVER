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
const { getTeachersTableData } = require("../../main/teachers/teacher-table-data");
const { teachersDataValidator } = require("../../middleware/teacher/teacher-data-validator");
const { createNewTeacher } = require("../../main/teachers/create-new-teacher");
const { deleteTeacherData } = require("../../main/teachers/delete-teacher-data");
const { changeTeacherStatus } = require("../../main/teachers/change-teacher-status");
const { updateTeacherData } = require("../../main/teachers/update-teacher-data");
const teachersRouter = express.Router();

teachersRouter.use(authenticateToken);
teachersRouter.use(checkIsAdminActive);

/**
 * @description This is get student details route
 */
teachersRouter.post("/table-data",
    isUserRoleAdmin,
    paginationData,
    async (req, res) => {
        const authData = req.auth;
        const { lg, paginationData } = req.body;
        getTeachersTableData(lg, authData, paginationData)
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
teachersRouter.post("/create",
    isUserRoleAdmin,
    teachersDataValidator,
    async (req, res) => {
        const authData = req.auth;
        const { lg, teacherData } = req.body;
        createNewTeacher(lg, authData, teacherData)
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
 * @description This route is used to delete teacher data
 */
teachersRouter.post("/delete",
    isUserRoleAdmin,
    async (req, res) => {
        const authData = req.auth;
        const { lg, id } = req.body;
        deleteTeacherData(lg, authData, id)
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
teachersRouter.post("/change-status",
    isUserRoleAdmin,
    async (req, res) => {
        const authData = req.auth;
        const { lg, id, statusCode } = req.body;
        changeTeacherStatus(lg, authData, id, statusCode)
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
teachersRouter.post("/update",
    isUserRoleAdmin,
    teachersDataValidator,
    async (req, res) => {
        const authData = req.auth;
        const { lg, teacherData } = req.body;
        updateTeacherData(lg, authData, teacherData)
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
    teachersRouter
}