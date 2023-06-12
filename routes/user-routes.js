const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const multer = require("multer");
// configure multer
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/images')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + '.png')
//     }
//   })

//   var upload = multer({ storage: storage })
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  },
});

// middleware to check if user is logged in

isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/users/login");
};
//  login user view form
router.get("/login", (req, res) => {
  res.render("user/login", {
    error: req.flash("error"),
  });
});

// login post request when you fill the form
router.post(
  "/login",
  passport.authenticate("local.login", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

// sign up form form
router.get("/signup", (req, res) => {
  res.render("user/signup", {
    error: req.flash("error"),
  });
});

// sign up post request when you fill sign up request

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/signup",
    failureFlash: true,
  })
);

// profile
router.get("/profile", isAuthenticated, (req, res) => {
  res.render("user/profile", {
    success: req.flash("success"),
  });
});

//upload user avatar

// router.post('/uploadAvatar', upload.single('avatar'), (req,res)=> {

//     let newFields = {
//         avatar: req.file.filename
//     }
//     User.updateOne( {_id: req.user._id}, newFields, (err)=> {
//         if (!err) {
//             res.redirect('/users/profile')
//         }

//     } )
// })
router.post("/uploadAvatar", upload.single("avatar"), async (req, res) => {
  if (req.file) {
    // Access the uploaded image data
    const imageBuffer = req.file.buffer;

    // Convert the image buffer to a base64-encoded string
    const imageBase64 = imageBuffer.toString("base64");

    // Update the user document with the image data
    try {
      await User.updateOne({ _id: req.user._id }, { avatar: imageBase64 });

      res.redirect("/users/profile");
    } catch (err) {
      // Handle any error that occurs during the update
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(400).send("No image file was provided");
  }
});

// logout user

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
