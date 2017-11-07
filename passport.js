var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var bycrypt = require('bcrypt');

var User = require('/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

//LOCAL SIGNUP
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',

},
  function(req, firstName, lastName, email, password, done){
    User.findOne({'local-email': 'email'}, function(err, user){
      if(err)
        return done(err);
      if(user){
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {

        if(req.body.password == req.body.confirmPassword)
        {
            //create the new user
            var newUser = new User(req.body);

            newUser.local.email = email;
            newUser.local.hash_password =bcrypt.hashSync(req.body.password, 12);
            newUser.local.firstName = firstName;
            newUser.local.lastName = lastName;

            newUser.save(function(err, user){
              if(err)
              {
                return res.status(400).send({message:err});
              }else{
                user.hash_password = undefined;
                return res.json(user);
              }
            }
          }
          else{
            var err = new Error('Password and confirmation Password must match');
            return  res.status(400).send({message:err})
          }

    });
  }));
  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email'
  },
  function(req, email, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' :  email }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          // if no user is found, return the message
          if (!user)
          res.status(401).json({ message: 'Authentication failed. User not found.' });

          else if (user) {
           if (!user.comparePassword(req.body.password)) {
             res.status(401).json({ message: 'Authentication failed. Wrong password.' });
           } else {
             return res.json({token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id}, 'RESTFULAPIs')});
           }
            else if (user) {
             if (!user.comparePassword(req.body.password)) {
               res.status(401).json({ message: 'Authentication failed. Wrong password.' });
             } else {
               return res.json({token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id}, 'RESTFULAPIs')});
             }
      });

  }));

};
