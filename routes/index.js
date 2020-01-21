var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController');
var userController = require('../controllers/userController');

module.exports = function(passport) {
	router.use(function (req, res, next) {
		res.locals.currentUser = req.user;
		next();
	});

	router.get('/', messageController.getAllMessages);
	router.get('/message/new', messageController.getNewMessage);
	router.get('/login', userController.getLogin);
	router.get('/register', userController.getRegister);
	router.get('/logout', function (req, res, next) {
		req.logout();
		res.redirect('/');
	});

	router.post('/message/new', messageController.postMessage);
	router.post('/messages/:id', messageController.deleteMessage);
	router.post('/register', userController.postUser);
	router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/',
	}));

	return router;
}

