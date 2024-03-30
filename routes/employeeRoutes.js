const express = require("express");
const router = express.Router();
const { updateEmployee, createEmployee, deleteEmployee, getAllEmployees, getEmployeeDetails, getOtherEmployeeDetails, getEmployeeSorted } = require("../controllers/EmployeeController");
const authenticateUser = require("../middleWare/authMiddleWare");
const isManager = require("../middleWare/isManager");

router.use(authenticateUser)

router.get("/details", getEmployeeDetails)

router.use(isManager)
router.post("/update/:id", updateEmployee)
router.post("/create/", createEmployee)
router.delete("/delete/:id", deleteEmployee)
router.get("/all", getAllEmployees)
router.get("/details/:id", getOtherEmployeeDetails)
router.get("/sort", getEmployeeSorted)

module.exports = router