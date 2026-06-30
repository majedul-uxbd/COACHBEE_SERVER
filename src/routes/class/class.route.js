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
const { authenticateToken } = require("../../middleware/jwt");
const { createClassName } = require("../../main/class/create-class-name");
const { deleteClassName } = require("../../main/class/delete-class-name");
const classRouter = express.Router();


classRouter.use(authenticateToken);

classRouter.post("/create",
    async (req, res) => {
        const { lg, className } = req.body;
        createClassName(lg, className)
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
    });


classRouter.post("/delete",
    async (req, res) => {
        const { lg, id } = req.body;
        deleteClassName(lg, id)
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
    });

module.exports = {
    classRouter
}