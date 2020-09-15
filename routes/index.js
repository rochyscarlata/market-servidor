const router = require("express").Router();
const registerRoutes = require("./register");
const loginRoutes = require("./login");
const contentRoutes = require("./conten");
const AutenthicateUser = require("../middleware/AutenthicateUser");
const AutenthicateFacebook = require('../middleware/AutenthicateFacebook');
const passport = require('passport');
const productoRoute = require('./producto');
const carritoRoute = require("./carrito");
const turnoRoute = require("./turno");
const amdinRoute = require("./admin")
const ventaRoute = require("./venta")
const pagoRouete = require("./pago")

router.get("/", (req, res, next) => res.send("GESIONANDO USUARIOS"));

router.use("/register", registerRoutes);
router.use("/login", loginRoutes);
router.use("/private", AutenthicateUser, contentRoutes);
router.use("/producto",productoRoute );
router.use("/public", contentRoutes);
//? rutas de carrito
router.use("/cart", carritoRoute)
//? rutas de turnos
router.use("/turno", turnoRoute)
//? rutas de personas para admin
router.use("/personas", amdinRoute)
//? pruebas con facebbok

router.use('/auth/facebook/callback', AutenthicateFacebook , contentRoutes);

router.use('/auth/facebook', passport.authenticate('facebook') );
//? rutas de ventas de usuarios
router.use("/venta", ventaRoute);

//?ruta de pago 
router.use("/pago", pagoRouete)



module.exports = router;
