import { Router } from "express";
import {
  addCategory,
  fetchCategories,
} from "../controllers/categoryController";
import { authenticate } from "../middleware/authenticate";

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     responses:
 *       200:
 *         description: A list of categories.
 *   post:
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *     responses:
 *       201:
 *         description: Category created successfully.
 */

router.post("/", authenticate, addCategory);
router.get("/", authenticate, fetchCategories);

export default router;
