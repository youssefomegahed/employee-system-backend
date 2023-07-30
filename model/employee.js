const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const employeeSchema = new Schema({
  name: String,
  email: String,
  password: String,
  group: String,
  attendance: [
    {
      date: String,
      status: String,
    },
  ],
});

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
