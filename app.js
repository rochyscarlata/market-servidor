
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
 
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

//setup MercadoPago
mercadopago.configure({
  access_token:process.env.CLAVE_MP
});


router.post("/", async function  (req, res) {
  
    const {precio , nombre , email , tipo  ,razon , numero ,servicio , patente} = req.body
  
  //rellenar email depende la informacion 
  let contenido 
  if (nombre !== undefined) {
    contenido=`<p>El nombre o DNI : ${nombre}</p>`
  }else if ( razon !== undefined) {
    contenido=`<p>El cuit o razon es  : ${razon}</p>`
  } else if (numero !== undefined) {
    contenido=`<p>El numero es  : ${numero}</p><br/><p>El servicio  es  : ${servicio}</p>`
  }else if (patente !== undefined) {
    contenido=`<p>La patente es : ${patente}</p>`
  }
  
    // Crea un objeto de preferencia
  let preference = {
    items: [
      {
        title: 'Informe',
         unit_price: req.body.precio,
        quantity: 1,
      },
    ],
    back_urls: {
      success :"http://prevengase.com/pagoExitoso",
      failure: "http://prevengase.com/pagoFallido",
      pending: "http://prevengase.com/pagoPendiente"
    },
    auto_return: "approved",
  }
  
      const payment = await mercadopago.preferences.create(preference);
    
      
          res.json({redirectUrl:payment.body.init_point});
  
     
     let transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com.ar",
      port: 587,
      secure: false,
      auth: {
        user: "prueba@prevengase.com", 
        pass:  "Prevengase2020", 
      },
    });
   
    
    //Para prevengase
     transporter.sendMail({
      from: 'prueba@prevengase.com',
      to:'info@prevengase.com',
      subject: 'PREVENGASE INFORME',
      text: 'Informe ',
      html: `<h1>PREVENGASE</h1>      
        <br/>
        <h2>DATOS : </h2>
        <br/>
        <p>Tipo de informe : <span>${tipo}</span></p>
        <p> Precio : <span>${precio}</span></p>
        <p>Email del solicitante : <span>${email}</span></p>
        ${contenido}
        `,
    });
  
  
  })
  


// Initialize aplication
const port = process.env.PORT || 8080;
app.listen(port , () => console.log("App started en " + port));

