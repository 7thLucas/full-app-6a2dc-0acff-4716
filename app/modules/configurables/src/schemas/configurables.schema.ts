/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};

export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        { fieldName: "primary", type: "color", required: true, label: "Primary (Gold)" },
        { fieldName: "secondary", type: "color", required: true, label: "Secondary (Surface)" },
        { fieldName: "accent", type: "color", required: true, label: "Accent (Deep Gold)" },
      ],
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
    },
    {
      fieldName: "aboutText",
      type: "string",
      required: false,
      label: "About Text",
    },
    {
      fieldName: "heroHeading",
      type: "string",
      required: false,
      label: "Hero Heading",
    },
    {
      fieldName: "heroSubheading",
      type: "string",
      required: false,
      label: "Hero Subheading",
    },
    {
      fieldName: "heroImage",
      type: "file",
      required: false,
      label: "Hero Image",
    },
    {
      fieldName: "catalogHeading",
      type: "string",
      required: false,
      label: "Catalog Section Heading",
    },
    {
      fieldName: "editorialHeading",
      type: "string",
      required: false,
      label: "Editorial Section Heading",
    },
    {
      fieldName: "inquiryCtaLabel",
      type: "string",
      required: false,
      label: "Inquiry CTA Button Label",
    },
    {
      fieldName: "wishlistCtaLabel",
      type: "string",
      required: false,
      label: "Wishlist CTA Button Label",
    },
    {
      fieldName: "contactEmail",
      type: "string",
      required: false,
      label: "Contact / Inquiry Email",
    },
    {
      fieldName: "inquiryConfirmationMessage",
      type: "string",
      required: false,
      label: "Inquiry Confirmation Message",
    },
    {
      fieldName: "featuredBrands",
      type: "array",
      label: "Featured Brand Names",
      item: { type: "string", required: true },
    },
    {
      fieldName: "productCategories",
      type: "array",
      label: "Product Categories",
      item: { type: "string", required: true },
    },
    {
      fieldName: "showEditorialSection",
      type: "boolean",
      required: false,
      label: "Show Editorial Section",
    },
    {
      fieldName: "showWishlistFeature",
      type: "boolean",
      required: false,
      label: "Enable Wishlist Feature",
    },
    {
      fieldName: "itemsPerPage",
      type: "number",
      required: false,
      label: "Items Per Page",
      min: 4,
      max: 48,
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
    },
    {
      fieldName: "socialLinks",
      type: "object",
      required: false,
      label: "Social Links",
      fields: [
        { fieldName: "instagram", type: "url", required: false, label: "Instagram" },
        { fieldName: "twitter", type: "url", required: false, label: "Twitter / X" },
      ],
    },
  ],
};
