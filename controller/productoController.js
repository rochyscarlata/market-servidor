const ProductoModel = require("../models/producto");


const ProductoController ={
listarProductos: async (req , res) => {
    const productos = await ProductoModel.find();
    return res.json({productos})
    
},

cargarProducto: async (req , res) => {
    const {nombre ,imagen, descripcion ,stock ,precio, tipo} = req.body;

    const newProducto = new ProductoModel({nombre ,imagen, descripcion ,stock ,precio,tipo})
   
    //Exite el producto?
    const productoExiste = await ProductoModel.find({nombre})
    
    if(productoExiste == null){
        return res.json({message:"el producto ya esta en la lista"});
    }
       
    
      newProducto.save()
      return res.json({newProducto});

        
},

modificarProducto: async (req , res) => {
    const {_id} = req.params;
    const {nombre ,imagen , descripcion ,stock, precio, tipo} = req.body;

    const producto = await ProductoModel.findOneAndUpdate({_id:_id},{nombre , imagen ,descripcion, stock, precio , tipo}
       )

    
   if(producto){
       return res.json({message:"producto actualizado"})
   }else{
       return res.json({message:"producto no encontrado"})
   }    
},
//elimiar un producto
eliminarProducto: async (req , res) => {
    const {_id} = req.params;
   
    const producto = await ProductoModel.findOneAndDelete({_id:_id})

    
   if(producto){
       return res.json({message:"producto eliminado"})
   }else{
       return res.json({message:"producto no encontrado"})
   }    
},

// actualiza el stock de los productos una vez realizada la compra
actualizarStock : async( req, res, next) => {
   const ProductosComprados=req.productos;
   //tengo que iterar sobre los productos comprados
ProductosComprados.map(async(produco)=>{
    //cambio la cantidad a negativo
    const cantidad= (-1)*produco.cantidad;
    //actualizo los productos
    const productoActualizado= await ProductoModel.updateOne(
        {_id:produco._id}, 
        { $inc: { stock: cantidad, } }
        )


})
next()
}

}

module.exports = ProductoController;