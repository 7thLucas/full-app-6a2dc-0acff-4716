import { useLoaderData, useActionData, Link } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useState } from "react";
import { PageLayout } from "~/components/layout/nav";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { ChevronLeft, Heart, Share2, MapPin, Shield, Clock, Check } from "lucide-react";
import { cn } from "~/lib/utils";

type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  priceLabel?: string;
  referenceNumber?: string;
  year?: string;
  shortDescription: string;
  description: string;
  craftsmanshipNotes?: string;
  provenanceNotes?: string;
  images: string[];
  heroImage?: string;
  condition: string;
  tags: string[];
  specs?: Record<string, string>;
  isAvailable: boolean;
  isFeatured?: boolean;
  isLimitedEdition?: boolean;
  isNewArrival?: boolean;
  isCertified?: boolean;
  slug?: string;
};

type LoaderData = {
  product: Product | null;
  userId: string | null;
};

type ActionData = {
  success?: boolean;
  error?: string;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  const baseUrl = new URL(request.url).origin;
  try {
    const res = await fetch(`${baseUrl}/api/products/${params.id}`);
    const product = res.ok ? await res.json() : null;
    return { product, userId: user?.id ?? null };
  } catch {
    return { product: null, userId: user?.id ?? null };
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "inquiry") {
    const baseUrl = new URL(request.url).origin;
    const user = getUserFromRequest(request);
    try {
      const res = await fetch(`${baseUrl}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: params.id,
          productName: formData.get("productName"),
          productBrand: formData.get("productBrand"),
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          userId: user?.id ?? "",
        }),
      });
      if (res.ok) return { success: true };
      return { error: "Failed to submit inquiry. Please try again." };
    } catch {
      return { error: "An unexpected error occurred." };
    }
  }

  if (intent === "wishlist") {
    const user = getUserFromRequest(request);
    if (!user) return { error: "Please sign in to save items." };
    const baseUrl = new URL(request.url).origin;
    try {
      await fetch(`${baseUrl}/api/collection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: params.id,
          productName: formData.get("productName"),
          productBrand: formData.get("productBrand"),
          productImage: formData.get("productImage"),
          productPrice: formData.get("productPrice"),
          productCategory: formData.get("productCategory"),
          type: "wishlist",
        }),
      });
      return { success: true };
    } catch {
      return { error: "Failed to save item." };
    }
  }

  return {};
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductDetailPage() {
  const { product, userId } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const { config, loading } = useConfigurables();
  const { isAuthenticated } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const inquiryCtaLabel = loading ? "Request Inquiry" : (config?.inquiryCtaLabel ?? "Request Inquiry");
  const wishlistCtaLabel = loading ? "Save to Collection" : (config?.wishlistCtaLabel ?? "Save to Collection");
  const confirmMessage = loading
    ? "Your inquiry has been received."
    : (config?.inquiryConfirmationMessage ?? "Your inquiry has been received. Our specialists will be in touch within 24 hours.");

  if (!product) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-muted-foreground">This piece could not be found.</p>
          <Link to="/catalog" className="mt-4 text-primary text-sm hover:underline">
            Return to catalog
          </Link>
        </div>
      </PageLayout>
    );
  }

  const allImages = [product.heroImage, ...(product.images || [])].filter(Boolean) as string[];
  if (allImages.length === 0) allImages.push("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Back button */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Link
          to="/catalog"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image gallery */}
      <div className="relative aspect-square bg-secondary">
        {allImages[activeImageIndex] ? (
          <img
            src={allImages[activeImageIndex]}
            alt={`${product.brand} ${product.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm tracking-wider">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-16 left-4 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-medium tracking-widest uppercase bg-emerald-900/70 text-emerald-400 border border-emerald-800/40">
              New Arrival
            </span>
          )}
          {product.isCertified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-medium tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
              <Shield className="w-2.5 h-2.5" />
              Certified
            </span>
          )}
          {product.isLimitedEdition && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-medium tracking-widest uppercase bg-muted/70 text-muted-foreground border border-border">
              Limited Edition
            </span>
          )}
        </div>

        {/* Image thumbnails */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === activeImageIndex ? "bg-primary w-4" : "bg-foreground/30"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="px-4 pt-5 pb-32 space-y-6">
        {/* Header */}
        <div>
          <p className="text-[10px] text-primary tracking-widest uppercase mb-1">{product.brand}</p>
          <h1 className="text-2xl font-serif text-foreground mb-2">{product.name}</h1>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-medium text-primary">
              {product.priceLabel || formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">{product.condition}</span>
          </div>
        </div>

        <div className="divider-gold" />

        {/* Quick info */}
        <div className="grid grid-cols-2 gap-3">
          {product.referenceNumber && (
            <QuickInfoItem label="Reference" value={product.referenceNumber} />
          )}
          {product.year && <QuickInfoItem label="Year" value={product.year} />}
          <QuickInfoItem label="Category" value={product.category} />
          <QuickInfoItem label="Condition" value={product.condition} />
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-foreground/90 leading-relaxed">{product.description}</p>
        </div>

        {/* Specs */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div>
            <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
              Specifications
            </h3>
            <div className="space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="text-foreground font-medium text-right max-w-[55%]">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Craftsmanship notes */}
        {product.craftsmanshipNotes && (
          <div className="bg-card rounded-lg p-4 border border-border/50">
            <h3 className="text-xs tracking-widest uppercase text-primary mb-2">Craftsmanship</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.craftsmanshipNotes}
            </p>
          </div>
        )}

        {/* Provenance */}
        {product.provenanceNotes && (
          <div className="flex items-start gap-3 bg-card rounded-lg p-4 border border-border/50">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs tracking-widest uppercase text-primary mb-1">Provenance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.provenanceNotes}
              </p>
            </div>
          </div>
        )}

        {/* Inquiry confirmation */}
        {actionData?.success && !inquirySubmitted && (
          <div
            className="flex items-start gap-3 bg-emerald-900/20 border border-emerald-800/40 rounded-lg p-4 fade-in-up"
            onAnimationEnd={() => setInquirySubmitted(true)}
          >
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-300">{confirmMessage}</p>
          </div>
        )}

        {actionData?.error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <p className="text-sm text-destructive">{actionData.error}</p>
          </div>
        )}

        {/* Inquiry form */}
        {showInquiryForm && !actionData?.success && (
          <div className="bg-card rounded-lg p-4 border border-border fade-in-up">
            <h3 className="text-sm font-serif text-foreground mb-4">Request an Inquiry</h3>
            <form method="POST" className="space-y-3">
              <input type="hidden" name="intent" value="inquiry" />
              <input type="hidden" name="productName" value={product.name} />
              <input type="hidden" name="productBrand" value={product.brand} />

              <div>
                <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-1">
                  Full Name *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-1">
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-1">
                  Phone (optional)
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-1">
                  Message (optional)
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Any questions or specific requirements..."
                  className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-sm text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors"
                >
                  Submit Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(false)}
                  className="px-4 py-3 bg-transparent border border-border text-muted-foreground rounded-sm text-sm hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Fixed bottom actions */}
      {!showInquiryForm && !actionData?.success && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-[#111114]/95 backdrop-blur-md border-t border-border px-4 py-4 space-y-2"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={() => setShowInquiryForm(true)}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-sm text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors"
          >
            {inquiryCtaLabel}
          </button>
          <form method="POST">
            <input type="hidden" name="intent" value="wishlist" />
            <input type="hidden" name="productName" value={product.name} />
            <input type="hidden" name="productBrand" value={product.brand} />
            <input type="hidden" name="productImage" value={product.heroImage || product.images?.[0] || ""} />
            <input type="hidden" name="productPrice" value={product.price} />
            <input type="hidden" name="productCategory" value={product.category} />
            {isAuthenticated ? (
              <button
                type="submit"
                className="w-full py-3 bg-transparent border border-border text-muted-foreground rounded-sm text-sm font-medium hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                {wishlistCtaLabel}
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="w-full py-3 bg-transparent border border-border text-muted-foreground rounded-sm text-sm font-medium hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Sign in to save
              </Link>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

function QuickInfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-lg p-3 border border-border/50">
      <p className="text-[9px] text-muted-foreground tracking-widest uppercase mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
