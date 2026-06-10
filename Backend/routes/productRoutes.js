import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", upload.single("image"), addProduct);

router.patch("/:id", upload.single("image"), updateProduct);

router.delete("/:id", deleteProduct);

export default router;