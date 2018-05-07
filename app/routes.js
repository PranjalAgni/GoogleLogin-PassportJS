const User = require('./models/user.js');
module.exports = function(app , passport) {
    app.get('/' , function(req , res) {
        res.render('index.ejs');    
    });

    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', { user: req.user });
	});

    app.get('/auth/google' , passport.authenticate('google' , {scope: ['profile' , 'email']}));

    app.get('/auth/google/callback' , passport.authenticate('google' , {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    
};

function isLoggedIn(req , res , next) {
    if(req.isAuthenticated()) {
        return  next();
    }
    res.redirect('/');
}