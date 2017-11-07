//routes/routes.js

module.exports = function(app, passport){

  //HomePage
  app.get('/', function(req,res){
    res.render('index.ejs');
  });

  //login
  app.get('/login', function(req,res){

    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  //Sign up:
  app.get('/signup', function(req, res){

    res.render('signup.ejs', {message: req.flash('signupMessage')});
  });

  //Home Section: (protected):
  app.get('/home', isLoggedIn, function(req, res){
    res.render('home.ejs', {
      user: req.user //get user out of template
    });
  });
  //LogOut:
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};
//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
      return next();

      //if not logged in, redirect to HomePage
    res.redirect('/')
}
