const mongoose = require('mongoose');
const User = mongoose.model('Users');

module.exports.getPlayersData = async function (req, res) {
	try {
	  const allUsers = await User.find().exec();
	  res.status(200).json(allUsers);
	} catch (err) {
	  console.error('Error al obtener jugadores:', err);
	  res.status(500).json({ error: 'Error interno del servidor' });
	}
  };

  module.exports.createPlayer = async function (req, res) {
	try {
	  const { objPlayerData } = req.body;
  
	  // Validación de entrada
	  if (!objPlayerData || !objPlayerData.email || !objPlayerData.name) {
		return res.status(400).json({ error: 'Datos de jugador incompletos.' });
	  }
  
	  // Verificar si el jugador ya existe
	  const isExisted = await User.exists({ email: objPlayerData.email });
	  if (isExisted) {
		return res.status(409).json({ isExisted: true });
	  }
  
	  // Crear un nuevo jugador
	  const user = new User({
		name: objPlayerData.name,
		email: objPlayerData.email,
		balance: objPlayerData.balance,
		wins: objPlayerData.wins,
	  });
  
	  if (objPlayerData.password) {
		user.setPassword(objPlayerData.password);
	  }
  
	  await user.save();
	  const token = user.generateJwt();
	  res.status(201).json({ token });
	} catch (err) {
	  console.error('Error al crear jugador:', err);
	  res.status(500).json({ error: 'Error interno del servidor.' });
	}
  };
  

  module.exports.deletePlayer = async function (req, res) {
	try {
	  const { email } = req.body;
  
	  // Validación de entrada
	  if (!email) {
		return res.status(400).json({ error: 'Email es obligatorio.' });
	  }
  
	  const result = await User.deleteOne({ email }).exec();
	  if (result.deletedCount === 0) {
		return res.status(404).json({ message: 'Usuario no encontrado.' });
	  }
  
	  res.status(200).json({ message: 'Jugador eliminado con éxito.' });
	} catch (err) {
	  console.error('Error al eliminar jugador:', err);
	  res.status(500).json({ error: 'Error interno del servidor.' });
	}
  };
  

  module.exports.updatePlayerData = async function (req, res) {
	try {
	  const { objPlayerData } = req.body;
  
	  // Validación de entrada
	  if (!objPlayerData || !objPlayerData.email) {
		return res.status(400).json({ error: 'Email es obligatorio.' });
	  }
  
	  const user = await User.findOne({ email: objPlayerData.email }).exec();
	  if (!user) {
		return res.status(404).json({ message: 'Jugador no encontrado.' });
	  }
  
	  // Actualizar datos
	  user.name = objPlayerData.name || user.name;
	  user.email = objPlayerData.email || user.email;
	  user.setBalance(objPlayerData.balance || user.balance);
	  user.setWins(objPlayerData.wins || user.wins);
  
	  if (objPlayerData.password) {
		user.setPassword(objPlayerData.password);
	  }
  
	  const updatedUser = await user.save();
	  res.status(200).json(updatedUser);
	} catch (err) {
	  console.error('Error al actualizar jugador:', err);
	  res.status(500).json({ error: 'Error interno del servidor.' });
	}
  };
  
