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
 * @description This middleware is used to validate teacher salary data for create and update teacher salary information
 * @returns 
 */
const teachersSalaryDataValidator = async (req, res, next) => {
    const updateUrl = req.originalUrl === '/payroll/update-teachers-salary';
    const lgKey = req.body.lg;

    const salaryData = {
        teacherId: Number(req.body.teacherId),
        month: req.body.month,
        year: req.body.year,
        bonus: Number(req.body.bonus),
        totalPayableAmount: Number(req.body.totalPayableAmount),
        paidAmount: Number(req.body.paidAmount),
        dueAmount: Number(req.body.dueAmount),
        paymentStatus: req.body.paymentStatus,
        notes: req.body.notes
    };

    if (_.isNil(salaryData.teacherId) || !_.isNumber(salaryData.teacherId)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'teacher_id_is_required',
                lgKey,
            )
        );
    }

    if (_.isNil(salaryData.month)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'month_is_required',
                lgKey,
            )
        );
    } else {
        const isValid = isMonthValid(salaryData.month);
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

    if (_.isNil(salaryData.year)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'year_is_required',
                lgKey,
            )
        );
    } else {
        const isValid = isYearValid(salaryData.year);
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

    if (!_.isNil(salaryData.bonus)) {
        if (!_.isNumber(salaryData.bonus)) {
            return res.status(API_STATUS_CODE.BAD_REQUEST).send(
                setServerResponse(
                    API_STATUS_CODE.BAD_REQUEST,
                    'invalid_bonus_amount',
                    lgKey,
                )
            );
        }
    }

    if (_.isNil(salaryData.totalPayableAmount) || !_.isNumber(salaryData.totalPayableAmount)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'valid_total_payable_amount_is_required',
                lgKey,
            )
        );
    }

    if (_.isNil(salaryData.paidAmount) || !_.isNumber(salaryData.paidAmount)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'valid_paid_amount_is_required',
                lgKey,
            )
        );
    }

    if (_.isNil(salaryData.dueAmount) || !_.isNumber(salaryData.dueAmount)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'valid_due_amount_is_required',
                lgKey,
            )
        );
    }

    if (_.isNil(salaryData.paymentStatus)) {
        return res.status(API_STATUS_CODE.BAD_REQUEST).send(
            setServerResponse(
                API_STATUS_CODE.BAD_REQUEST,
                'payment_status_is_required',
                lgKey,
            )
        );
    } else {
        const isValid = isPaymentStatusValid(salaryData.paymentStatus);
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

    req.body.salaryData = salaryData;
    // console.log("🚀 ~ teachersSalaryDataValidator ~ body.salaryData:", salaryData)
    next();
};


module.exports = {
    teachersSalaryDataValidator
};