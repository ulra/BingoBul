const passport = require('passport');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admins');

// Registro de administrador
module.exports.register = async function (req, res) {
  try {
    const { name, email, password } = req.body;

    // Validación de entrada
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // Verificar si el administrador ya existe
    const isExisted = await Admin.exists({ email });
    if (isExisted) {
      return res.status(409).json({ isExisted: true });
    }

    // Crear un nuevo administrador
    const admin = new Admin({ name, email });
    admin.setPassword(password);
    await admin.save();

    // Generar token
    const token = admin.generateJwt();
    return res.status(201).json({ token });
  } catch (err) {
    console.error("Error al registrar administrador:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};


// Inicio de sesión como administrador
module.exports.loginAdmin = async function (req, res) {
	const { email, password } = req.body;
  
	// Validación de entrada
	if (!email || !password) {
	  return res.status(400).json({ error: "El correo y la contraseña son obligatorios." });
	}
  
	passport.authenticate("adminLogin", function (err, admin, info) {
	  if (err) {
		console.error("Error durante autenticación:", err);
		return res.status(500).json({ error: "Error interno del servidor." });
	  }
  
	  if (!admin) {
		return res.status(401).json({ error: info ? info.message : "Autenticación fallida." });
	  }
  
	  // Generar token y responder
	  const token = admin.generateJwt();
	  return res.status(200).json({ token });
	})(req, res);
  };
  