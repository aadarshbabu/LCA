import { Request, Response } from "express";
import {
  createCategory,
  getCategories,
  getCategoriesWithVideoCount,
  getPopularCategories,
} from "../services/categoryService";

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, isDefault } = req.body;
    const userId = req.user?.id;
    const category = await createCategory(name, isDefault, userId);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const categories = await getCategories(userId);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchCategoriesWithVideoCount = async (
  req: Request,
  res: Response
) => {
  try {
    const categoriesWithVideoCount = await getCategoriesWithVideoCount();
    res.status(200).json(categoriesWithVideoCount);
  } catch (error) {
    console.log("err", error);
    res.status(500).json({ error: error.message });
  }
};

export const fetchPopularCategories = async (req: Request, res: Response) => {
  try {
    const popularCategories = await getPopularCategories();
    res.status(200).json(popularCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
