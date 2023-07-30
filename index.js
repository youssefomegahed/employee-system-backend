const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const Employee = require("./model/employee");

mongoose.connect(
  "mongodb+srv://youssefm:6ENb1zVVmhJeyATf@employee-system.ocuwita.mongodb.net/?retryWrites=true&w=majority",
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

  console.log(email, password);

  try {
    const user = await Employee.findOne({ email }).exec();

    if (!user || user.group !== "HR" || user.password !== password) {
      return res.json(false);
    }

    return res.json(user);
  } catch (err) {
    console.error("Error verifying HR user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});