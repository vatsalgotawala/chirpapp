var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';

module.exports = function(app, passport){

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: {secure: false} }));

	passport.serializeUser(function(user, done) {
		if(user.active){
			token = jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn: '24h'});
		}
		else{
			token = 'inactive/error';
		}
		
  		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  	User.findById(id, function(err, user) {
	    	done(err, user);
	  	});
	});

	passport.use(new FacebookStrategy({
		    clientID: '258507181585825',
		    clientSecret: '4fafd845ae35f28b9ebd2672e1aaff03',
		    callbackURL: "https://mysterious-atoll-18702.herokuapp.com/auth/facebook/callback",
		    profileFields: ['id', 'displayName', 'photos', 'email']
	  	},
	  	function(accessToken, refreshToken, profile, done) {
	  		console.log(profile._json.email);
		    User.findOne({email: profile._json.email}).select('username active password email').exec(function(err,user){
		    	if(err) done(err);

		    	if(user && user != null){
		    		done(null, user);
		    	}
		    	else{
		    		done(err);
		    	}
		    });
	  	}	
	));

	passport.use(new GoogleStrategy({
	    clientID: '278685218011-q6ug1utlp1pltrm27ib2j967fh5o3tet.apps.googleusercontent.com',
	    clientSecret: 'AZqLarwqNNr6vmdlEE2-2F5S',
	    callbackURL: "https://mysterious-atoll-18702.herokuapp.com/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
            User.findOne({ email: profile.emails[0].value }).select('username active password email').exec(function(err, user) {
                if (err) done(err);

                if (user && user !== null) {
                    done(null, user);
                } else {
                    done(err);
                }
            });
        }
	));

	app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
        res.redirect('/google/' + token);
    });

	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req,res){
		res.redirect('/facebook/' + token);
	});

	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	return passport;
}