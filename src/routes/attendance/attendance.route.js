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

const express = require("express");
const { insertAttendanceData } = require("../../main/attendance/insert-attendance-data");
const { attendanceDataValidator } = require("../../middleware/attendance/attendance-data-validator");
const { authenticateToken } = require("../../middleware/jwt");
const attendanceRouter = express.Router();

attendanceRouter.use(authenticateToken);

attendanceRouter.post("/mark-attendance",
    attendanceDataValidator,
    async (req, res) => {
        const authData = req.auth;
        const { lg, attendanceData } = req.body;
        insertAttendanceData(lg, attendanceData, authData)
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
    });

module.exports = {
    attendanceRouter
};
