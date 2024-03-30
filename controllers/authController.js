const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../privates");
const { z } = require("zod");
const Employee = require("../models/Employee");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  location: z.string(),
  age: z.number().gte(18).lt(80),
  isManager: z.boolean(),
});

const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id}, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", errors: error.errors });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const signUp = async (req, res) => {
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

    res.json({ message: "User registered successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", errors: error.errors });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = { login, signUp };
