//src/controller/productController.ts
import { NextFunction, Request, Response } from "express";
import Product from "../models/ProductModel";

const getValidationErrorMessages = (error: any, res: Response) => {
  if (error.name === "ValidationError") {
    let validationError: { [key: string]: string } = {};
    Object.keys(error.errors).forEach((key) => {
      validationError[key] = error.errors[key].message;
    });
    res.status(400).json({
      message: "Validation failed. Please check your data",
      errors: validationError,
    });
    return true;
  }
  return false;
};
/**
 *
 * @desc Fetch all active products
 * @route GET /api/products
 * @access public
 */

export const fetchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await Product.find({ isArchived: { $ne: true } });

    if (products.length === 0) {
      res.status(404).json({ message: "No active products found" });
      return;
    }
    res.status(200).json({
      message: "Active products fetched successfully",
      count: products.length,
      products: products,
    });
  } catch (error: any) {
    console.error("Error in fetchProducts", error);
    next(error);
  }
};

/**
 *
 * @desc Fetch a single active product by it's ID
 * @route GET /api/products/:id
 * @access public
 */

export const fetchProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ _id:id, isArchived: { $ne: true } });

    if (!product) {
      res
        .status(404)
        .json({ message: `Product with ID ${id} not found or is unavailable` });
      return;
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product: product,
    });
  } catch (error: any) {
    console.error("Error in fetchProductById: ", error.message || error);
    next(error);
  }
};

/**
 *
 * @desc Create new product
 * @route GET /api/products/
 * @access private/admin
 */

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: `${savedProduct.name} is successfully created`,
      product: savedProduct,
    });
  } catch (error: any) {
    if (getValidationErrorMessages(error, res)) return;
    console.error("Error in createProduct", error.message || error);
    next(error);
  }
};

/**
 *
 * @desc update existing product
 * @route PULL /api/products/:id
 * @access private/admin
 */

export const updateProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      res.status(404).json({ message: `product with ${id} not found` });
      return;
    }

    res.status(200).json({
      message: `product ${id} has been updated successfully`,
      updatedProduct,
    });
  } catch (error: any) {
    if (getValidationErrorMessages(error, res)) return;
    console.error("Error in updateProductById", error.message || error);
    next(error);
  }
};

/**
 *
 * @desc Delete a product (Soft delete)
 * @route DELETE /api/products/:id
 * @access private/admin
 */

export const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const archivedProduct = await Product.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true, runValidators: true }
    );
    if (!archivedProduct) {
      res.status(404).json({ message: `product for ID ${id} not found` });
      return;
    }

    if (!archivedProduct.isArchived) {
      console.error(`product ${id} found but not archived`);
      return;
    }

    res.status(200).json({
      message: `Successfully archived ${archivedProduct.name}`,
      product: archivedProduct,
    });
  } catch (error: any) {
    console.error(
      "Error in deleteProductById(archive)",
      error.message || error
    );
    next(error);
  }
};
