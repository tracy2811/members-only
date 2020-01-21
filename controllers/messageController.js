// Import models
const Message = require('../models/message');
const User = require('../models/user');

// Import express-validator
const validator = require('express-validator');

// Display all messages on GET
exports.getAllMessages = function (req, res, next) {
	if (req.user && (req.user.type === 'member' || req.user.type === 'admin')) {
		Message
			.find()
			.populate('user')
			.exec(function (err, messages) {
				if (err) {
					return next(err);
				}
				res.render('index', { title: 'Members Only', messages, });
			});
	} else {
		Message
			.find({}, 'title body timestamp')
			.exec(function (err, messages) {
				if (err) {
					return next(err);
				}
				res.render('index', { title: 'Members Only', messages, });
			});
	}
};

// Display create message form on GET
exports.getNewMessage = function (req, res, next) {
	if (req.user) {
		res.render('messageForm', { title: 'Create New Message', });
	} else {
		const err = new Error('Login before trying posting message');
		err.status = 401;
		next(err);
	}
};

// Handle create message on POST
exports.postMessage = [
	function (req, res, next) {
		if (req.user) {
			next();
		} else {
			const err = new Error('Login before trying posting message');
			err.status = 401;
			next(err);
		}
	},

	// Validate fields
	validator.body('title', 'Title required').isLength({ min: 1, }).trim(),
	validator.body('body', 'Body required').isLength({ min: 1, }).trim(),

	// Sanitize fields
	validator.sanitizeBody('*').escape(),

	// Process request after validation and sanitization
	function (req, res, next) {
		// Extract validation errors
		const errors = validator.validationResult(req);

		// Create new message
		const message = new Message({
			title: req.body.title,
			body: req.body.body,
			user: req.user._id,
		});

		if (!errors.isEmpty()) {
			res.render('messageForm', { title: 'Create New Message', message, errors: errors.array(), });
		}

		message.save(function (err) {
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	},
];

// Handle delete message
exports.deleteMessage = function (req, res, next) {
	if (req.user && req.user.type === 'admin') {
		Message.findByIdAndDelete(req.params.id, function (err) {
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	} else {
		const err = new Error('Only admin can delete message');
		err.status = 401;
		next(err);
	}
};

