const express               = require('express'),
      app                   = express(),
      bodyParser            = require('body-parser'),
      mongoose              = require("mongoose"),
      Campground            = require("./models/campground"),
      Comment               = require("./models/comment"),
      methodOverride        = require("method-override"),
      User                  = require('./models/user'),
      LocalStrategy         = require('passport-local'),
      passport              = require('passport'),
      passportLocalMongoose = require('passport-local-mongoose'),
      flash                 = require("connect-flash");

//Requiring Routes
const commentRoutes    = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes      = require("./routes/index");

// mongoose.connect("mongodb://localhost/yelp_camp_v13");
const databaseUri = "mongodb://mark:testing123@ds137246.mlab.com:37246/marksfirstdb";
mongoose.connect(databaseUri, { useNewUrlParser: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log("Database connection error: ${err.message}"));

// mongoose.connect("mongodb://mark:*Password*@ds137246.mlab.com:37246/marksfirstdb");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(flash());


//Passport Configuration
app.use(require("express-session")({
  secret: "Mark Sarkis",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//include routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000 , process.env.IP, () => {
  console.log("OurTrip Server has started");
});
