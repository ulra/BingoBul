const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Admin = mongoose.model('Admins');

// Estrategia para inicio de sesión de usuarios
passport.use(
  'userLogin',
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try {
        // Buscar al usuario por correo
        const user = await User.findOne({ email: username });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        // Validar contraseña
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Password is wrong' });
        }

        return done(null, user); // Usuario autenticado correctamente
      } catch (err) {
        return done(err); // Error durante la búsqueda
      }
    }
  )
);

// Estrategia para inicio de sesión de administradores
passport.use(
  'adminLogin',
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try {
        // Buscar al administrador por correo
        const admin = await Admin.findOne({ email: username });

        if (!admin) {
          return done(null, false, { message: 'Admin not found' });
        }

        // Validar contraseña
        if (!admin.validPassword(password)) {
          return done(null, false, { message: 'Password is wrong' });
        }

        return done(null, admin); // Administrador autenticado correctamente
      } catch (err) {
        return done(err); // Error durante la búsqueda
      }
    }
  )
);
