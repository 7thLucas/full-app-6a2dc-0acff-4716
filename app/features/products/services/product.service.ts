import { ProductModel, type Product } from "../models/product.model";

export type ProductFilter = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isAvailable?: boolean;
  search?: string;
};

export type ProductSort = "price_asc" | "price_desc" | "newest" | "featured";

export class ProductService {
  static async findAll(
    filter: ProductFilter = {},
    sort: ProductSort = "newest",
    page = 1,
    limit = 12
  ) {
    const query: Record<string, unknown> = { isAvailable: true };

    if (filter.category) query.category = filter.category;
    if (filter.brand) query.brand = { $regex: filter.brand, $options: "i" };
    if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
    if (filter.isAvailable !== undefined) query.isAvailable = filter.isAvailable;
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      query.price = {};
      if (filter.minPrice !== undefined) (query.price as Record<string, number>).$gte = filter.minPrice;
      if (filter.maxPrice !== undefined) (query.price as Record<string, number>).$lte = filter.maxPrice;
    }
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { brand: { $regex: filter.search, $options: "i" } },
        { description: { $regex: filter.search, $options: "i" } },
      ];
    }

    type SortParam = [string, 1 | -1];
    const sortMap: Record<ProductSort, SortParam[]> = {
      price_asc: [["price", 1]],
      price_desc: [["price", -1]],
      newest: [["createdAt", -1]],
      featured: [["isFeatured", -1], ["createdAt", -1]],
    };

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      ProductModel.find(query).sort(sortMap[sort]).skip(skip).limit(limit).lean(),
      ProductModel.countDocuments(query),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async findById(id: string) {
    return ProductModel.findById(id).lean();
  }

  static async findBySlug(slug: string) {
    return ProductModel.findOne({ slug }).lean();
  }

  static async findFeatured(limit = 6) {
    return ProductModel.find({ isFeatured: true, isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  static async findNewArrivals(limit = 6) {
    return ProductModel.find({ isNewArrival: true, isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  static async create(data: Partial<Product>) {
    // Auto-generate slug from name and brand
    if (!data.slug && data.name && data.brand) {
      data.slug = `${data.brand}-${data.name}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    return ProductModel.create(data);
  }

  static async update(id: string, data: Partial<Product>) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static async delete(id: string) {
    return ProductModel.findByIdAndDelete(id);
  }

  static async getDistinctBrands() {
    return ProductModel.distinct("brand", { isAvailable: true });
  }

  static async getDistinctCategories() {
    return ProductModel.distinct("category", { isAvailable: true });
  }
}
