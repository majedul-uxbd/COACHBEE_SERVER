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
    TBL_EMPLOYEES: 'tbl_employees',
    TBL_PROJECTS: 'tbl_projects',
    TBL_CLIENTS: 'tbl_clients',
    TBL_PROJECT_REQUIREMENT_DETAILS: 'tbl_project_requirement_details',
    TBL_PROJECT_MEMBERS: 'tbl_project_members',
    TBL_PROJECT_ENG_REQUIREMENTS: 'tbl_project_eng_requirements',
    TBL_PROJECT_SALES_REQUIREMENTS: 'tbl_project_sales_requirements',
    TBL_PROJECT_FINANCE_DETAILS: 'tbl_project_finance_details',
    TBL_OTP_VERIFICATION: 'tbl_otp_verification',
    TBL_NOTIFICATIONS: 'tbl_notifications',
});

module.exports = {
    TABLES
}