const CarritoModel = require("../models/carrito");
const UserModel = require("../models/user");
const ProductoModel = require("../models/producto");
const VentaModel = require("../models/venta");

const VentaController = {
  //listar todas las ventas
  listarVentas: async (req, res) => {
    const ventas = await VentaModel.find().populate("usuario");
    return res.json(ventas);
  },

  // traer las ventas de un usuario
  listarVentasUsuario: async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    // populate("productos.productoId")
    //busco las ventas que tengan ese usuario
    const ventas = await VentaModel.find({ usuario: id });
    if (ventas) {
      return res.json(ventas);
    }
    return res.json({ message: "No tiene ventas realizadas" });
  },

  // traer las ventas de un realizada
  ventaRealizada: async (req, res) => {
    const { id } = req.params;
    // populate("productos.productoId")
    //busco las ventas que tengan ese usuario

    const venta = await VentaModel.findOne({ _id: id });
    return res.json(venta);
  },

  //cargar una venta realizada por un usuario
  cargarVenta: async (req, res, next) => {
    const estado = req.estado;
    const {
      nombre,
      apellido,
      direccion_1,
      postal,
      pais,
      prov,
      telefono,
      tipoEnvio,
      tarjeta,
      efectivo,
      total,
      subtotal,
      carrito,
      usuario,
    } = req.body;
    // traigo el carrito del usuario
    const carritoUser = await CarritoModel.findOne({ _id: carrito }).populate(
      "productos.productoId"
    );
    const productos = carritoUser.productos;
    // armo lista de productos para crear la venta
    let listaproductos = [];
    //para buscar los productos y actualizar el stock

    let listaProductosIds = [];

    productos.map((producto) => {
      //guardo los id de los productos
      const productoID = {
        _id: producto.productoId._id,
        cantidad: producto.cantidadProducto,
      };

      listaProductosIds.push(productoID);
      //creo el objeto del producto con la cantidad

      const detalleProducto = {
        nombre: producto.productoId.nombre,
        cantidad: producto.cantidadProducto,
        precio: producto.productoId.precio,
      };
      // lo guardo en el array del la listaproducto
      listaproductos.push(detalleProducto);
    });
    //veo el estado
    if (estado === "rechazado") {
      const newVenta = new VentaModel({
        nombre,
        apellido,
        direccion_1,
        postal,
        pais,
        prov,
        telefono,
        tipoEnvio,
        tarjeta,
        total,
        subtotal,
        productos: listaproductos,
        usuario,
        efectivo,
        estadoVenta: estado,
      });

      return res.json(newVenta);
    }

    //creo la venta en dos tipos efectio o credito
    if (efectivo) {
      //caso de pagar con efectivo

      const newVenta = new VentaModel({
        nombre,
        apellido,
        direccion_1,
        postal,
        pais,
        prov,
        telefono,
        tipoEnvio,
        efectivo,
        total,
        subtotal,
        productos: listaproductos,
        usuario,
        efectivo,
        estadoVenta: estado,
      });
      //creo la venta
      newVenta.save();
      // la guardo en el array venta que tiene el usuario a la venta
      const user = await UserModel.findOneAndUpdate(
        { _id: usuario },
        { $push: { venta: newVenta._id } }
      );
      res.json(newVenta);
      req.productos = listaProductosIds;
      req.venta = newVenta;
      next();
      return;
    } else {
      // caso de pagar con tarjeta
      const newVenta = new VentaModel({
        nombre,
        apellido,
        direccion_1,
        postal,
        pais,
        prov,
        telefono,
        tipoEnvio,
        tarjeta,
        total,
        subtotal,
        productos: listaproductos,
        usuario,
        efectivo,
        estadoVenta: estado,
      });
      //creo la venta
      newVenta.save();
      // la guardo en el array venta que tiene el usuario a la venta
      const user = await UserModel.findOneAndUpdate(
        { _id: usuario },
        { $push: { venta: newVenta._id } }
      );
      res.json(newVenta);
      req.productos = listaProductosIds;
      req.venta = newVenta;
      next();
      return;
    }
  },

  editarCarrito: async (req, res) => {
    const {
      nombre,
      imagenNueva,
      descripcion,
      stock,
      _id,
      precio,
      tipo,
    } = req.body;

    const producto = await ProductoModel.findByIdAndUpdate(_id, {
      nombre,
      $push: { imagen: imagenNueva },
      descripcion,
      stock,
      precio,
      tipo,
    });

    console.log(producto);
    if (producto) {
      return res.json({ message: "producto actualizado" });
    } else {
      return res.json({ message: "producto no encontrado" });
    }
  },

  eliminarProductoCarrito: async (req, res) => {
    const { _id } = req.params;
    const { usuarioId } = req.body;
    const productoId = _id;

    console.log(req.body);

    console.log(req.params);
    //con el usuario busco el carrito

    const carrito = await CarritoModel.findOneAndUpdate(
      { usuario: usuarioId, "productos._id": productoId },
      { $pull: { productos: { _id: productoId } } }
    );
    if (carrito) {
      return res.json({ message: "Producto eliminado" });
    } else {
      return res.json({ message: "error " });
    }
  },
};

module.exports = VentaController;
