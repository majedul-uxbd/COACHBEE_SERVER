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

const { isNameValid, isPasswordValid, isEmailValid, isCoachingNameValid, isPlanValid } = require("../../common/data-validator");
const { setServerResponse } = require("../../common/set-server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");
const _ = require('lodash');



const adminDataValidator = (req, res, next) => {
    const lgKey = "en";
    const userData = {
        fullName: req.body.fullName,
        coachingName: req.body.coachingName,
        email: req.body.email,
        password: req.body.password,
        plan: req.body.plan
    }

    // Check if fullName is provided
    if (!_.isEmpty(userData.fullName)) {
        const isValid = isNameValid(userData.fullName);
        if (!isValid) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    isValid,
                    lgKey
                ));
        }
    } else {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'full_name_is_required',
                lgKey
            ));
    }

    // Check if coachingName is provided
    if (!_.isEmpty(userData.coachingName)) {
        const isValid = isCoachingNameValid(userData.coachingName);
        if (!isValid) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    isValid,
                    lgKey
                ));
        }
    } else {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'coaching_name_is_required',
                lgKey
            ));
    }

    // Check if email is provided
    if (!_.isEmpty(userData.email)) {
        const isValid = isEmailValid(userData.email);
        if (!isValid) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    isValid,
                    lgKey
                ));
        }
    } else {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'email_is_required',
                lgKey
            ));
    }

    // Check if password is provided
    if (!_.isEmpty(userData.password)) {
        const isValid = isPasswordValid(userData.password);
        if (!isValid) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    isValid,
                    lgKey
                ));
        }
    } else {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'password_is_required',
                lgKey
            ));
    }

    // Check if plan is provided
    if (!_.isEmpty(userData.plan)) {
        const isValid = isPlanValid(userData.plan);
        if (isValid !== true) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    isValid,
                    lgKey
                ));
        }
    } else {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'plan_is_required',
                lgKey
            ));
    }

    req.body.userData = userData;
    next();
}

module.exports = {
    adminDataValidator
}