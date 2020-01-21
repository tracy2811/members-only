const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function (id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	passport.use(
		new LocalStrategy(function (username, password, done) {
			User.findOne({ username: username, }, function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { msg: 'Incorrect username' },);
				}
				bcrypt.compare(password, user.password, function (err, res) {
					if (res) {
						return done(null, user);
					} else {
						return done(null, false, { msg: 'Incorrect passpword', });
					}
				});
			});
		}),
	);
}

