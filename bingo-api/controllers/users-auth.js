const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('Users');

// Registro de usuario
module.exports.register = async function (req, res) {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userCount = await User.countDocuments({ email });
    if (userCount > 0) {
      return res.status(200).json({ isExisted: true });
    }

    // Crear un nuevo usuario
    const user = new User();
    user.name = name;
    user.email = email;
    user.setBalance(50);
    user.setWins(0);
    user.setPassword(password);

    // Guardar usuario y generar token
    await user.save();
    const token = user.generateJwt();

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
// Inicio de sesión
module.exports.login = function (req, res) {
  passport.authenticate('userLogin', function (err, user, info) {
    if (err) {
      console.error('Error en autenticación:', err);
      return res.status(404).json(err);
    }

    if (user) {
      const token = user.generateJwt();
      return res.status(200).json({ token });
    } else {
      return res.status(401).json(info);
    }
  })(req, res);
};
