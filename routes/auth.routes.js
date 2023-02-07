const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { isLoggedIn } = require("../middleware/route-guard");
const router = express.Router();

// route to signup page
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});
//post route for signup form
router.post("/signup", async (req, res) => {
  //creates a copy of the user information
  const body = { ...req.body };

  //checks if the password has a certain length
  if (body.password.length < 6) {
    //renders back to signup route and show the error message
    res.render("auth/signup", {
      errorMessage: "Password too short",
      body: req.body,
    });
  } else {
    //creates salt
    const salt = bcrypt.genSaltSync(13);

    //creates password hash
    const passwordHash = bcrypt.hashSync(body.password, salt);

    //deletes the password for safety reasons
    delete body.password;
    //user password is now the password hash
    body.passwordHash = passwordHash;

    try {
      //creates user
      await User.create(body);
      res.send(body);
    } catch (error) {
      //catches error messages and returns back to signup page
      if (error.code === 11000) {
        console.log("Duplicate !");
        res.render("auth/signup", {
          errorMessage: "Username already used !",
          userData: req.body,
        });
      } else {
        res.render("auth/signup", {
          errorMessage: error,
          userData: req.body,
        });
      }
    }
  }
});

//creates route for login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

//post route for login form
router.post("/login", async (req, res) => {
  const body = req.body;

  try {
    //search for the username and returns an array with the username if username is valid
    const userMatch = await User.find({ username: body.username });
    // if user is found
    if (userMatch.length) {

      //user will always be index 0 because username is unique
      const user = userMatch[0];

      //compares the password hash with the orignial password
      if (bcrypt.compareSync(body.password, user.passwordHash)) {
        // Correct password

        //creates a copy of the username and email not password for security reasons
        const tempUser = {
          username: user.username,
          email: user.email,
        };

        //creates a session middleware with the username and email
        req.session.user = tempUser;
        res.redirect("/profile");
      } else {
        // Incorrect password
      }
    } else {
      // User not found
    }
  } catch (error) {
    console.log(error)
  }
});



module.exports = router;
