const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const { z } = require("zod");


const updateSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
    location: z.string(),
    age: z.number().gte(18).lt(80),
    isManager: z.boolean(),
  });
const createEmployee = async (req, res) => {
    try {
      const { email, password, firstName, lastName, location, age, isManager } =
        signUpSchema.parse(req.body);
  
      const user = await Employee.findOne({ email });
      if (user) {
        res.status(400).json({ message: "user already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newEmployee = new Employee({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        location,
        age,
        isManager,
        isDeleted: false,
      });
  
      await newEmployee.save();
  
      res.json({ message: "User added successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Failed to create employee", errors: error.errors });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

const deleteEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const emp = await Employee.findById(id);
        if(emp){
            emp.isDeleted = true;
            await emp.save()
            return res.json({message:"Employee deleted"})
        }
        return res.json(400).json({message:"Failed to delete Employee"})
    } catch (error) {
        
    }
}

const updateEmployee = async(req, res) => {
    try {
        const {id} = req.params
    const {email,
        password,
        firstName,
        lastName,
        location,
        age,
        isManager} = updateSchema.parse(req.body)
    const employee = await Employee.findOneAndUpdate(id, req.body)
    return res.json({message:"Employee updated"})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
    

}

const getAllEmployees = async(req, res) => {
    try {
        const employees = await Employee.find({ isDeleted: { $ne: true } }).select('-password');
        res.json({data:employees})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}
const getOtherEmployeeDetails = async (req, res) => {
    try {
      const user = await Employee.findById(req.params.id);
      if(!user || user.isDeleted){
        return res.status(404).json({message:"employee not found"})
      }
      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        email: user.email,
        age: user.age,
        department:user.department
      });
    } catch (error) {
      return res.status(500).json({
        message: "internal server error",
      });
    }
  };

  const getEmployeeDetails = async (req, res) => {
    try {
      const user = await Employee.findById(req.user.userId);
      if(!user || user.isDeleted){
        return res.status(404).json({message:"employee not found"})
      }
      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        email: user.email,
        age: user.age,
        department:user.department
      });
    } catch (error) {
      return res.status(500).json({
        message: "internal server error",
      });
    }
  };

const getEmployeeSorted = async(req, res)=> {
    try{
        const {type, sort} = req.query
        if(type === "LOC"){
            if(sort === "ACS"){
                const data = await Employee.find({ isDeleted: { $ne: true } })
                .select('-password')
                .sort({ location: 1 })
                res.json(data);
            }else{
                const data = await Employee.find({ isDeleted: { $ne: true } })
                .select('-password')
                .sort({ location: -1 })
                res.json(data);
            }
        }else if(type === "NAME"){
            if(sort === "ACS"){
                const data = await Employee.find({ isDeleted: { $ne: true } })
                .select('-password')
                .sort({ name: 1 })
                res.json(data);
            }else{
                const data = await Employee.find({ isDeleted: { $ne: true } })
                .select('-password')
                .sort({ name: -1 })
                res.json(data);
            }
        }
        return res.json({message:"invalid Request"})
    }catch(err){
        return res.json({message:"Internal server error"})
    }
    
}

module.exports = {getEmployeeSorted, getEmployeeDetails,getAllEmployees, updateEmployee, deleteEmployee, createEmployee,getOtherEmployeeDetails}