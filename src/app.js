require("dotenv").config({
    path: `${__dirname}/../.env`
});

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cron = require('node-cron');

const { authRoute } = require("./routes/auth/auth.route");
const { studentRoute } = require("./routes/students/students.route");
const { teachersRouter } = require("./routes/teachers/teachers.route");
const { payrollRouter } = require("./routes/payroll/payroll.route");
const { commonRouter } = require("./routes/common/common.route");
const { testRouter } = require("./routes/test.route");
const { autoGenerateStudentPayment } = require("./utilities/auto-generate-student-payment");
const { autoGenerateTeacherPayment } = require("./utilities/auto-generate-teachers-payment");
const { attendanceRouter } = require("./routes/attendance/attendance.route");

app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(cors());


app.use("/auth", authRoute);
app.use("/attendance", attendanceRouter);
app.use("/teachers", teachersRouter);
app.use("/students", studentRoute);
app.use("/payroll", payrollRouter);
app.use("/common", commonRouter);
app.use("/test", testRouter);


// Middleware to parse JSON bodies
app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
        parameterLimit: 10000,
    })
);
app.use(express.json({ limit: "10mb" }));


/**
 * 1st day of every month at 12:00 AM, this job will run and generate payment records for 
 * all active students for the current month and year.
 */
cron.schedule('0 0 1 * *', async () => {
    try {
        console.log('Running monthly job...');
        await autoGenerateStudentPayment();
    } catch (error) {
        console.error('Error calling API:', error.message);
    }
});

/**
 * 1st day of every month at 12:00 AM, this job will run and generate payment records for 
 * all active teachers for the current month and year.
 */
cron.schedule('0 0 1 * *', async () => {
    try {
        console.log('Running monthly job...');
        await autoGenerateTeacherPayment();
    } catch (error) {
        console.error('Error calling API:', error.message);
    }
});

const staticFilePath = path.join(__dirname, "/../uploads");
app.use("/uploads", express.static(staticFilePath));

// Start Server
const APP_PORT = process.env.APP_PORT;
app.listen(APP_PORT, () => {
    console.warn(
        `Application started and listening on http://localhost:${APP_PORT}`
    );
});