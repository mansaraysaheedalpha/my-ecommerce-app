import express from "express";
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProductById,
  deleteProductById
} from "../controller/productController";

const router = express.Router();

router.get("/", fetchProducts);
router.get("/:id", fetchProductById);
router.post("/", createProduct)
router.put("/:id", updateProductById)
router.delete("/:id", deleteProductById)

export default router;
