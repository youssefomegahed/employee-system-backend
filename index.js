const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const Employee = require("./model/employee");

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "employee-system",
  },

  (err) => {
    if (err) {
      console.error("Error connecting to employee-system database:", err);
    } else {
      console.log("Connected to employee-system database");
    }
  }
);

/* APIs */
app.post("/verifyHRUser", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await Employee.findOne({ email }).exec();

    if (
      !user ||
      user.group.toLowerCase() !== "hr" ||
      user.password !== password
    ) {
      return res.json(false);
    }

    return res.json(user);
  } catch (err) {
    console.error("Error verifying HR user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getEmployees", async (req, res) => {
  try {
    const employees = await Employee.find({}).exec();
    return res.json(employees);
  } catch (err) {
    console.error("Error getting employees:", err);
    return res.json(false);
  }
});

app.post("/addEmployee", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const group = req.body.group;
  const attendance = [];

  // verifying email is unique
  const userExists = await Employee.findOne({ email }).exec();

  if (userExists) {
    return res.json(false);
  }

  try {
    const employee = new Employee({
      name,
      email,
      password,
      group,
      attendance,
    });

    await employee.save();

    return res.json(employee);
  } catch (err) {
    console.error("Error adding employee:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/updateEmployees", async (req, res) => {
  const employees = req.body.employees;

  try {
    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      const employeeId = employee._id;
      const name = employee.name;
      const email = employee.email;
      const password = employee.password;
      const group = employee.group;
      const attendance = employee.attendance;

      await Employee.findByIdAndUpdate(employeeId, {
        name,
        email,
        password,
        group,
        attendance,
      });
    }
  } catch (err) {
    console.error("Error updating employees:", err);
    return res.json(false);
  }
});

app.post("/deleteEmployee", async (req, res) => {
  const employeeId = req.body.employeeId;

  try {
    await Employee.findByIdAndDelete(employeeId);
    return res.json(true);
  } catch (err) {
    console.error("Error deleting employee:", err);
    return res.json(false);
  }
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
