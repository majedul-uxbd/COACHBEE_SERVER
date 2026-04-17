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
const { autoGenerateStudentPayment } = require('../utilities/auto-generate-student-payment');
const testRouter = express.Router();


testRouter.post("/test",
    async (req, res) => {
        autoGenerateStudentPayment()
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
    testRouter
}