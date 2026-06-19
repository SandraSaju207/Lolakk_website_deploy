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