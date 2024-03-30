const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../privates");
const Employee = require("../models/Employee");

const isManager = async (req, res, next) => {
  let token = req.header("Authorization");
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }
  token = token.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const employee = await Employee.findById(decoded.userId)
    if(employee.isManager){
        next();
    }
    else{
        res.status(400).json({message:"User not manager"})
    }
    
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isManager;