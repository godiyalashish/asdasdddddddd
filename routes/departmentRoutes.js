const express = require("express");
const router = express.Router();
const { getAllDepartments, createDepartment, deleteDepartment, assignEmployeeToDepartment, updateDepartment } = require("../controllers/departmentController");
const authenticateUser = require("../middleWare/authMiddleWare");
const isManager = require("../middleWare/isManager");


router.use(authenticateUser)
router.use(isManager)


router.get("/all", getAllDepartments)
router.post("/create", createDepartment)
router.delete("/delete/:id", deleteDepartment)
router.post("/assign", assignEmployeeToDepartment)
router.post("/update", updateDepartment)

module.exports = router