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
const { isNameValid, isValidClass, isPhoneNumberValid, isAddressValid, isMonthlyFeesValid } = require("../../common/data-validator");
const { setServerResponse } = require("../../common/set-server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");


/**
 * @description This middleware is used to validate student data for create and update student information
 */
const studentDataValidator = async (req, res, next) => {
    const updateUrl = req.originalUrl === '/students/update';
    const lgKey = req.body.lg;

    const studentData = {
        id: req.body.id,
        fullName: req.body.fullName,
        class: JSON.stringify(req.body.class),
        guardianPhone: req.body.guardianPhone,
        address: req.body.address,
        monthly_fee: Number(req.body.monthly_fee)
    }

    if (updateUrl) {
        if (_.isNil(studentData.id) || !_.isNumber(studentData.id)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'student_id_is_required',
                    lgKey,
                )
            );
        }
    } else {
        delete studentData.id;
    }

    // Check if student name is provided
    if (updateUrl) {
        if (studentData.fullName) {
            const isValid = isNameValid(studentData.fullName);
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
        if (!studentData.fullName) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'student_name_is_required',
                    lgKey
                )
            );
        } else {
            const isValid = isNameValid(studentData.fullName);
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

    // Check if student class is provided
    // if (updateUrl) {
    //     if (studentData.class) {
    //         const isValid = isValidClass(studentData.class);
    //         if (isValid !== true) {
    //             return res.status(API_STATUS_CODE.BAD_REQUEST).send(
    //                 setServerResponse(
    //                     API_STATUS_CODE.BAD_REQUEST,
    //                     isValid,
    //                     lgKey
    //                 )
    //             );
    //         }
    //     }
    // } else {
    //     if (!studentData.class) {
    //         return res.status(API_STATUS_CODE.BAD_REQUEST).send(
    //             setServerResponse(
    //                 API_STATUS_CODE.BAD_REQUEST,
    //                 'student_name_is_required',
    //                 lgKey
    //             )
    //         );
    //     } else {
    //         const isValid = isValidClass(studentData.class);
    //         if (isValid !== true) {
    //             return res.status(API_STATUS_CODE.BAD_REQUEST).send(
    //                 setServerResponse(
    //                     API_STATUS_CODE.BAD_REQUEST,
    //                     isValid,
    //                     lgKey
    //                 )
    //             );
    //         }
    //     }
    // }

    // Check if phone is provided
    if (updateUrl) {
        if (studentData.guardianPhone) {
            const isValid = isPhoneNumberValid(studentData.guardianPhone);
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
        if (!studentData.guardianPhone) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'guardian_phone_no_is_required',
                    lgKey
                )
            );
        } else {
            const isValid = isPhoneNumberValid(studentData.guardianPhone);
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
        if (studentData.address) {
            const isValid = isAddressValid(studentData.address);
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
        if (!studentData.address) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'address_is_required',
                    lgKey
                )
            );
        } else {
            const isValid = isAddressValid(studentData.address);
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
    if (updateUrl) {
        if (studentData.monthly_fee) {
            const isValid = isMonthlyFeesValid(studentData.monthly_fee);
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
        if (!studentData.monthly_fee) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'monthly_fees_is_required',
                    lgKey
                )
            );
        } else {
            const isValid = isMonthlyFeesValid(studentData.monthly_fee);
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

    req.body.studentData = studentData;
    next();
}

module.exports = {
    studentDataValidator
}