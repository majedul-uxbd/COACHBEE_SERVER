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

const _ = require('lodash');
const { isMonthValid, isYearValid, isPaymentStatusValid } = require("../../common/data-validator");
const { setServerResponse } = require("../../common/set-server-response");
const { API_STATUS_CODE } = require("../../consts/error-status");


/**
 * @description This middleware is used to validate student payment data for create and update student payment information
 * @returns 
 */
const studentPaymentDataValidator = async (req, res, next) => {
    const updateUrl = req.originalUrl === '/payroll/update-payments';
    const lgKey = req.body.lg;

    const paymentData = {
        studentId: Number(req.body.studentId),
        month: req.body.month,
        year: req.body.year,
        totalPayableAmount: Number(req.body.totalPayableAmount),
        paidAmount: Number(req.body.paidAmount),
        dueAmount: Number(req.body.dueAmount),
        paymentStatus: req.body.paymentStatus
    };

    if (_.isNil(paymentData.studentId) || !_.isNumber(paymentData.studentId)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'student_id_is_required',
                lgKey,
            )
        );
    }

    if (_.isNil(paymentData.month)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'month_is_required',
                lgKey,
            )
        );
    } else {
        const isValid = isMonthValid(paymentData.month);
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

    if (_.isNil(paymentData.year)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'year_is_required',
                lgKey,
            )
        );
    } else {
        const isValid = isYearValid(paymentData.year);
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

    if (_.isNil(paymentData.totalPayableAmount) || !_.isNumber(paymentData.totalPayableAmount)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'valid_total_payable_amount_is_required',
                lgKey,
            )
        );
    }

    if (_.isNil(paymentData.paidAmount) || !_.isNumber(paymentData.paidAmount)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'valid_paid_amount_is_required',
                lgKey,
            )
        );
    }

    if (_.isNil(paymentData.dueAmount) || !_.isNumber(paymentData.dueAmount)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'valid_due_amount_is_required',
                lgKey,
            )
        );
    }

    if (_.isNil(paymentData.paymentStatus)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'payment_status_is_required',
                lgKey,
            )
        );
    } else {
        const isValid = isPaymentStatusValid(paymentData.paymentStatus);
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

    req.body.paymentData = paymentData;
    next();
};


module.exports = {
    studentPaymentDataValidator
};