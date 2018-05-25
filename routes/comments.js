var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

// New Comment
router.get("/new", middleware.isLoggedIn, function(req,res){
  // find campground by ID
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
  //render it in comments/new
});

//Create Comments
router.post("/", middleware.isLoggedIn, function(req,res){
  //look campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      //create new comments
      Comment.create(req.body.comment, function(err, comment){
        //add username+id to comment before we push
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        //save comment
        //connect new comment to campground
        campground.comments.push(comment);
        campground.save();
        console.log(comment);
        req.flash("success", "Successfully added comment");
        //redirect to campground showpage
        res.redirect("/campgrounds/" + campground._id);
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

//Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
      res.redirect("back");
    }  res.redirect("/campgrounds/" + req.params.id);
  });
});

module.exports = router;
