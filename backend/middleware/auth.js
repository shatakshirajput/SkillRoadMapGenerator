import passport from 'passport';

const authenticateJWT = passport.authenticate('jwt', { session: false });

export {
  authenticateJWT
};