import mongoose from 'mongoose';
import Product from './product.js';

const favoritesSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
}, { timestamps: true });

const Favorites = mongoose.model('Favorites', favoritesSchema);

export default Favorites;