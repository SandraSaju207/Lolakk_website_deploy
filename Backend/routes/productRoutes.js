import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);

// Admin only
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  addProduct
);

router.get("/search/:productId", async (req, res) => {
  try {
    const product = await Product.findOne({
      productId: req.params.productId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.patch(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;