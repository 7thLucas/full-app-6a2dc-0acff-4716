import { useLoaderData, useSearchParams, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { PageLayout } from "~/components/layout/nav";
import { ProductCard, type ProductCardData } from "~/components/catalog/product-card";
import { useConfigurables } from "~/modules/configurables";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

type LoaderData = {
  products: ProductCardData[];
  total: number;
  page: number;
  totalPages: number;
  brands: string[];
  categories: string[];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = url.origin;
  const params = new URLSearchParams({
    category: url.searchParams.get("category") || "",
    brand: url.searchParams.get("brand") || "",
    minPrice: url.searchParams.get("minPrice") || "",
    maxPrice: url.searchParams.get("maxPrice") || "",
    sort: url.searchParams.get("sort") || "newest",
    page: url.searchParams.get("page") || "1",
    limit: "12",
    search: url.searchParams.get("search_query") || "",
    featured: url.searchParams.get("featured") || "",
  });

  // Remove empty params
  for (const [key, value] of Array.from(params.entries())) {
    if (!value) params.delete(key);
  }

  try {
    const [productsRes, metaRes] = await Promise.all([
      fetch(`${baseUrl}/api/products?${params.toString()}`),
      fetch(`${baseUrl}/api/products/meta`),
    ]);

    const [productsData, metaData] = await Promise.all([
      productsRes.ok ? productsRes.json() : { items: [], total: 0, page: 1, totalPages: 0 },
      metaRes.ok ? metaRes.json() : { brands: [], categories: [] },
    ]);

    return {
      products: productsData.items ?? [],
      total: productsData.total ?? 0,
      page: productsData.page ?? 1,
      totalPages: productsData.totalPages ?? 0,
      brands: metaData.brands ?? [],
      categories: metaData.categories ?? [],
    };
  } catch {
    return { products: [], total: 0, page: 1, totalPages: 0, brands: [], categories: [] };
  }
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function CatalogPage() {
  const { products, total, brands, categories } = useLoaderData<LoaderData>();
  const { config, loading } = useConfigurables();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search_query") ?? "");

  const catalogHeading = loading ? "" : (config?.catalogHeading ?? "The Collection");

  const activeCategory = searchParams.get("category") ?? "";
  const activeBrand = searchParams.get("brand") ?? "";
  const activeSort = searchParams.get("sort") ?? "newest";
  const isFeatured = searchParams.get("featured") === "true";

  const hasActiveFilters = !!(activeCategory || activeBrand || isFeatured || searchParams.get("search_query"));

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // reset pagination
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams({ sort: activeSort }));
    setSearchInput("");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("search_query", searchInput);
  }

  return (
    <PageLayout title={catalogHeading} showSearch={false}>
      {/* Search + Filter bar */}
      <div className="px-4 pt-2 pb-4 space-y-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search brands, models..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter/Sort controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-medium transition-colors",
              showFilters || hasActiveFilters
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            <SlidersHorizontal className="w-3 h-3" />
            Filters
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
            )}
          </button>

          {/* Sort */}
          <div className="relative flex-1">
            <select
              value={activeSort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="w-full appearance-none bg-input border border-border rounded-sm pl-3 pr-8 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="space-y-3 p-3 bg-card rounded-lg border border-border fade-in-up">
            {/* Categories */}
            <div>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All"
                  active={!activeCategory}
                  onClick={() => updateFilter("category", "")}
                />
                {categories.map((cat) => (
                  <FilterChip
                    key={cat}
                    label={cat}
                    active={activeCategory === cat}
                    onClick={() => updateFilter("category", activeCategory === cat ? "" : cat)}
                  />
                ))}
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">
                  Brand
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All"
                    active={!activeBrand}
                    onClick={() => updateFilter("brand", "")}
                  />
                  {brands.map((brand) => (
                    <FilterChip
                      key={brand}
                      label={brand}
                      active={activeBrand === brand}
                      onClick={() => updateFilter("brand", activeBrand === brand ? "" : brand)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Featured toggle */}
            <div>
              <FilterChip
                label="Featured only"
                active={isFeatured}
                onClick={() => updateFilter("featured", isFeatured ? "" : "true")}
              />
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-xs text-muted-foreground">
          {total} {total === 1 ? "piece" : "pieces"} found
        </p>
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-muted-foreground text-sm">No pieces found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-primary text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-2 gap-3 pb-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-sm text-xs font-medium border transition-all duration-150",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
