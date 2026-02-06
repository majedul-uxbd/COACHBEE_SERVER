require("dotenv").config({
    path: `${__dirname}/../.env`
});

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { authRoute } = require("./routes/auth/auth.route");
const { studentRoute } = require("./routes/students/students.route");

app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(cors());


app.use("/auth", authRoute);
app.use("/students", studentRoute);


// Middleware to parse JSON bodies
app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
        parameterLimit: 10000,
    })
);
app.use(express.json({ limit: "10mb" }));

const staticFilePath = path.join(__dirname, "/../uploads");
app.use("/uploads", express.static(staticFilePath));

// Start Server
const APP_PORT = process.env.APP_PORT;
app.listen(APP_PORT, () => {
    console.warn(
        `Application started and listening on http://localhost:${APP_PORT}`
    );
});