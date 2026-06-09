import express from "express";
// ADD 'updateProduct' TO THE LIST BELOW
import { 
  getProducts, 
  addProduct, 
  deleteProduct, 
  updateProduct 
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);

// CREATE: Uses the 'addProduct' controller
router.post("/", upload.single("image"), addProduct);

// UPDATE: Added 'upload.single' so you can also update photos!
router.patch('/:id', upload.single("image"), updateProduct); 

router.delete("/:id", deleteProduct);

export default router;