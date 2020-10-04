const ProductoModel = require("../models/producto");
const CarritoModel = require("../models/carrito");

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
//setup MercadoPago
mercadopago.configure({
  access_token: process.env.CLAVE_MP,
});
// const verificarPago = (req, res, next) => {
//   // //veo si el pago esta bien
//   // const { efectivo, tarjeta } = req.body;
//   // //si efectivo es true entoces no se envia tarjeta
//   // if (efectivo) {
//   //   //mando el estado del pago como exitoso
//   //   req.estado = "exitoso";
//   //   return next();
//   // } else {
//   //   // se paga con tarjeta y tengo que enviar los datos a mecadopago para que me verifique
//   //   //en este caso le daremos exitoso tambien
//   //   // const estado = "exitoso";

//   //   const estado = "rechazado";
//   //   if (estado === "exitoso") {
//   //     req.estado = estado;
//   //     next();
//   //     return;
//   //   } else if (estado === "rechazado") {
//   //     req.estado = estado;
//   //     next();

//   //     // req.json({message:"error en el metodo de pago"})

//   //     return;
//   //   }
//   // }
// };
// module.exports = verificarPago;

const verificarPago = async (req, res, next) => {
  const { carrito } = req.body;
  const carritoUser = await CarritoModel.findOne({ _id: carrito }).populate(
    "productos.productoId"
  );
  //separo los productos
  const productos = carritoUser.productos;

  const cargarProductos = () => {
    // let envio = { id: 1,
    //   title: "Envio",
    //   unit_price: 160,
    //   quantity: 1}
      
    let productosMp = [ { id: 1,
      title: "Envio",
      unit_price: 160,
      quantity: 1}];
    productos.map((el) => {
      let product = {
        id: el.productoId._id,
        title: el.productoId.nombre,
        unit_price: parseInt(el.productoId.precio),
        quantity: el.cantidadProducto,
      };
      productosMp.push(product)
    });
    return productosMp
  };
//  console.log(cargarProductos()) 

   const preferences = {
    // Esta parte de Items vas a tener que actualizarla con la info de tu carrito de verdad, aquí está hardcoded.
    items: cargarProductos(),
    back_urls: {
      // Aquí poné las urls q crearon ustedes
      success: "http://localhost:3000/pagoExitoso",
      failure: "http://localhost:3000/pagoFallido",
      pending: "http://localhost:3000/pagoEnProceso"
    },
    auto_return: "approved",
  };
  try {
    const payment = await mercadopago.preferences.create(preferences);
    // console.log(mercadopago)
    console.log(payment)
    return res.json({redirectUrl: payment.body.init_point});
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({failure: e.message});
  }
};
module.exports = verificarPago;
