const express = require("express");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes")
const departmentRoutes = require("./routes/departmentRoutes")
const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/employee', employeeRoutes)
app.use('/department', departmentRoutes)


module.exports = app;
