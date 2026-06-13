import { Router, type Request, type Response } from "express";
import { CollectionService } from "./services/collection.service";
import { CollectionItemModel } from "./models/collection-item.model";
import type { CollectionItemType } from "./models/collection-item.model";

const router = Router();

// GET /api/collection/:userId
router.get("/collection/:userId", async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const q = req.query as Record<string, string>;
    const type = q.type as CollectionItemType | undefined;
    let items;
    if (type === "wishlist") {
      items = await CollectionService.getWishlist(userId);
    } else if (type === "owned") {
      items = await CollectionService.getOwned(userId);
    } else {
      items = await CollectionService.getByUser(userId);
    }
    res.json({ items });
  } catch {
    res.status(500).json({ error: "Failed to fetch collection" });
  }
});

// POST /api/collection — add item to collection
router.post("/collection", async (req: Request, res: Response) => {
  try {
    const { userId, productId, productName, productBrand, productImage, productPrice, productCategory, type, notes } = req.body as Record<string, string>;
    if (!userId || !productId || !type) {
      return res.status(400).json({ error: "userId, productId, and type are required" });
    }
    const item = await CollectionService.add({
      userId,
      productId,
      productName: productName ?? "",
      productBrand: productBrand ?? "",
      productImage,
      productPrice: productPrice ? Number(productPrice) : undefined,
      productCategory,
      type: type as CollectionItemType,
      notes,
    });
    return res.status(201).json({ success: true, item });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add to collection";
    return res.status(500).json({ error: message });
  }
});

// DELETE /api/collection/:userId/:productId
router.delete("/collection/:userId/:productId", async (req: Request, res: Response) => {
  try {
    const q = req.query as Record<string, string>;
    const type = q.type as CollectionItemType | undefined;
    await CollectionService.remove(String(req.params.userId), String(req.params.productId), type);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to remove from collection" });
  }
});

// GET /api/collection/:userId/check/:productId
router.get("/collection/:userId/check/:productId", async (req: Request, res: Response) => {
  try {
    const q = req.query as Record<string, string>;
    const type = q.type as CollectionItemType | undefined;
    const inCollection = await CollectionService.isInCollection(
      String(req.params.userId),
      String(req.params.productId),
      type
    );
    res.json({ inCollection });
  } catch {
    res.status(500).json({ error: "Failed to check collection" });
  }
});

// Ensure model is initialized
void CollectionItemModel;

export default router;
