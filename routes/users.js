const router = require('express').Router();
const User = require('../models/User.js');
const fs = require('fs');
const profilePage = fs.readFileSync("./public/profile/profile.html", "utf8");
const navbarPage = fs.readFileSync("./public/navbar/navbar.html", "utf8");

router.get('/users', async (req, res) => {
    const allUsersWithElectives = await User.query().select('username').withGraphFetched('electives');
    return res.send({ response: allUsersWithElectives });
});

router.get('/setSessionValue', (req, res) => {
    console.log(req.session);
    req.session.loggedin = true;
    return res.send({ response: "OK " });
});

router.get('/getSessionValue', (req, res) => {
    return res.send({ response: "OK" });
})

router.get('/profile', (req, res) => {
    // check if user is logged in
    if (req.session.loggedin) {
        const { username } = req.session;
        User.query().findOne({ username }).then(userfound => {
           return  res.status(200).json(userfound);
        })
    } else {
        //return res.send({ response: 'Please login to view this page!' });
         //Redirect to login page
        return res.redirect('/');
    }
});

module.exports = router;