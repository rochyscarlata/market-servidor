const router = require('express').Router();
const VerificarPago = require("../middleware/verificarPago");
const VentaController = require("../controller/ventaController");
const ProductoController = require("../controller/productoController");
const CarritoController = require("../controller/carritoController");
const EmailController = require("../controller/enviarEmail");
const verificarStock = require('../middleware/verificarStockProducto');

router.route("/:_id")
// traer un las ventas de un usuario
        .get(VentaController.listarVentasUsuario)
router.route("/") 
        .get(VentaController.listarVentas)       
// cargar venta realizada por un usuario, 
//verifico el pago con el VeficiarPago
//creo la venta si es exitoso el pago
//si la venta es exitosa actualizar carrito del usuario y el stock del usuario
//Enviar email de confirmacion de venta 
        .post(
            verificarStock,
            VerificarPago,
        //      VentaController.cargarVenta,
        //      CarritoController.actualizarCarrito,
        //      ProductoController.actualizarStock,
        )
             //      EmailController.emailVenta)       

module.exports = router;