var express = require('express');
var router = express.Router();
var multer = require('multer');
var uploads = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{
    'title': 'Register' //Will make Register highlight
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{
    'title': 'Login' //Will make Login highlight
  });
});

router.post('/register', uploads.single('profileimage'), function(req,res,next){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;


  if(req.files && req.files.profileimage){
    console.log('Uploading File...');

    //File Info
    var profileImageOriginalName = req.files.profileimage.originalname;
    var profileImageName = req.files.profileimage.name;
    var profileImageMime = req.files.profileimage.mimetype;
    var profileImagePath = req.files.profileimage.path;
    var profileImageExt = req.files.profileimage.extension;
    var profileImageSize = req.files.profileimage.size;
  }else{
    var profileImageName = 'noImage.png';
  }

  //Form Validation
  req.checkBody('name','Name field is Required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email invalid').isEmail();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  //Check for errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  }else{
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImageName
    });

    //Create User
    User.createUser(newUser, function(err, user){
      if(err)throw err;
      console.log(user);
    });

    //Success Message
    req.flash('Success', 'You are now registered and may log in');

    res.location('/');
    res.redirect('/');
  }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
      User.getUserByUsername(username, function(err, user){
        if(err){
          throw err;
        }
        if(!user){
          console.log('Unknown User');
          return done(null,false, {message:'Unknown User'});
        }

        User.comparePassword(password,user.password, function(err,isMatch){
          if(err)throw err;
          if(isMatch){
            return done(null, user);
          }else{
            console.log('Invalid Password');
            return done(null,false,{message: 'Invalid Password'});
          }
        });
      });
    }
));

router.post('/login', passport.authenticate('local', {failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function (req, res) {
  console.log('Authentication Successful');
  req.flash('Success', 'You are Logged in');
  res.redirect('/');
});

module.exports = router;
