// Import models
const User = require('../models/user');

// Import express-validator
const validator = require('express-validator');

const bcrypt = require('bcryptjs');

const getOneByUsername = function (username) {
	User.findOne({username, }).exec(function (err, user) {
		return user;
	});
};

// Display login form
exports.getLogin = function (req, res, next) {
	res.render('login', { title: 'Log in', });
};

// Display register form
exports.getRegister = function (req, res, next) {
	res.render('userForm', { title: 'Register', types: User.schema.path('type').enumValues, });
};

// Handle register on POST
exports.postUser = [
	// Validate fields
	validator.body('firstName', 'First Name required').isLength({ min: 1, }).trim(),
	validator.body('lastName', 'Last Name required').isLength({ min: 1, }).trim(),
	validator.body('username', 'Invalid username').isLength({ min: 1, }).trim().custom(function (value) {
		return !getOneByUsername(value);
	}),
	validator.body('password', 'Password too short').isLength({ min: 6, }),
	validator.body('confirmPassword', 'Password not match').custom((value, { req }) => value === req.body.password),
	validator.body('type', 'Invalid user type').optional({ checkFalsy: true, }).custom(function (value, { req }) {
		const types = User.schema.path('type').enumValues;
		for (let i = 0; i < types.length; i++) {
			if (types[i] === value)
				return true;
		}
		return false;
	}),

	// Sanitization fields
	validator.sanitizeBody('firstName').escape(),
	validator.sanitizeBody('lastName').escape(),

	// Process request after validation and sanitization
	function (req, res, next) {
		const errors = validator.validationResult(req);

		const user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			username: req.body.username,
			password: req.body.password,
		});

		if (req.body.type) {
			user.type = req.body.type;
		}

		if (!errors.isEmpty()) {
			res.render('userForm', { title: 'Register', types: User.schema.path('type').enumValues, user, errors: errors.array()});
			return;
		}

		bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
			if (err) {
				return next(err);
			}
			user.password = hashedPassword;
			user.save(function (err) {
				if (err) {
					return next(err);
				}
				res.redirect('/login');
			});
		});
	},
];

