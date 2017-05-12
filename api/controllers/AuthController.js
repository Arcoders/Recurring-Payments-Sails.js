/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let passport = require('passport');

module.exports = {

	show: (req, res) => {
		res.view('auth/show');
	},

	destroy: (req, res) => {
		if(typeof req.session.passport != 'undefined') req.session.passport.user = null;
		res.redirect('/');
	},

	create: (req, res) => {
		passport.authenticate('local', (err, user, info) => {

			if (err || !user) return res.view('auth/show', {error: 'Error o usuario no existe'});

			req.login(user, err => {
				if (err) return res.view('auth/show', {error: 'Error en el servidor'});
				return res.view('homepage', {user: user});
			});

		})(req, res);
	}

};
