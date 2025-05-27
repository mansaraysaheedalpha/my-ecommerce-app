import express from "express";
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from "../controller/productController";
import {
  validateBody,
  validateParams,
} from "../middleware/validationMiddleware";
import {
  createProductSchema,
  idParamSchema,
  updateProductBodySchema,
} from "../utils/validationSchemas";

const router = express.Router();

router.get("/", fetchProducts);
router.get("/:id", validateParams(idParamSchema), fetchProductById);
router.post("/", validateBody(createProductSchema), createProduct);
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateProductBodySchema),
  updateProductById
);
router.delete("/:id", validateParams(idParamSchema), deleteProductById);

export default router;
