import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export type ProductCategory = "Watches" | "Wallets" | "Card Holders" | "Watch Straps";
export type ProductCondition = "Unworn" | "Mint" | "Excellent" | "Very Good" | "Good";

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    collection: "tbl_products",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
})
export class Product extends TimeStamps {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  brand!: string;

  @prop({ required: true, enum: ["Watches", "Wallets", "Card Holders", "Watch Straps"] })
  category!: ProductCategory;

  @prop({ required: true })
  price!: number;

  @prop({ required: false })
  priceLabel?: string; // e.g. "Price on Request"

  @prop({ required: false, default: "" })
  referenceNumber?: string;

  @prop({ required: false, default: "" })
  year?: string;

  @prop({ required: true })
  shortDescription!: string;

  @prop({ required: true })
  description!: string; // editorial long-form

  @prop({ required: false, default: "" })
  craftsmanshipNotes?: string;

  @prop({ required: false, default: "" })
  provenanceNotes?: string;

  @prop({ type: () => [String], default: [] })
  images!: string[];

  @prop({ required: false, default: "" })
  heroImage?: string;

  @prop({ required: true })
  condition!: ProductCondition;

  @prop({ type: () => [String], default: [] })
  tags!: string[];

  // Spec sheet stored as key-value
  @prop({ type: () => Object, default: {} })
  specs?: Record<string, string>;

  @prop({ default: true })
  isAvailable!: boolean;

  @prop({ default: false })
  isFeatured!: boolean;

  @prop({ default: false })
  isLimitedEdition!: boolean;

  @prop({ default: false })
  isNewArrival!: boolean;

  @prop({ default: false })
  isCertified!: boolean;

  @prop({ required: false, default: "" })
  slug?: string;
}

export const ProductModel = getModelForClass(Product);
