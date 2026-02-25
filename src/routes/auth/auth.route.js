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
const { userLogin } = require("../../main/auth/user-login");
const { userLoginDataValidator } = require("../../middleware/auth/user-login-data-validator");
const { authenticateToken } = require("../../middleware/jwt");
const { getPersonalData } = require("../../main/auth/get-user-data");
const { createNewAdmin } = require("../../main/auth/create-new-admin");
const { adminDataValidator } = require("../../middleware/auth/admin-data-validator");
const authRoute = express.Router();


/**
 * @description This is used to user login
 */
authRoute.post("/login",
    userLoginDataValidator,
    async (req, res) => {
        userLogin(req.body.userData)
            .then(data => {
                return res.status(data.statusCode).send({
                    status: data.status,
                    message: data.message,
                    token: data.result.token,
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


/**
 * @description This is used to get user information
 */
authRoute.get("/get-user",
    authenticateToken,
    async (req, res) => {
        getPersonalData(req.auth)
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


/**
* @description This route is used to create new admin for different coaching center. Only super admin can create new admin.
*/
authRoute.post("/create-admin",
    // authenticateToken,
    adminDataValidator,
    async (req, res) => {
        const { lg, userData } = req.body;
        createNewAdmin(lg, userData)
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
    authRoute
};