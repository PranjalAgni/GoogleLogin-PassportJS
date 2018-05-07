const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const configAuth = require('./auth');
const User = require('../app/models/user.js');
module.exports = function(passport) {

    passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});




    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    }, function(accessToken , refreshToken , profile , done) {
                process.nextTick(function() {
                    User.findOne({'google.id' : profile.id} , function(err , user) {
                        if (user) {
                            return done(null , err);
                        }

                       else if (err) {
                        return done(err);
                        }

                        else {
                            var newUser = new User();
                            newUser.google.id = profile.id,
                            newUser.google.token = accessToken;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value;

                            newUser.save(function(err) {
                                if(err) {
                                    console.log('Error from passport.js: 43');
                                    throw err;
                                }
                                return done(null , newUser);
                            });

                            console.log(profile);
                        }
                    });
                });
    }));
}
