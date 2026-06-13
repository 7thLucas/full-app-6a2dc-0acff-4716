import { Router, type Request, type Response } from "express";
import { ProductService } from "./services/product.service";
import { ProductModel } from "./models/product.model";

const router = Router();

// GET /api/products
router.get("/products", async (req: Request, res: Response) => {
  try {
    const q = req.query as Record<string, string>;
    const { category, brand, minPrice, maxPrice, featured, search, sort = "newest", page = "1", limit = "12" } = q;

    const result = await ProductService.findAll(
      {
        category,
        brand,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        isFeatured: featured === "true" ? true : undefined,
        search,
      },
      sort as "price_asc" | "price_desc" | "newest" | "featured",
      Number(page),
      Number(limit)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/featured
router.get("/products/featured", async (req: Request, res: Response) => {
  try {
    const q = req.query as Record<string, string>;
    const limit = q.limit ? Number(q.limit) : 6;
    const items = await ProductService.findFeatured(limit);
    res.json({ items });
  } catch {
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

// GET /api/products/new-arrivals
router.get("/products/new-arrivals", async (req: Request, res: Response) => {
  try {
    const q = req.query as Record<string, string>;
    const limit = q.limit ? Number(q.limit) : 6;
    const items = await ProductService.findNewArrivals(limit);
    res.json({ items });
  } catch {
    res.status(500).json({ error: "Failed to fetch new arrivals" });
  }
});

// GET /api/products/meta
router.get("/products/meta", async (req: Request, res: Response) => {
  try {
    const [brands, categories] = await Promise.all([
      ProductService.getDistinctBrands(),
      ProductService.getDistinctCategories(),
    ]);
    res.json({ brands, categories });
  } catch {
    res.status(500).json({ error: "Failed to fetch product meta" });
  }
});

// GET /api/products/:id
router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const product =
      (await ProductService.findBySlug(id)) ||
      (await ProductService.findById(id));
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch {
    return res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /api/products (admin)
router.post("/products", async (req: Request, res: Response) => {
  try {
    const product = await ProductService.create(req.body);
    res.status(201).json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    res.status(400).json({ error: message });
  }
});

// PUT /api/products/:id (admin)
router.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const product = await ProductService.update(String(req.params.id), req.body);
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return res.status(400).json({ error: message });
  }
});

// DELETE /api/products/:id (admin)
router.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    await ProductService.delete(String(req.params.id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Ensure ProductModel is initialized
void ProductModel;

export default router;
