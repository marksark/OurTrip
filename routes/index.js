const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//Root Route
router.get("/", function(req,res){
  res.render('landing')
});

//Register Route
router.get('/register', function(req,res){
  res.render('register');
});

//sign up route
router.post('/register', function(req,res){
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err,user){
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect('register');
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to my first app " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//show login form
router.get('/login', function(req,res){
  res.render('login');
});

router.post('/login', passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req,res){
});

//logout logic
router.get('/logout', function(req,res){
  req.logout();
  req.flash("success", "logged you out!");
  res.redirect("/campgrounds");
});

// router.get("*", function(req,res){
//   res.send("You took a wrong turn!");
// })

//Middleware
isLoggedIn = (req,res,next) => {
  if (req.isAuthenticated()){
    return next();
  } res.redirect('/login');
}

module.exports = router;
