import { Link } from "react-router";
import { PageLayout } from "~/components/layout/nav";
import { useConfigurables } from "~/modules/configurables";
import { ChevronRight } from "lucide-react";

const EDITORIALS = [
  {
    id: "patek-philippe",
    brand: "Patek Philippe",
    headline: "The Geneva Seal and What It Demands",
    subheadline: "Few watchmaking certifications carry more weight — or require more of the craftsmen who earn it.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    readTime: "5 min read",
    tags: ["Heritage", "Craftsmanship"],
    content: `Founded in 1839, Patek Philippe has never been publicly traded. That independence has allowed the manufacture to make decisions on timescales incomprehensible to any publicly-held competitor — a commitment to quality that compounds over generations.\n\nThe Geneva Seal (Poinçon de Genève) is awarded only to watches assembled, cased, and regulated within the Canton of Geneva. It requires finishing standards that most manufacturers cannot economically sustain: bevelled and polished angles on every steel part, mirror-polished recesses, and manually-fitted jewels. Patek Philippe not only meets the Geneva Seal standard but, in many cases, substantially exceeds it.`,
  },
  {
    id: "audemars-piguet",
    brand: "Audemars Piguet",
    headline: "Royal Oak: 50 Years of the Iconoclast",
    subheadline: "In 1972, Gérald Genta's overnight sketch changed what luxury watches were allowed to look like.",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
    readTime: "6 min read",
    tags: ["History", "Design"],
    content: `The brief was audacious: design a luxury sports watch in steel. In 1972, steel was for tool watches. Luxury was yellow gold and dress dials. Gérald Genta reportedly sketched the Royal Oak — the octagonal bezel, the tapisserie dial, the integrated bracelet — in a single evening.\n\nFifty years later, the Royal Oak has become the reference against which all sports-luxury watches are measured. It demonstrated that haute horlogerie did not require precious metal — that design intelligence and manufacturing excellence were themselves luxury enough.`,
  },
  {
    id: "richard-mille",
    brand: "Richard Mille",
    headline: "Tonneau Cases and the Physics of Exclusivity",
    subheadline: "Why Richard Mille's signature case shape requires individual machining that no two watches share.",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80",
    readTime: "4 min read",
    tags: ["Materials", "Engineering"],
    content: `Richard Mille launched in 2001 with a watch that cost more than a Porsche and looked unlike anything that had preceded it. The signature tonneau case — named for the French word for barrel — creates compound curves that cannot be machined in a single pass. Each case requires multiple setups and manual finishing that resists automation.\n\nThe materials themselves read like an aerospace parts catalog: grade 5 titanium, NTPT carbon, cermet, and LITAL alloy developed for fighter jet components. This is not cosplay — the forces acting on a professional athlete's wrist during competition are orders of magnitude greater than those experienced by a typical watch wearer.`,
  },
  {
    id: "hermes",
    brand: "Hermès",
    headline: "The Leather Is the Message",
    subheadline: "How Hermès turned the tannery into its most strategic competitive advantage.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    readTime: "5 min read",
    tags: ["Leather", "Heritage"],
    content: `In 1922, Hermès acquired its first tannery. The decision was not made for romantic reasons — it was made because the quality of the leather reaching Paris was inconsistent. Control over the raw material was the only guarantee of the finished product.\n\nToday, Hermès operates the Tanneries du Puy in France, producing leathers unavailable to any other house. The signature Epsom calfskin — with its distinctive fine grain — is created through a proprietary embossing process that took years to perfect. The durability and colour saturation of Hermès leathers is not marketing: it is the direct result of vertical integration that competitors cannot replicate.`,
  },
  {
    id: "bottega-veneta",
    brand: "Bottega Veneta",
    headline: "When the Lining Is Your Logo",
    subheadline: "The Intrecciato technique requires skills that take years to master — and refuses to be mechanised.",
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80",
    readTime: "4 min read",
    tags: ["Craft", "Design"],
    content: `In 1966, Bottega Veneta was founded in Vicenza with a motto that would define the house: "When your own initials are enough." The Intrecciato weave — the technique of interlacing strips of leather in a diagonal pattern — was developed not as a decorative flourish but as a structural solution.\n\nStrips of calf leather approximately 10mm wide are cut and woven by a single artisan. The resulting piece is stronger than a single-ply equivalent, develops a richer patina, and — crucially — cannot be replicated by machine. Each artisan spends years mastering the technique; the work is measured not in metres per hour but in centimetres.`,
  },
];

export default function EditorialPage() {
  const { config, loading } = useConfigurables();
  const heading = loading ? "" : (config?.editorialHeading ?? "From the Maisons");
  const showEditorial = loading ? true : (config?.showEditorialSection ?? true);

  if (!showEditorial) {
    return (
      <PageLayout title="Editorial">
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-muted-foreground text-sm">Editorial content coming soon.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={heading}>
      <div className="px-4 pt-2 pb-6">
        <p className="text-xs text-muted-foreground mb-6">
          Stories from the world's most storied maisons.
        </p>

        {/* Featured editorial */}
        <div className="mb-6">
          <EditorialHeroCard editorial={EDITORIALS[0]} />
        </div>

        {/* Rest */}
        <div className="space-y-3">
          {EDITORIALS.slice(1).map((editorial) => (
            <EditorialRowCard key={editorial.id} editorial={editorial} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

function EditorialHeroCard({ editorial }: { editorial: typeof EDITORIALS[0] }) {
  return (
    <Link
      to={`/editorial/${editorial.id}`}
      className="block bg-card rounded-lg overflow-hidden border-gold-shimmer group"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={editorial.image}
          alt={editorial.headline}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[9px] text-primary tracking-widest uppercase mb-1">
            {editorial.brand}
          </p>
          <h2 className="text-lg font-serif text-foreground leading-tight">
            {editorial.headline}
          </h2>
        </div>
      </div>
      <div className="p-4 pt-3">
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {editorial.subheadline}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {editorial.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-sm text-[9px] font-medium tracking-widest uppercase bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">{editorial.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

function EditorialRowCard({ editorial }: { editorial: typeof EDITORIALS[0] }) {
  return (
    <Link
      to={`/editorial/${editorial.id}`}
      className="flex items-center gap-4 bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-200"
    >
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-secondary">
        <img
          src={editorial.image}
          alt={editorial.brand}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 py-3 pr-2">
        <p className="text-[9px] text-primary tracking-widest uppercase mb-1">
          {editorial.brand}
        </p>
        <p className="text-sm font-serif text-foreground leading-snug mb-1">
          {editorial.headline}
        </p>
        <p className="text-[10px] text-muted-foreground">{editorial.readTime}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" />
    </Link>
  );
}
