const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

const navbarPage = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footerPage = fs.readFileSync("./public/footer/footer.html", "utf8");
const homePage = fs.readFileSync("./public/home/home.html", "utf8");
const signupPage = fs.readFileSync("./public/signup/signup.html", "utf8");
const profilePage = fs.readFileSync("./public/profile/profile.html", "utf8")
const loginPage = fs.readFileSync("./public/login/login.html", "utf8");

app.get('/', (req, res) => {
    return res.send(navbarPage + homePage + footerPage);
});

app.get('/test', (req, res) => {
    return res.send(navbarPage + profilePage);
});

app.get('/login', (req, res) => {
    return res.send(navbarPage + loginPage);
});

app.get('/signup', (req, res) => {
    return res.send(navbarPage + signupPage);
});

const session = require('express-session');

// You need to copy the config.template.json file and fill out your own secret
const config = require('./config/config.json');

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8 // limit each IP to 8 requests per windowMs
});

app.use('/signup', authLimiter);
app.use('/login', authLimiter);


/* Setup Knex with Objection */

const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');

const knex = Knex(knexfile.development);

Model.knex(knex);

const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');

app.use(authRoute);
app.use(usersRoute);

const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", PORT);
})
