import { Link } from "react-router";
import { Heart } from "lucide-react";
import { cn } from "~/lib/utils";

export type ProductCardData = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  priceLabel?: string;
  heroImage?: string;
  images?: string[];
  condition: string;
  isFeatured?: boolean;
  isLimitedEdition?: boolean;
  isNewArrival?: boolean;
  isCertified?: boolean;
  slug?: string;
};

interface ProductCardProps {
  product: ProductCardData;
  onWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  className?: string;
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
  return `$${price.toLocaleString()}`;
}

export function ProductCard({ product, onWishlist, isWishlisted, className }: ProductCardProps) {
  const imageUrl = product.heroImage || product.images?.[0] || "";
  const productHref = `/products/${product.slug || product._id}`;

  return (
    <div
      className={cn(
        "relative group flex flex-col bg-card rounded-lg overflow-hidden border-gold-shimmer transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <Link to={productHref} className="block relative aspect-[3/4] overflow-hidden bg-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${product.brand} ${product.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <span className="text-muted-foreground text-xs tracking-wider">No image</span>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-medium tracking-widest uppercase bg-emerald-900/70 text-emerald-400 border border-emerald-800/40">
              New
            </span>
          )}
          {product.isLimitedEdition && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-medium tracking-widest uppercase bg-muted/70 text-muted-foreground border border-border">
              Limited
            </span>
          )}
          {product.isCertified && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-medium tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
              Certified
            </span>
          )}
        </div>

        {/* Wishlist button */}
        {onWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onWishlist(product._id);
            }}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm transition-all duration-200 hover:bg-background/80"
          >
            <Heart
              className={cn(
                "w-3.5 h-3.5 transition-colors",
                isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"
              )}
            />
          </button>
        )}
      </Link>

      {/* Content */}
      <Link to={productHref} className="flex flex-col p-3 flex-1">
        <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-0.5">
          {product.brand}
        </p>
        <h3 className="text-sm font-serif text-foreground leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-medium text-[#800020]">
            {product.priceLabel || formatPrice(product.price)}
          </span>
          <span className="text-[9px] text-muted-foreground tracking-wider">
            {product.condition}
          </span>
        </div>
      </Link>
    </div>
  );
}
