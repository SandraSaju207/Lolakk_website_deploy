import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Product name is required"], 
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  productId: {
  type: String,
  unique: true,
},
  price: { 
    type: Number, 
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
    default: 0 
  },
  stock: { 
    type: Number, 
    min: [0, "Stock cannot be negative"],
    default: 0 
  },
  image: { 
    type: String,
    required: true,
    default: "/uploads/placeholder.jpg" 
  },
  type: { 
    type: String, 
    required: true,
    lowercase: true, // Standardizes 'Rings' to 'rings'
    trim: true,
    enum: ['rentals', 'rings', 'earrings', 'bracelets', 'necklaces','kids', 'hair-accessories'], 
  }, 
  style: {
  type: String,
  lowercase: true,
  trim: true,
  enum: ['traditional', 'modern', 'casual'],
  default: 'traditional'
},
  trending: { 
    type: Boolean, 
    default: false 
  },
  itemType: {
  type: String,
  enum: [
    "bracelet",
    "bangle",

    // kids
    "hair_bun",
    "hair_clip",
    "hair_bow",
    "kids_bangles",
    "kids_necklace"
  ],
},
accessoryType: {
  type: String,
  enum: [
    "bow",
    "clip",
    "scrunchie",
    "bun",
    "headband",
    "hairpin"
  ],
  lowercase: true
},

occasion: {
  type: String,
  enum: [
    "daily",
    "party",
    "wedding",
    "festival",
    "school"
  ],
  lowercase: true
},
  audience: { 
    type: String, 
    default: 'Women',
    enum: ['Women', 'Kids', 'Unisex']
  },
  materialType: {
  type: String,
  enum: ['gold', 'diamond', 'gemstone','silver'],
  lowercase: true,
  default: 'gold'
},
size: {
  type: Number,
  required: false
},
  extra: { 
    type: String,
    default: "" 
  }
}, { timestamps: true });

productSchema.pre("save", function () {
  if (!this.productId) {
    this.productId =
      Date.now().toString().slice(-4);
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;