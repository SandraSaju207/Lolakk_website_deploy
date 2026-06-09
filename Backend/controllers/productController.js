import Product from "../models/Product.js";

// @desc    Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a new product with Image Upload
export const addProduct = async (req, res) => {
  try {
    const {
  name,
  stock,
  type,
  price,
  trending,
  audience,
  extra,
  description,
  materialType,
  itemType,
  style
} = req.body;

    // Check if an image was uploaded via multer
    // We store the relative path so it's easy to serve later
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "/uploads/placeholder.jpg";

    const product = new Product({
  name,
  stock: Number(stock),
  price: Number(price),
  type,
  style,
  itemType,
  trending: trending === 'true' || trending === true,
  audience,
  extra,
  description,
  materialType,
  image: imagePath
});
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Update a product (PATCH)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // 1. Handle Number conversions (FormData sends everything as strings)
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (updateData.trending) updateData.trending = updateData.trending === 'true' || updateData.trending === true;

    // 2. If a new image was uploaded, update the image path
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(400).json({ message: err.message });
  }
};