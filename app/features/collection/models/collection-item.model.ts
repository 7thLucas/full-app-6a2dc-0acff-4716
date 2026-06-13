import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export type CollectionItemType = "owned" | "wishlist";

@modelOptions({
  schemaOptions: {
    collection: "tbl_collection_items",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
})
export class CollectionItem extends TimeStamps {
  @prop({ required: true })
  userId!: string;

  @prop({ required: true })
  productId!: string;

  @prop({ required: true })
  productName!: string;

  @prop({ required: true })
  productBrand!: string;

  @prop({ required: false, default: "" })
  productImage?: string;

  @prop({ required: false })
  productPrice?: number;

  @prop({ required: false, default: "" })
  productCategory?: string;

  @prop({ enum: ["owned", "wishlist"], default: "wishlist" })
  type!: CollectionItemType;

  @prop({ required: false, default: "" })
  notes?: string;
}

export const CollectionItemModel = getModelForClass(CollectionItem);
