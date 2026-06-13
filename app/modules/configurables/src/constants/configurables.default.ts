/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TSocialLinks = {
  instagram: string;
  twitter: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  tagline: string;
  aboutText: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  catalogHeading: string;
  editorialHeading: string;
  inquiryCtaLabel: string;
  wishlistCtaLabel: string;
  contactEmail: string;
  inquiryConfirmationMessage: string;
  featuredBrands: string[];
  productCategories: string[];
  showEditorialSection: boolean;
  showWishlistFeature: boolean;
  itemsPerPage: number;
  footerText: string;
  socialLinks: TSocialLinks;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Renard's",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#C9A96E",
    secondary: "#1A1A1E",
    accent: "#B8966A",
  },
  tagline: "Rare. Restrained. Yours.",
  aboutText:
    "Renard's is the definitive destination for discerning collectors of luxury watches and wallets — curated pieces from the world's most storied maisons, presented with the editorial depth they deserve.",
  heroHeading: "The Art of Timekeeping",
  heroSubheading:
    "Curated timepieces and leather goods for those who understand the weight of a well-chosen object.",
  heroImage: "", // fill it here once uploaded
  catalogHeading: "The Collection",
  editorialHeading: "From the Maisons",
  inquiryCtaLabel: "Request Inquiry",
  wishlistCtaLabel: "Save to Collection",
  contactEmail: "", // fill it here
  inquiryConfirmationMessage:
    "Your inquiry has been received. Our specialists will be in touch within 24 hours.",
  featuredBrands: ["Patek Philippe", "Audemars Piguet", "Richard Mille", "Rolex", "A. Lange & Söhne", "Hermès", "Louis Vuitton", "Bottega Veneta"],
  productCategories: ["Watches", "Wallets", "Card Holders", "Watch Straps"],
  showEditorialSection: true,
  showWishlistFeature: true,
  itemsPerPage: 12, // fill it here
  footerText: "© 2026 Renard's. All rights reserved. Curated for the discerning few.",
  socialLinks: {
    instagram: "", // fill it here
    twitter: "", // fill it here
  },
};
