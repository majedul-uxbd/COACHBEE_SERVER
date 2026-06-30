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

const { format } = require("date-fns");
const { setServerResponse } = require("../../common/set-server-response");
const { TABLES } = require("../../DB/database-information/tables");
const { pool } = require("../../DB/db-pool");
const { API_STATUS_CODE } = require("../../consts/error-status");
const { TABLE_TEACHERS_COLUMNS_NAME } = require("../../DB/database-information/table-teachers-columns-name");
const { TABLE_TEACHER_PAYMENTS_COLUMNS_NAME } = require("../../DB/database-information/table-teacher-salary-columns-name");
const { sendMail } = require("../../utilities/send-mail");
const { generateRandomString } = require("../../utilities/generate-random-string");
const { FRONTEND_URL, USER_LOGIN } = require("../../consts/static-values.const");
const hashPassword = require('bcrypt');

const insertTeacherDataQuery = async (connection, authData, monthYear, teacherData) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_TEACHERS}
        (
            ${TABLE_TEACHERS_COLUMNS_NAME.UUID},
            ${TABLE_TEACHERS_COLUMNS_NAME.FULLNAME},
            ${TABLE_TEACHERS_COLUMNS_NAME.ROLE},
            ${TABLE_TEACHERS_COLUMNS_NAME.CLASS},
            ${TABLE_TEACHERS_COLUMNS_NAME.PHONE},
            ${TABLE_TEACHERS_COLUMNS_NAME.EMAIL},
            ${TABLE_TEACHERS_COLUMNS_NAME.ADDRESS},
            ${TABLE_TEACHERS_COLUMNS_NAME.STARTING_MONTH},
            ${TABLE_TEACHERS_COLUMNS_NAME.SALARY},
            ${TABLE_TEACHERS_COLUMNS_NAME.PASSWORD}
        )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const _values = [
        authData.uuid,
        teacherData.fullName,
        teacherData.role,
        JSON.stringify(teacherData.class),
        teacherData.phone,
        teacherData.email,
        teacherData.address,
        monthYear,
        teacherData.salary,
        teacherData.password
    ];
    try {
        const [result] = await connection.query(_query, _values);
        return result.insertId;
    } catch (error) {
        return Promise.reject(error);
    }
}


const insertTeacherDataInPaymentTableQuery = async (connection, teacherId, monthName, year, teacherSalary) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_TEACHER_SALARY}
        (
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TEACHERS_ID},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.MONTH},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.YEAR},
            ${TABLE_TEACHER_PAYMENTS_COLUMNS_NAME.TOTAL_PAYABLE_AMOUNT}
        )
    VALUES (?, ?, ?, ?);
    `;

    const _values = [
        teacherId,
        monthName,
        year,
        teacherSalary
    ];
    try {
        await connection.query(_query, _values);
    } catch (error) {
        return Promise.reject(error);
    }
}


/**
 * @param {string} lg 
 * @param {{ id: number, uuid: string, email: string }} authData 
 * @param {{
 * fullName:string,
 * class:string,
 * email:string,
 * phone:string,
 * address:string,
 * salary:number,
 * }} teacherData  
 * @description This function creates a new teacher record in the database using the provided teacher data. 
 * It returns a success message if the teacher is created successfully, or an error message 
 * if there is an issue during the creation process.
 */
const createNewTeacher = async (lg, authData, teacherData) => {
    const date = new Date();
    const role = "teacher";
    const monthName = format(date, 'MMMM');
    const year = format(date, 'yyyy');
    const monthYear = format(date, 'MMMM yyyy');
    const connection = await pool.getConnection();
    const password = await generateRandomString();
    const hashedPassword = await hashPassword.hash(password, 10);
    teacherData = { ...teacherData, role: role, password: hashedPassword };
    const loginUrl = `${FRONTEND_URL}/${USER_LOGIN}`;

    try {
        const teacherId = await insertTeacherDataQuery(connection, authData, monthYear, teacherData);
        await insertTeacherDataInPaymentTableQuery(connection, teacherId, monthName, year, teacherData.salary);
        await connection.commit();

        await sendMail(
            `Coaching Management System(CMS) <support@coachbee.com>`,
            teacherData.email,
            `Your Account Has Been Successfully Created`,
            `<!DOCTYPE html>
            <html>
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CRM Account Update Notification</title>
            </head>

            <body style="margin:0; padding:0; background-color:#0f172a; font-family: 'Helvetica Neue', Arial, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a; padding:40px 0;">
                <tr>
                <td align="center">

                    <table width="600" cellpadding="0" cellspacing="0"
                    style="background-color:#1e293b; border-radius:14px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.5);">

                    <!-- Top accent bar -->
                    <tr>
                        <td style="height:4px; background: linear-gradient(90deg, #6366f1, #38bdf8, #34d399);"></td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td style="padding:40px 48px 32px 48px; text-align:center;">

                        <!-- Icon badge -->
                        <div style="display:inline-block; background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); border-radius:50%; width:56px; height:56px; line-height:56px; text-align:center; margin-bottom:20px;">
                            <span style="font-size:24px;">🔐</span>
                        </div>

                        <h1 style="margin:0 0 8px 0; font-size:22px; font-weight:700; color:#f1f5f9; letter-spacing:-0.3px;">
                            Your Account Has Been Successfully Created
                        </h1>
                        <p style="margin:0; font-size:13px; color:#64748b; letter-spacing:0.4px; text-transform:uppercase;">
                            CMS System Notification
                        </p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding:0 48px;">
                        <div style="height:1px; background:linear-gradient(90deg, transparent, #334155, transparent);"></div>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:32px 48px;">

                        <p style="font-size:15px; color:#cbd5e1; margin:0 0 6px 0;">
                            Hello, <strong style="color:#f1f5f9;">${teacherData.fullName}</strong>
                        </p>
                        <p style="font-size:14px; color:#94a3b8; line-height:1.75; margin:0 0 28px 0;">
                            Your CMS account details have been successfully updated. Below are your current login credentials. Please use them to sign in and verify your information.
                        </p>

                        <!-- Credentials Card -->
                        <div style="background:#0f172a; border:1px solid #334155; border-radius:10px; overflow:hidden; margin-bottom:28px;">

                            <!-- Card Header -->
                            <div style="padding:12px 20px; background:rgba(99,102,241,0.1); border-bottom:1px solid #334155;">
                            <p style="margin:0; font-size:11px; font-weight:700; color:#818cf8; text-transform:uppercase; letter-spacing:0.8px;">
                                Your Login Credentials
                            </p>
                            </div>

                            <!-- Email Row -->
                            <div style="display:flex; padding:16px 20px; border-bottom:1px solid #1e293b;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                <td style="width:110px; vertical-align:middle;">
                                    <span style="font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">Email</span>
                                </td>
                                <td style="vertical-align:middle;">
                                    <span style="font-size:14px; color:#e2e8f0; font-weight:500;">${teacherData.email}</span>
                                </td>
                                </tr>
                            </table>
                            </div>

                            <!-- Password Row -->
                            <div style="padding:16px 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                <td style="width:110px; vertical-align:middle;">
                                    <span style="font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">Password</span>
                                </td>
                                <td style="vertical-align:middle;">
                                    <span style="font-size:14px; color:#e2e8f0; font-family:monospace; background:#1e293b; padding:4px 10px; border-radius:4px; border:1px solid #334155; letter-spacing:1px;">${password}</span>
                                </td>
                                </tr>
                            </table>
                            </div>

                        </div>

                        <!-- Security Alert -->
                        <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-left:4px solid #ef4444; border-radius:8px; padding:18px 20px; margin-bottom:28px;">
                            <p style="margin:0 0 6px 0; font-size:12px; font-weight:700; color:#fca5a5; text-transform:uppercase; letter-spacing:0.6px;">
                            🔒 Security Notice
                            </p>
                            <p style="margin:0; font-size:13px; color:#fca5a5; line-height:1.65;">
                            For your security, please <strong>change your password immediately</strong> after logging in.
                            Your current password is temporary. Using a unique, strong password protects your account from unauthorized access.
                            </p>
                        </div>

                        <!-- CTA Button -->
                        <div style="text-align:center; margin:8px 0 32px 0;">
                            <a href="${loginUrl}"
                            style="display:inline-block; padding:14px 40px; background:linear-gradient(135deg, #6366f1, #4f46e5); color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; border-radius:8px; letter-spacing:0.3px; box-shadow:0 4px 20px rgba(99,102,241,0.4);">
                            Login to CMS &rarr;
                            </a>
                        </div>

                        <!-- Support -->
                        <p style="font-size:13px; color:#64748b; line-height:1.7; margin:0; text-align:center;">
                            Need help? Reach our support team at
                            <a href="mailto:support@uxd.co.jp" style="color:#818cf8; text-decoration:none; font-weight:500;">support@uxd.co.jp</a>
                        </p>

                        </td>
                    </tr>

                    <!-- Bottom accent bar -->
                    <tr>
                        <td style="padding:0 48px;">
                        <div style="height:1px; background:linear-gradient(90deg, transparent, #334155, transparent);"></div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:24px 48px; text-align:center;">
                        <p style="margin:0 0 4px 0; font-size:13px; color:#475569;">
                            Sincerely, <strong style="color:#94a3b8;">CRM Support Team</strong>
                        </p>
                        <p style="margin:0; font-size:11px; color:#334155;">
                            This is an automated message. Please do not reply directly to this email.
                        </p>
                        </td>
                    </tr>

                    <!-- Bottom accent bar -->
                    <tr>
                        <td style="height:4px; background: linear-gradient(90deg, #6366f1, #38bdf8, #34d399);"></td>
                    </tr>

                    </table>

                    <!-- Below card note -->
                    <p style="margin:20px 0 0 0; font-size:11px; color:#334155; text-align:center;">
                    &copy; 2025 UXD Co., Ltd. All rights reserved.
                    </p>

                </td>
                </tr>
            </table>

            </body>
            </html>`
        );

        return Promise.resolve(
            setServerResponse(
                API_STATUS_CODE.OK,
                'teacher_created_successfully',
                lg
            )
        );

    } catch (error) {
        // console.log('🚀 ~ :79 ~ createNewTeacher ~ error:', error);
        await connection.rollback();
        return Promise.reject(
            setServerResponse(
                API_STATUS_CODE.INTERNAL_SERVER_ERROR,
                'internal_server_error',
                lg
            )
        );
    }
}

module.exports = {
    createNewTeacher
}