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
const studentRoute = express.Router();


/**
 * @description This is get employee details route
 */
studentRoute.post("/table-data",
    paginationData,
    async (req, res) => {
        const { lg, paginationData } = req.body;
        getStudentTableData(lg, paginationData)
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
    studentRoute
}