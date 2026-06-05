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
const { API_STATUS_CODE } = require("../../consts/error-status");
const { setServerResponse } = require("../../common/set-server-response");
const { isDateValid, isAttendanceStatusValid } = require("../../common/data-validator");


const attendanceDataValidator = (req, res, next) => {
    const lgKey = req.body.lg;
    const attendanceData = {
        studentId: req.body.studentId,
        date: req.body.date,
        status: req.body.status
    }

    if (_.isNil(attendanceData.studentId)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'student_id_is_required',
                lgKey,
            )
        );
    } else {
        if (!_.isNumber(attendanceData.studentId)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'student_id_must_be_a_number',
                    lgKey,
                )
            );
        }
    }

    if (_.isEmpty(attendanceData.date)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'date_is_required',
                lgKey,
            )
        );
    } else {
        if (!_.isString(attendanceData.date)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'date_must_be_a_string',
                    lgKey,
                )
            );
        } else {
            const isValid = isDateValid(attendanceData.date);
            if (isValid !== true) {
                return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                    setServerResponse(
                        API_STATUS_CODE.BAD_REQUEST,
                        isValid,
                        lgKey,
                    )
                );
            }
        }
    }

    if (_.isEmpty(attendanceData.status)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'status_is_required',
                lgKey,
            )
        );
    } else {
        if (!_.isString(attendanceData.status)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'status_must_be_a_string',
                    lgKey,
                )
            );
        } else {
            const isValid = isAttendanceStatusValid(attendanceData.status);
            if (isValid !== true) {
                return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                    setServerResponse(
                        API_STATUS_CODE.BAD_REQUEST,
                        isValid,
                        lgKey,
                    )
                );
            }
        }
    }

    req.body.attendanceData = attendanceData;
    // console.log("🚀 ~ attendanceDataValidator ~ attendanceData:", attendanceData);
    next();
}


module.exports = {
    attendanceDataValidator
}