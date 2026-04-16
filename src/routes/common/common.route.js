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
const { getClassList } = require("../../main/common/get-class-list");
const { authenticateToken } = require("../../middleware/jwt");
const { getSubjectList } = require("../../main/common/get-subject-list");
const commonRouter = express.Router();

commonRouter.use(authenticateToken);

/**
 * @description This is get class list route
 */
commonRouter.post("/class-list",
    async (req, res) => {
        const { lg } = req.body;
        getClassList(lg)
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
 * @description This is get subject list route
 */
commonRouter.post("/subject-list",
    async (req, res) => {
        const { lg } = req.body;
        getSubjectList(lg)
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
    commonRouter
}