const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));

//connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "login_register",
  password: "Devendra#*123",
});

//login page route
app.get("/", (req, res) => {
  res.render("login.ejs");
});

//data  from login form is sent here to be processed
app.post("/login", (req, res) => {
  let userEmail = req.body.email;
  let userPass = req.body.password;
  let query = `SELECT * FROM lr_db WHERE email='${userEmail}'`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      let password = result[0].password;
      if (userPass != password) {
        res.send(
          "You are not valid user! Please check your Email or Password."
        );
      } else {
        res.send("You are logged in...!");
      }
    });
  } catch (err) {
    res.send(err);
  }
});

//register page route
app.get(["/register", "/"], (req, res) => {
  res.render("register.ejs");
});

//data  from register form is sent here to be processed
app.post("/register", (req, res) => {
  let id = uuidv4();
  let { fullname, email, mobileno, age, password } = req.body;
  let registerData = [id, fullname, email, mobileno, age, password];
  let query =
    "INSERT INTO lr_db(id, fullname, email, mobileno, age, password) VALUES(?,?,?,?,?,?)";

  try {
    connection.query(query, registerData, (err, result) => {
      if (err) throw err;
      res.redirect("/");
    });
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Server  is running on http://localhost:${port}`);
});
