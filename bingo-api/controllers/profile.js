/*const mongoose = require('mongoose');
const User = mongoose.model('Users');

module.exports.profileRead = function (req, res) {
	// If no user ID exists in the JWT return a 401
	if (!req.payload._id) {
		res.status(401).json({
			"message": "UnauthorizedError: private profile"
		});
	} else {
		// Otherwise continue
		User
			.findById(req.payload._id)
			.exec(function (err, user) {
				res.status(200).json(user);
			});
	}
};

module.exports.setNewBalance = function (req, res) {
	if (!req.payload._id) {
		res.status(401).json({
			"message": "UnauthorizedError: unauthorized attempt to set balance"
		});
	} else {
		User.findOne({email: req.body.email}, function (err, user) {
			if (req.body.spending) {
				user.setBalance(user.balance - req.body.newSum);
			} else {
				user.setBalance(user.balance + req.body.newSum);
			}

			user.save(function (err, user) {
				res.status(200).json(user);
			});
		});
	}
};

module.exports.setWins = function (req, res) {
	if (!req.payload._id) {
		res.status(401).json({
			"message": "UnauthorizedError: unauthorized attempt to set wins"
		});
	} else {
		User.findOne({email: req.body.email}, function (err, user) {
			user.setWins(user.wins + req.body.wins);

			user.save(function (err, user) {
				res.status(200).json(user);
			});
		});
	}
};
*/

const mongoose = require('mongoose');
const User = mongoose.model('Users');

// Leer el perfil del usuario
module.exports.profileRead = async function (req, res) {
	try {
		// Si no hay un ID de usuario en el JWT, devolvemos un 401
		if (!req.payload._id) {
			return res.status(401).json({
				"message": "UnauthorizedError: private profile"
			});
		}

		// Buscar el usuario por ID
		const user = await User.findById(req.payload._id).exec();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Actualizar el saldo del usuario
module.exports.setNewBalance = async function (req, res) {
	try {
		// Validar autenticación
		if (!req.payload._id) {
			return res.status(401).json({
				"message": "UnauthorizedError: unauthorized attempt to set balance"
			});
		}

		// Buscar el usuario por email
		const user = await User.findOne({ email: req.body.email }).exec();
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Ajustar el saldo según el tipo de operación
		if (req.body.spending) {
			user.setBalance(user.balance - req.body.newSum);
		} else {
			user.setBalance(user.balance + req.body.newSum);
		}

		// Guardar el usuario
		const updatedUser = await user.save();
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Actualizar las victorias del usuario
module.exports.setWins = async function (req, res) {
	try {
		// Validar autenticación
		if (!req.payload._id) {
			return res.status(401).json({
				"message": "UnauthorizedError: unauthorized attempt to set wins"
			});
		}

		// Buscar el usuario por email
		const user = await User.findOne({ email: req.body.email }).exec();
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Ajustar el número de victorias
		user.setWins(user.wins + req.body.wins);

		// Guardar el usuario
		const updatedUser = await user.save();
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
