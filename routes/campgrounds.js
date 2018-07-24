const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const middleware = require("../middleware/index.js");

// INDEX - Show all campgrounds
router.get("/", function(req,res){
  //shows user
  // console.log(req.user);
  //get campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      //render the campgrounds
      res.render('campgrounds/index', {campgrounds:allCampgrounds, currentUser:req.user});
    }
  })
});

// CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn, function (req,res){
  //get data from form, add to campgrounds array
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCampground = {name: name, price:price, image: image, description: description, author:author};
  // create a new campground and save it to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      //redirect back to campgrounds page.
      res.redirect("/campgrounds");
    }
  })
});

//NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req,res){
  //show the form that will send the data to the post route
  res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function (req,res){
  //find the campground with the provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      // console.log(foundCampground);
      //Render show template page with that item/info in it
      res.render("campgrounds/show", {campground:foundCampground});
    }
  });
});

//Show
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function (req,res){
  //find and update the correct campground
  //redirect to the show page!
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect("/campgrounds/"+ req.params.id);
    }
  });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/campgrounds");
    }
    req.flash("success","Campground Deleted");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
