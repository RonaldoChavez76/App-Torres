const Producto = require('../models/Producto');

exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProducto = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    const savedProducto = await producto.save();
    res.json(savedProducto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProducto = async (req, res) => {
  try {
    const updatedProducto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProducto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updatedProducto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProducto = async (req, res) => {
  try {
    const deletedProducto = await Producto.findByIdAndDelete(req.params.id);
    if (!deletedProducto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(deletedProducto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
