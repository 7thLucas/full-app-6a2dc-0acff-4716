import { Router, type Request, type Response } from "express";
import { InquiryService } from "./services/inquiry.service";
import { InquiryModel } from "./models/inquiry.model";

const router = Router();

// POST /api/inquiries — submit a purchase inquiry (public)
router.post("/inquiries", async (req: Request, res: Response) => {
  try {
    const { productId, productName, productBrand, name, email, phone, message, userId } = req.body as Record<string, string>;
    if (!productId || !name || !email) {
      return res.status(400).json({ error: "productId, name, and email are required" });
    }
    const inquiry = await InquiryService.create({
      productId,
      productName: productName ?? "",
      productBrand: productBrand ?? "",
      name,
      email,
      phone,
      message,
      userId,
    });
    return res.status(201).json({ success: true, inquiry });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit inquiry";
    return res.status(500).json({ error: message });
  }
});

// GET /api/inquiries — list all (admin)
router.get("/inquiries", async (req: Request, res: Response) => {
  try {
    const q = req.query as Record<string, string>;
    const page = q.page ? Number(q.page) : 1;
    const limit = q.limit ? Number(q.limit) : 20;
    const result = await InquiryService.findAll(page, limit);
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

// GET /api/inquiries/user/:userId — user's own inquiries
router.get("/inquiries/user/:userId", async (req: Request, res: Response) => {
  try {
    const items = await InquiryService.findByUser(String(req.params.userId));
    res.json({ items });
  } catch {
    res.status(500).json({ error: "Failed to fetch user inquiries" });
  }
});

// PATCH /api/inquiries/:id/status
router.patch("/inquiries/:id/status", async (req: Request, res: Response) => {
  try {
    const inquiry = await InquiryService.updateStatus(String(req.params.id), req.body.status);
    res.json(inquiry);
  } catch {
    res.status(500).json({ error: "Failed to update inquiry status" });
  }
});

// Ensure model is initialized
void InquiryModel;

export default router;
