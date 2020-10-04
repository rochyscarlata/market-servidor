const VentaController = require("../controller/ventaController");
const router = require('express').Router();

// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

//setup MercadoPago
mercadopago.configure({
  access_token:process.env.CLAVE_MP
});

router.route("/:id")
// traer un las ventas de un usuario
        .get(VentaController.ventaRealizada)
        

module.exports = router;
