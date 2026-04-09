/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 * 
 * @description 
 * 
 */


/**
 * @description This module defines the database table names used in the application.
 */
const TABLES = Object.freeze({
    TBL_USERS: 'tbl_users',
    TBL_STUDENTS: 'tbl_students',
    TBL_TEACHERS: 'tbl_teachers',
    TBL_attendance: 'tbl_attendance',
    TBL_PAYMENTS: 'tbl_payments',
    TBL_OTP_VERIFICATION: 'tbl_otp_verification',
    TBL_NOTIFICATIONS: 'tbl_notifications',
    TBL_TEACHER_PAYMENTS: 'tbl_teacher_payments',
    TBL_CLASSES: 'tbl_classes',
    TBL_SUBJECTS: 'tbl_subjects',
});

module.exports = {
    TABLES
}