
// imports libreies CODIGO ANTERIOR
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const morgan= require("morgan");
const cors = require("cors")

// imports de archivos propios
const db = require("./config/dataBase");
const routes = require("./routes");
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');
const facebookStrategy = require('./passport/facebook')

const router = express.Router();

// connect db 
db.connection();

// setup passport 

passport.use('local',localStrategy);
passport.use('jwt', jwtStrategy);
passport.use('facebook', facebookStrategy)


// setup express aplicaton
const app = express();
app.use(cors())
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
 app.use(passport.initialize())
app.use("/api", routes);


// "uso nodemailer";
const nodemailer = require("nodemailer");
 




  


// Initialize aplication
const port = process.env.PORT || 8080;
app.listen(port , () => console.log("App started en " + port));

