const Product = require('../models/productModel');
const mongoose = require('mongoose');

// Get all products
const getProducts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const products = await Product.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Get a single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: 'Invalid product ID' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { Name, Category, Quantity, SerialNumber, Version, ShelfLife, Suppliers, ArrivalDate, Description } = req.body;

    const emptyFields = ['Name', 'Category', 'Quantity']; // Add more fields if needed

    if (emptyFields.some(field => !req.body[field])) {
      return res.status(400).json({ success: false, error: 'Please fill in all required fields' });
    }

    const user_id = req.user._id;
    const product = await Product.create({
      Name,
      Category,
      Quantity,
      SerialNumber,
      Version,
      ShelfLife,
      Suppliers,
      ArrivalDate,
      Description,
      user_id,
      Picture: {
        data: req.file.buffer, 
        contentType: req.file.mimetype,
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: 'Invalid product ID' });
    }

    const product = await Product.findOneAndDelete({ _id: id, user_id: req.user._id });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Product ID:', id);

    // Log the req.body to see what data is being received
    console.log('Request Body:', req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: 'Invalid product ID' });
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, user_id: req.user._id },
      { ...req.body },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
