import mongoose from 'mongoose';

// Define the schema for Category
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String},
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

export default Category;	