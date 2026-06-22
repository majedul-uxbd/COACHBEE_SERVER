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

const _ = require("lodash");
const { isNameValid, isValidClass, isPhoneNumberValid, isAddressValid, isMonthlyFeesValid, isClassStringValid } = require("../../common/data-validator");
const { setServerResponse } = require("../../common/set-server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");



const teachersDataValidator = async (req, res, next) => {
    const updateUrl = req.originalUrl === '/teachers/update';
    const lgKey = req.body.lg;

    const teacherData = {
        id: req.body.id,
        fullName: req.body.fullName,
        class: req.body.class,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        salary: Number(req.body.salary)
    }

    if (updateUrl) {
        if (_.isNil(teacherData.id) || !_.isNumber(teacherData.id)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'teacher_id_is_required',
                    lgKey,
                )
            );
        }
    } else {
        delete teacherData.id;
    }

    // Check if teacher name is provided
    if (updateUrl) {
        if (teacherData.fullName) {
            const isValid = isNameValid(teacherData.fullName);
            if (isValid !== true) {
                return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                    setServerResponse(
                        API_STATUS_CODE.BAD_REQUEST,
                        isValid,
                        lgKey
                    )
                );
            }
        }
    } else {
        if (!teacherData.fullName) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'teacher_name_is_required',
                    lgKey
                )
            );
        } else {
            const isValid = isNameValid(teacherData.fullName);
            if (isValid !== true) {
                return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                    setServerResponse(
                        API_STATUS_CODE.BAD_REQUEST,
                        isValid,
                        lgKey
                    )
                );
            }
        }
    }

    // Check if teacher class is provided
    // if (teacherData.class) {
    //     const isValid = isClassStringValid(teacherData.class);
    //     if (isValid !== true) {
    //         return res.status(API_STATUS_CODE.BAD_REQUEST).send(
    //             setServerResponse(
    //                 API_STATUS_CODE.BAD_REQUEST,
    //                 isValid,
    //                 lgKey
    //             )
    //         );
    //     }
    // }

    // Check if email is provided
    if (!_.isEmpty(teacherData.email)) {
        if (typeof teacherData.email !== 'string' || !teacherData.email.includes('@')) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'email_is_required',
                    lgKey
                ));
        }
    }


    // Check if phone is provided
    if (updateUrl) {
        if (teacherData.phone) {
            const isValid = isPhoneNumberValid(teacherData.phone);
            if (isValid !== true) {
                return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                    setServerResponse(
                        API_STATUS_CODE.BAD_REQUEST,
                        isValid,
                        lgKey
                    ));
            }
        }
    } else {
        if (!teacherData.phone) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'phone_no_is_required',
                    lgKey
                )
            );
        } else {
            const isValid = isPhoneNumberValid(teacherData.phone);
            if (isValid !== true) {
                return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                    setServerResponse(
                        API_STATUS_CODE.BAD_REQUEST,
                        isValid,
                        lgKey
                    ));
            }
        }
    }

    // Check if address is provided
    if (updateUrl) {
        if (teacherData.address) {
            const isValid = isAddressValid(teacherData.address);
            if (isValid !== true) {
                return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                    setServerResponse(
                        API_STATUS_CODE.BAD_REQUEST,
                        isValid,
                        lgKey
                    ));
            }
        }
    } else {
        if (!teacherData.address) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'address_is_required',
                    lgKey
                )
            );
        } else {
            const isValid = isAddressValid(teacherData.address);
            if (isValid !== true) {
                return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                    setServerResponse(
                        API_STATUS_CODE.BAD_REQUEST,
                        isValid,
                        lgKey
                    ));
            }
        }
    }

    // Check if monthly fees is provided
    if (teacherData.salary) {
        const isValid = isMonthlyFeesValid(teacherData.salary);
        if (isValid !== true) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    isValid,
                    lgKey
                ));
        }
    }

    req.body.teacherData = teacherData;
    next();
}

module.exports = {
    teachersDataValidator
}