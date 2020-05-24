const router = require('express').Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const credentials = require('../config/nodemailerCredentials.js');
const uniqid = require('uniqid');
const saltRounds = 12;


router.post('/login', (req, res) => {
  const { username, password } = req.body;
  //console.log(username);
  // Validate the data
  if (username && password) {
    try {
      // Check if user exists in db
      User.query().where('username', username).select('username', 'password', 'activation_code').then(foundUser => {
        if (foundUser.length >= 1) {
          // Check if account is 'active'
          if (foundUser[0].activationCode != 'active') {
            return res.send({ response: 'Please activate your account to login!' });
          } else {
            // Account is 'active'
            // Check if passwords match
            try {
              bcrypt.compare(password, foundUser[0].password).then((result) => {
                if (result) {
                  // if passwords match, create session variables 
                  req.session.loggedin = true;
                  req.session.username = username;
                  res.redirect('/profile');
                } else {
                  return res.status(500).send({response: 'Incorrect password'});
                }
              });
            } catch (error) {
              return res.status(500).send({ response: 'Something went wrong with the DB' });
            }
          }
        } else {
          return res.status(400).send({ response: 'User does not exist!' });
        }
      });
    } catch (error) {
      return res.status(500).send({ response: 'Something went wrong with the DB' });
    }
  } else {
    return res.status(400).send({ response: 'Username or password missing' });
  }
});

router.post('/signup', (req, res) => {
  const { username, password, passwordRepeat, email } = req.body;
  console.log(username);
  console.log(password);
  console.log(passwordRepeat);
  console.log(email);

  const isPasswordTheSame = password === passwordRepeat;
  // validate data
  if (username && password && isPasswordTheSame) {
    // password and email validation
    if (password.length < 8) {
      return res.status(400).send({ response: 'Password must be 8 characters or longer' });
    } else {
      // check if user already exists in db
      try {
        User.query().where('username', username).select('username', 'password').then(foundUser => {
            // if exists, send response
            if (foundUser.length > 0) {
              return res.status(400).send({ response: 'User already exists!' });
            } else {
              // use nodemailer to send activation email
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: credentials.email,
                  pass: credentials.password,
                },
              });
              // generate a random unique id
              const activationCode = uniqid();
              // settings for email
              const activate_link =
                'http://localhost:3000/activate/' + activationCode;
              const mailOptions = {
                from: 'nodejskea@gmail.com',
                to: email,
                subject: 'Account Activation Required',
                text:
                  'Please click the following link to activate your account: ' +
                  activate_link,
                html:
                  '<p>Please click the following link to activate your account: <a href="' +
                  activate_link +
                  '">' +
                  activate_link +
                  '</a></p>'
              };
              // send confirmation email
              transporter.sendMail(mailOptions, (error, data) => {
                if (err) {
                  console.log('Error occurs');
                } else {
                  console.log('Email sent!');
                }
                //return res.status(400).send({ response: 'Please check your email to activate account!' });
              });
              // insert created account into db
              try {
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                  User.query().insert({ username, password: hashedPassword, email, activationCode }).then(createdUser => {
                    return res.send({ response: `The user ${createdUser.username} was created. Check your email to validate account` });
                  });
                });
              } catch (error) {
                return res.status(500).send({ response: 'Something went wrong with the DB' });
              }
            } 
          });
      } catch (error) {
        return res.status(500).send({ response: 'Something went wrong with the DB' });
      }
    }
  } else if (password && passwordRepeat && !isPasswordTheSame) {
    return res.status(400).send({ response: 'Passwords do not match. Fields: password and passwordRepeat' });
  } else {
    return res.status(400).send({ response: 'Username or password missing' });
  }
});

router.get('/activate/:activationCode', (req, res) => {
  // check if activation code matches the one in db
  const { activationCode } = req.params;
  try {
    User.query().where('activation_code', activationCode).select('activation_code').then(userFound => {
      if (userFound.length > 0) {
        // activation_code exists in db, update the activation_code to 'active'
        User.query().patch({ activationCode: 'active' }).then(updatedUser => {
          return res.status(400).send({ response: 'Account is active!' });
        });
        }
      });
  } catch (error) {
    return res.status(500).send({ response: 'Something went wrong with the DB' });
  } 
});

router.get('/logout', (req, res) => {
  // Destroy session data
  req.session.destroy();
  //Redirect to login page
  res.redirect('/');
});

module.exports = router;
