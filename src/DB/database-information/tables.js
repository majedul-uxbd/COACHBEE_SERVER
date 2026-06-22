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


/**
 * @description This module defines the database table names used in the application.
 */
const TABLES = Object.freeze({
    TBL_USERS: 'tbl_users',
    TBL_STUDENTS: 'tbl_students',
    TBL_TEACHERS: 'tbl_teachers',
    TBL_ATTENDANCE: 'tbl_attendance',
    TBL_STUDENT_PAYMENTS: 'tbl_student_payments',
    TBL_OTP_VERIFICATION: 'tbl_otp_verification',
    TBL_NOTIFICATIONS: 'tbl_notifications',
    TBL_TEACHER_SALARY: 'tbl_teacher_payments',
    TBL_CLASSES: 'tbl_classes',
    TBL_SUBJECTS: 'tbl_subjects',
});

module.exports = {
    TABLES
}