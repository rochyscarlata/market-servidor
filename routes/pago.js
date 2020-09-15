const VentaController = require("../controller/ventaController");
const router = require('express').Router();

// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

//setup MercadoPago
mercadopago.configure({
  access_token:process.env.CLAVE_MP
});

router.route("/")
// traer un las ventas de un usuario
        .get(VentaController.ventaRealizada)
        .post(async function  (req, res) {
  
                const items=req.body.items;
                let productos = [
                        
                       
                        
              
                        
                ]
                
                for (const prop in items) {   productos.push(`${prop} : ${items[prop]}`); }
                console.log(Object.keys(productos));
               

                
               
            
            
                // Crea un objeto de preferencia
              let preference = {
                items: productos,

                back_urls: {
                  success :"http://localhost:3000/payment-success",
                  failure: "http://localhost:3000/payment-failure",
                  pending: "http://localhost:3000/payment-pending"
                },
                auto_return: "approved",
              }
              
                  const payment = await mercadopago.preferences.create(preference);
                
                  
                      res.json({redirectUrl:payment.body.init_point});
              
                 
                //  let transporter = nodemailer.createTransport({
                //   host: "smtp.hostinger.com.ar",
                //   port: 587,
                //   secure: false,
                //   auth: {
                //     user: "prueba@prevengase.com", 
                //     pass:  "Prevengase2020", 
                //   },
                // });
               
                
                // //Para prevengase
                //  transporter.sendMail({
                //   from: 'prueba@prevengase.com',
                //   to:'info@prevengase.com',
                //   subject: 'PREVENGASE INFORME',
                //   text: 'Informe ',
                //   html: `<h1>PREVENGASE</h1>      
                //     <br/>
                //     <h2>DATOS : </h2>
                //     <br/>
                //     <p>Tipo de informe : <span>${tipo}</span></p>
                //     <p> Precio : <span>${precio}</span></p>
                //     <p>Email del solicitante : <span>${email}</span></p>
                //     ${contenido}
                //     `,
                // });
              
            
              })

module.exports = router;
