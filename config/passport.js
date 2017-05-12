let passport = require('passport');
let bcrypt = require('bcrypt-as-promised');
let LocalStrategy = require('passport-local').Strategy;

Promise = require('bluebird'); // jshint ignore:line

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userID, done) => {
    User.findOne({id: userID})
        .then(user => done(null, user))
        .catch(err => done(err, false));
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {

    let promiseFindUser = User.findOne({email: email});

    let promiseHashEquals = promiseFindUser.then(user => {
        if (!user) return false;
        return bcrypt.compare(password, user.password);
    });

    Promise.all([promiseFindUser, promiseHashEquals]).spread((user, pass) => {
        if (!user || !pass) return done(null, false, {message: 'Usuario o password incorrectos'});
        let returnUser = {
            email: user.email,
            id: user.id,
            createdAt: user.createdAt
        };
        return done(null, returnUser, {message: 'Bienvenido'});
    }).catch(err => done(err, false, {message: 'Error en el servidor'}));

}));
