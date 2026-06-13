import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export type InquiryStatus = "pending" | "contacted" | "closed";

@modelOptions({
  schemaOptions: {
    collection: "tbl_inquiries",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
})
export class Inquiry extends TimeStamps {
  @prop({ required: true })
  productId!: string;

  @prop({ required: true })
  productName!: string;

  @prop({ required: true })
  productBrand!: string;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  email!: string;

  @prop({ required: false, default: "" })
  phone?: string;

  @prop({ required: false, default: "" })
  message?: string;

  @prop({ required: false, default: "" })
  userId?: string; // optional — if user is authenticated

  @prop({ enum: ["pending", "contacted", "closed"], default: "pending" })
  status!: InquiryStatus;
}

export const InquiryModel = getModelForClass(Inquiry);
