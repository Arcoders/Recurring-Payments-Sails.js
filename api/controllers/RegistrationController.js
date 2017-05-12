/**
 * RegistrationController
 *
 * @description :: Server-side logic for managing Registrations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	show: (req, res) => {
		res.view('registrations/show');
	},

	create: (req, res) => {
		User.findOne({email: req.body.email}).then(user => {
			if (user) return res.view('registrations/show', {error: 'Ya existe el correo'});
			return User.create({
				email: req.body.email,
				password: req.body.password
			}).then(user => {
				req.login(user, err => {
					if (err) return res.view('auth/show', {error: 'Error en el servidor'});
					return res.view('homepage', {user: user});
				});
			});
		}).catch(error => {
			return res.view('registrations/show', {error: 'Error en el servidor'});
		});
	}

};
