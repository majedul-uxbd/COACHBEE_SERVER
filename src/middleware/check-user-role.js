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

const { setServerResponse } = require("../common/set-server-response");
const { API_STATUS_CODE } = require("../consts/error-status");


const isUserRoleAdmin = async (req, res, next) => {
    const authData = req.auth;
    console.log('🚀 ------------------------------------------------🚀');
    console.log('🚀 ~ :18 ~ isUserRoleAdmin ~ authData:', authData);
    console.log('🚀 ------------------------------------------------🚀');
    const lgKey = req.body.lg;
    if (authData.role !== "admin") {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                "you_are_not_allowed_for_the_request",
                lgKey
            )
        );
    }
    next();
};


module.exports = {
    isUserRoleAdmin
}