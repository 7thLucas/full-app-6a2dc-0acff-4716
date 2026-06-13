import { CollectionItemModel, type CollectionItemType } from "../models/collection-item.model";

export class CollectionService {
  static async getByUser(userId: string) {
    return CollectionItemModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  static async getWishlist(userId: string) {
    return CollectionItemModel.find({ userId, type: "wishlist" }).sort({ createdAt: -1 }).lean();
  }

  static async getOwned(userId: string) {
    return CollectionItemModel.find({ userId, type: "owned" }).sort({ createdAt: -1 }).lean();
  }

  static async add(data: {
    userId: string;
    productId: string;
    productName: string;
    productBrand: string;
    productImage?: string;
    productPrice?: number;
    productCategory?: string;
    type: CollectionItemType;
    notes?: string;
  }) {
    // Upsert — update if already exists for this user+product+type combo
    return CollectionItemModel.findOneAndUpdate(
      { userId: data.userId, productId: data.productId, type: data.type },
      data,
      { upsert: true, new: true }
    ).lean();
  }

  static async remove(userId: string, productId: string, type?: CollectionItemType) {
    const query: Record<string, string> = { userId, productId };
    if (type) query.type = type;
    return CollectionItemModel.deleteOne(query);
  }

  static async isInCollection(userId: string, productId: string, type?: CollectionItemType) {
    const query: Record<string, string> = { userId, productId };
    if (type) query.type = type;
    const count = await CollectionItemModel.countDocuments(query);
    return count > 0;
  }

  static async updateNotes(userId: string, productId: string, type: CollectionItemType, notes: string) {
    return CollectionItemModel.findOneAndUpdate(
      { userId, productId, type },
      { notes },
      { new: true }
    ).lean();
  }
}
