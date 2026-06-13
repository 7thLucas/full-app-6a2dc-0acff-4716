import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { PageLayout } from "~/components/layout/nav";
import { ProductCard, type ProductCardData } from "~/components/catalog/product-card";
import { useConfigurables } from "~/modules/configurables";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { ChevronRight, Watch, Briefcase } from "lucide-react";

type LoaderData = {
  featuredProducts: ProductCardData[];
  newArrivals: ProductCardData[];
  isAuthenticated: boolean;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);

  try {
    const baseUrl = new URL(request.url).origin;
    const [featuredRes, newArrivalsRes] = await Promise.all([
      fetch(`${baseUrl}/api/products/featured?limit=6`),
      fetch(`${baseUrl}/api/products/new-arrivals?limit=4`),
    ]);

    const [featuredData, newArrivalsData] = await Promise.all([
      featuredRes.ok ? featuredRes.json() : { items: [] },
      newArrivalsRes.ok ? newArrivalsRes.json() : { items: [] },
    ]);

    return {
      featuredProducts: featuredData.items ?? [],
      newArrivals: newArrivalsData.items ?? [],
      isAuthenticated: !!user,
    };
  } catch {
    return { featuredProducts: [], newArrivals: [], isAuthenticated: !!user };
  }
}

export default function HomePage() {
  const { featuredProducts, newArrivals, isAuthenticated } = useLoaderData<LoaderData>();
  const { config, loading } = useConfigurables();

  const heroHeading = loading ? "" : (config?.heroHeading ?? "The Art of Timekeeping");
  const heroSubheading = loading
    ? ""
    : (config?.heroSubheading ?? "Curated timepieces and leather goods for those who understand the weight of a well-chosen object.");
  const catalogHeading = loading ? "" : (config?.catalogHeading ?? "The Collection");
  const editorialHeading = loading ? "" : (config?.editorialHeading ?? "From the Maisons");
  const showEditorial = loading ? true : (config?.showEditorialSection ?? true);
  const appName = loading ? "Renard's" : (config?.appName ?? "Renard's");

  return (
    <PageLayout topTransparent className="pt-0">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-end bg-[#5B21B6] overflow-hidden">
        {/* Background image / gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5B21B6]/30 via-[#5B21B6]/20 to-[#3B1A7A]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(${config?.heroImage || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80"})`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 pb-12 pt-24">
          <p className="text-[10px] tracking-[0.3em] text-primary uppercase mb-3">
            {appName}
          </p>
          <h1 className="text-4xl font-serif text-foreground leading-tight mb-4">
            {heroHeading}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs">
            {heroSubheading}
          </p>
          <div className="flex gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-[#800020] text-white px-5 py-2.5 rounded-sm text-sm font-medium tracking-wide hover:bg-[#9A0028] transition-colors"
            >
              Explore Collection
            </Link>
            {!isAuthenticated && (
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 bg-transparent border border-primary text-primary px-5 py-2.5 rounded-sm text-sm font-medium tracking-wide hover:bg-primary/10 transition-colors"
              >
                Join
              </Link>
            )}
          </div>
        </div>

        {/* Divider line */}
        <div className="relative z-10 px-6 pb-0">
          <div className="divider-gold" />
        </div>
      </section>

      {/* Categories quick-nav */}
      <section className="px-4 py-6">
        <div className="flex gap-3">
          <Link
            to="/catalog?category=Watches"
            className="flex-1 flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Watch className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Watches</p>
              <p className="text-[10px] text-muted-foreground">Timepieces</p>
            </div>
          </Link>
          <Link
            to="/catalog?category=Wallets"
            className="flex-1 flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Wallets</p>
              <p className="text-[10px] text-muted-foreground">Leather Goods</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-serif text-foreground">{catalogHeading}</h2>
            <Link
              to="/catalog?featured=true"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              See all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-serif text-foreground">New Arrivals</h2>
            <Link
              to="/catalog?sort=newest"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              See all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Editorial Teaser */}
      {showEditorial && (
        <section className="px-4 pb-8">
          <div className="divider-gold mb-6" />
          <h2 className="text-base font-serif text-foreground mb-4">{editorialHeading}</h2>
          <div className="space-y-3">
            <EditorialCard
              href="/editorial/patek-philippe"
              brand="Patek Philippe"
              headline="The Geneva Seal and What It Demands"
              image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
            />
            <EditorialCard
              href="/editorial/audemars-piguet"
              brand="Audemars Piguet"
              headline="Royal Oak: 50 Years of the Iconoclast"
              image="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80"
            />
          </div>
        </section>
      )}
    </PageLayout>
  );
}

function EditorialCard({
  href,
  brand,
  headline,
  image,
}: {
  href: string;
  brand: string;
  headline: string;
  image: string;
}) {
  return (
    <Link
      to={href}
      className="flex items-center gap-4 bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-200"
    >
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-secondary">
        <img
          src={image}
          alt={brand}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 py-3 pr-4">
        <p className="text-[9px] text-primary tracking-widest uppercase mb-1">{brand}</p>
        <p className="text-sm font-serif text-foreground leading-snug">{headline}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" />
    </Link>
  );
}
