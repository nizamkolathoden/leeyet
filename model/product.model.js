const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    trim: true,
    maxlength: [120, "prodct name must less than 120"],
  },

  price: {
    type: Number,
    required: [true, "please enter Price"],
    maxlength: [5, "price is less than 5"],
  },

  deliveryCharge: {
    type: Number,
    required: [true, "please enter Price"],
    maxlength: [5, "price is less than 5"],
  },
  disscount: {
    type: Number,
    required: [true, "please enter Price"],
    maxlength: [5, "price is less than 5"],
  },
  totalAmount: {
    type: Number,
    required: [true, "please enter Price"],
    maxlength: [5, "price is less than 5"],
  },
  description: {
    type: String,
    required: [true, "please enter your description"],
    trim: true,
  },

  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],

 
  
   
  
  
  
  
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Prdouct", productSchema);
