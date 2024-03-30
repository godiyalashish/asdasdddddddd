const { request } = require("../app");
const Department = require("../models/Department");
const Employee = require("../models/Employee");

async function getAllDepartments(req, res){
    try{
        const departments = await Department.find();
        departments.filter(dep => dep.isDeleted)
        res.status(200).json({
            departments
        })
    }catch(e){
        res.status(500).json({message:"internal server error"})
    }
}

async function createDepartment(req, res){
    try {
        const {name, description} = req.body
    const department = await Department.create({
        name,
        description,
        isDeleted:false
    })
    res.status(200).json({message:"department created"})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
    
}

async function deleteDepartment(req, res){
    try {
        const {id} = req.params.id
    const dep = await Department.findById({id})

    if(dep){
        dep.isDeleted = true
        await dep.save()
        res.status(200).json({message:'Department deleted'})
    }
    return res.status(404).json({ message: 'Department not found' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
}

async function assignEmployeeToDepartment(req, res){
    try {
        const {emp_id, dep_id} = req.body
    const employee = await Employee.findById(emp_id)
    if(employee){
        const department = await Department.findById(dep_id);
        if(department){
            employee.department =   department._id
            await employee.save();
            res.status(200).json({message:`Assigned to ${department.name}`})
        }
    }
    return res.status(401).json({message:'Failed to assign site'})
    } catch (error) {
        res.status(500).json({
            message:"Internal server error"
        })
    }
    
}

async function updateDepartment (req, res){
    try {
        const {name, description} = req.body
        const {id} = req.params;
        const dep = await Department.findById(id)
        if(dep){
            dep.name = name
            dep.description = description
            await dep.save()
            return res.json({message:"updated"})
        }
        return res.status(400).json({message:"failed to update department"})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

module.exports = {getAllDepartments, createDepartment, deleteDepartment, assignEmployeeToDepartment, updateDepartment}