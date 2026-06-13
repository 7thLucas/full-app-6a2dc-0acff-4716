import { InquiryModel } from "../models/inquiry.model";
import { EmailService } from "@qb/email";

export type CreateInquiryInput = {
  productId: string;
  productName: string;
  productBrand: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  userId?: string;
};

export class InquiryService {
  static async create(data: CreateInquiryInput) {
    const inquiry = await InquiryModel.create(data);

    // Send confirmation email to the buyer
    try {
      const contactEmail = process.env.CONTACT_EMAIL ?? "";
      if (contactEmail && data.email) {
        await EmailService.sendEmail({
          to: data.email,
          subject: `Your Sylph Inquiry — ${data.productBrand} ${data.productName}`,
          content: `Dear ${data.name},\n\nThank you for your inquiry regarding the ${data.productBrand} ${data.productName}.\n\nOur specialists will be in touch within 24 hours to discuss this piece with you.\n\nWith regards,\nThe Sylph Team`,
        });
      }

      // Notify the store
      if (contactEmail) {
        await EmailService.sendEmail({
          to: contactEmail,
          subject: `New Sylph Inquiry: ${data.productBrand} ${data.productName}`,
          content: `New inquiry received.\n\nProduct: ${data.productBrand} ${data.productName} (ID: ${data.productId})\nFrom: ${data.name} <${data.email}>${data.phone ? `\nPhone: ${data.phone}` : ""}\n\nMessage:\n${data.message || "(none)"}`,
        });
      }
    } catch {
      // Email failure is non-critical
    }

    return inquiry;
  }

  static async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      InquiryModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      InquiryModel.countDocuments(),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async findByUser(userId: string) {
    return InquiryModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  static async updateStatus(id: string, status: string) {
    return InquiryModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }
}
