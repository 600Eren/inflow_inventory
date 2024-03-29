const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  
  Category: {
    type: String,
    required: true,
  },
  
  Quantity: {
    type: Number,
    required: true,
  },

  SerialNumber: {
    type: String,
    required: true,
  },

  Version: {
    type: Number,
    required: true,
  },

  ShelfLife: {
    type: String,
    required: true,
  },

  Suppliers: {
    type: String,
    required: true,    
  },

  Model: {
    type: String,
    required: true,
  },

  Picture: {
    data: Buffer,
    contentType: String,
  },

  ArrivalDate: {
    type: String,
    required: true,
  },

  Description: {
    type: String,
    required: true,
  },

  user_id: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
