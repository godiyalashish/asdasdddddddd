const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  firstName:{type:String, required:true},
  lastName:{type:String, required:true},
  location:{type:String, required:true},
  email:{type:String, required:true},
  age:{type:Number, required:true},
  isManager:{type:Boolean, required:true},
  isDeleted:{type:Boolean, required:true},
  password:{type:String, required:true},
  department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
})

const Employee = mongoose.model("Employee", employeeSchema)

module.exports = Employee