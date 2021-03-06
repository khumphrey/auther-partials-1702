'use strict';

const router = require('express').Router();
const User = require('../users/user.model');
const HttpError = require('../../utils/HttpError');

// This marries the original auth code we wrote to Passport.
// An alternative would be to use the "local strategy" option with Passport.
 
// check currently-authenticated user, i.e. "who am I?"
router.get('/', function (req, res, next) {
  res.json(req.user);
});

// login, i.e. "you remember `me`, right?"
router.put('/', function(req, res, next) {
  const { email, password } = req.body;
  User.findOne({
      where: { email, password }
    })
    .then(user => {
      if (!user) {
        throw new HttpError(401);
      } else {
      	req.logIn(user, err => {
      		if (err) throw new HttpError(500, err.message);
	        res.json(user);
      	})
      }
    })
    .catch(next);
});
 
// signup, i.e. "let `me` introduce myself"
router.post('/', function (req, res, next) {
  const { email, password } = req.body;
  User.findOrCreate({
    where: { email },
    defaults: { password }
  })
  .spread((user, created) => {
    if (!created) {
      throw new HttpError(401);
    } else {
      req.logIn(user, err => {
      		if (err) throw new HttpError(500, err.message);
	        res.json(user);
      	})
    }
  });
});

// logout, i.e. "please just forget `me`"
router.delete('/', function (req, res, next) {
	req.logOut();
	// req.session.destroy(); // destroys entire session
  // delete req.session.userId; // deletes one item on session
  res.sendStatus(204);
});

module.exports = router;
