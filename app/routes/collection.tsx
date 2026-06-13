import { useLoaderData, Link, useActionData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useState } from "react";
import { PageLayout } from "~/components/layout/nav";
import { useConfigurables } from "~/modules/configurables";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { Heart, Bookmark, Trash2, ChevronRight, Lock } from "lucide-react";
import { cn } from "~/lib/utils";

type CollectionItem = {
  _id: string;
  productId: string;
  productName: string;
  productBrand: string;
  productImage?: string;
  productPrice?: number;
  productCategory?: string;
  type: "owned" | "wishlist";
  notes?: string;
  createdAt: string;
};

type LoaderData = {
  items: CollectionItem[];
  isAuthenticated: boolean;
  userId: string | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return { items: [], isAuthenticated: false, userId: null };

  const baseUrl = new URL(request.url).origin;
  try {
    const res = await fetch(`${baseUrl}/api/collection/${user.id}`);
    const data = res.ok ? await res.json() : { items: [] };
    return { items: data.items ?? [], isAuthenticated: true, userId: user.id };
  } catch {
    return { items: [], isAuthenticated: true, userId: user.id };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return { error: "Not authenticated" };

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "remove") {
    const baseUrl = new URL(request.url).origin;
    const productId = formData.get("productId");
    const type = formData.get("type");
    await fetch(`${baseUrl}/api/collection/${user.id}/${productId}?type=${type}`, {
      method: "DELETE",
    });
    return { success: true };
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

export default function CollectionPage() {
  const { items, isAuthenticated } = useLoaderData<LoaderData>();
  const { config, loading } = useConfigurables();
  const [activeTab, setActiveTab] = useState<"all" | "wishlist" | "owned">("all");

  const showWishlist = loading ? true : (config?.showWishlistFeature ?? true);

  if (!isAuthenticated) {
    return (
      <PageLayout title="My Collection">
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-serif text-foreground mb-2">Your Private Vault</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
            Sign in to save pieces to your wishlist and track your owned collection in one private vault.
          </p>
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 bg-[#800020] text-white px-6 py-3 rounded-sm text-sm font-medium tracking-wide hover:bg-[#9A0028] transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/auth/register"
            className="mt-3 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Create an account
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (!showWishlist) {
    return (
      <PageLayout title="My Collection">
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-muted-foreground text-sm">Collection feature coming soon.</p>
        </div>
      </PageLayout>
    );
  }

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => item.type === activeTab);

  const wishlistCount = items.filter((i) => i.type === "wishlist").length;
  const ownedCount = items.filter((i) => i.type === "owned").length;

  return (
    <PageLayout title="My Collection">
      {/* Summary stats */}
      <div className="px-4 pt-2 pb-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card rounded-lg p-3 border border-border/50 text-center">
            <p className="text-2xl font-serif text-primary">{wishlistCount}</p>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Wishlisted</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border/50 text-center">
            <p className="text-2xl font-serif text-primary">{ownedCount}</p>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Owned</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(["all", "wishlist", "owned"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 rounded-md text-xs font-medium tracking-wide capitalize transition-all duration-150",
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "all" ? "All" : tab === "wishlist" ? "Wishlist" : "Owned"}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-4">
            {activeTab === "owned" ? (
              <Bookmark className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Heart className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {activeTab === "wishlist"
              ? "Your wishlist is empty."
              : activeTab === "owned"
              ? "No owned pieces logged yet."
              : "Your collection is empty."}
          </p>
          <Link
            to="/catalog"
            className="flex items-center gap-1 text-primary text-sm hover:underline"
          >
            Explore the catalog <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-2 pb-4">
          {filteredItems.map((item) => (
            <CollectionItemRow key={item._id} item={item} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

function CollectionItemRow({ item }: { item: CollectionItem }) {
  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-lg overflow-hidden">
      {/* Image */}
      <Link to={`/products/${item.productId}`} className="w-20 h-20 flex-shrink-0 bg-secondary overflow-hidden">
        {item.productImage ? (
          <img
            src={item.productImage}
            alt={item.productName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
      </Link>

      {/* Info */}
      <Link to={`/products/${item.productId}`} className="flex-1 py-3">
        <p className="text-[9px] text-primary tracking-widest uppercase mb-0.5">
          {item.productBrand}
        </p>
        <p className="text-sm font-serif text-foreground leading-snug line-clamp-2">
          {item.productName}
        </p>
        {item.productPrice && (
          <p className="text-xs text-muted-foreground mt-1">{formatPrice(item.productPrice)}</p>
        )}
      </Link>

      {/* Type badge + remove */}
      <div className="flex flex-col items-end gap-2 pr-3">
        <span
          className={cn(
            "px-2 py-0.5 rounded-sm text-[8px] font-medium tracking-widest uppercase",
            item.type === "wishlist"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-muted text-muted-foreground border border-border"
          )}
        >
          {item.type === "wishlist" ? "Wishlist" : "Owned"}
        </span>
        <form method="POST">
          <input type="hidden" name="intent" value="remove" />
          <input type="hidden" name="productId" value={item.productId} />
          <input type="hidden" name="type" value={item.type} />
          <button
            type="submit"
            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
