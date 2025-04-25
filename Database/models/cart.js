import mongoose from 'mongoose';
// Cart Schema
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId,  // Reference to Product model
        ref: 'Product', 
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;