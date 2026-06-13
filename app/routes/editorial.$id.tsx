import { useParams, Link } from "react-router";
import { ChevronLeft, Clock } from "lucide-react";

const EDITORIALS: Record<string, {
  brand: string;
  headline: string;
  subheadline: string;
  image: string;
  readTime: string;
  tags: string[];
  content: string;
}> = {
  "patek-philippe": {
    brand: "Patek Philippe",
    headline: "The Geneva Seal and What It Demands",
    subheadline: "Few watchmaking certifications carry more weight — or require more of the craftsmen who earn it.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90",
    readTime: "5 min read",
    tags: ["Heritage", "Craftsmanship"],
    content: `Founded in 1839, Patek Philippe has never been publicly traded. That independence has allowed the manufacture to make decisions on timescales incomprehensible to any publicly-held competitor — a commitment to quality that compounds over generations.

The Geneva Seal (Poinçon de Genève) is awarded only to watches assembled, cased, and regulated within the Canton of Geneva. It requires finishing standards that most manufacturers cannot economically sustain: bevelled and polished angles on every steel part, mirror-polished recesses, and manually-fitted jewels.

Patek Philippe not only meets the Geneva Seal standard but, in many cases, substantially exceeds it. The Patek Philippe Seal — introduced in 2009 as an internal standard even more demanding than Geneva — evaluates the movement, case, bracelet, and functional performance under conditions that approximate five years of real-world wear.

This is not marketing. It is the consequence of a family business that has, for nearly two centuries, bet its reputation on each piece it releases. The scarcity of Patek Philippe watches in the market is not an artificial constraint — it is the arithmetic of doing things properly.`,
  },
  "audemars-piguet": {
    brand: "Audemars Piguet",
    headline: "Royal Oak: 50 Years of the Iconoclast",
    subheadline: "In 1972, Gérald Genta's overnight sketch changed what luxury watches were allowed to look like.",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&q=90",
    readTime: "6 min read",
    tags: ["History", "Design"],
    content: `The brief was audacious: design a luxury sports watch in steel. In 1972, steel was for tool watches. Luxury was yellow gold and dress dials. Gérald Genta reportedly sketched the Royal Oak — the octagonal bezel, the tapisserie dial, the integrated bracelet — in a single evening.

The octagonal bezel secured by eight visible screws was inspired by the porthole bolts of 19th-century diving helmets. The Grande Tapisserie ("great tapestry") guilloché dial pattern requires individual hand-engraving. The integrated bracelet — seamlessly flowing from the case — required tolerances that challenged the manufactures of 1972 to their limits.

At launch, the Royal Oak was priced higher than many gold watches. It was mocked, dismissed, and then slowly, inexorably, copied. Fifty years later, the Royal Oak has become the reference against which all sports-luxury watches are measured.

It demonstrated that haute horlogerie did not require precious metal — that design intelligence and manufacturing excellence were themselves luxury enough.`,
  },
  "richard-mille": {
    brand: "Richard Mille",
    headline: "Tonneau Cases and the Physics of Exclusivity",
    subheadline: "Why Richard Mille's signature case shape requires individual machining that no two watches share.",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1200&q=90",
    readTime: "4 min read",
    tags: ["Materials", "Engineering"],
    content: `Richard Mille launched in 2001 with a watch that cost more than a Porsche and looked unlike anything that had preceded it. The signature tonneau case — named for the French word for barrel — creates compound curves that cannot be machined in a single pass. Each case requires multiple setups and manual finishing that resists automation.

The materials themselves read like an aerospace parts catalog: grade 5 titanium, NTPT Carbon (a composite used in Formula 1 chassis), cermet (ceramic-metal hybrid), and LITAL alloy developed for the aerospace industry. This is not cosplay — the forces acting on a professional athlete's wrist during competition are orders of magnitude greater than those experienced by a typical watch wearer.

Rafael Nadal has worn RM watches during Grand Slam finals. Felipe Massa wore an RM 011 on his wrist during Formula 1 qualifying sessions. The watches survived. That is the point.

Production is intentionally constrained — the manufacture produces approximately 5,000 watches annually. Each references the technical conviction that luxury, at its most honest, is simply a promise to do things properly regardless of cost.`,
  },
  "hermes": {
    brand: "Hermès",
    headline: "The Leather Is the Message",
    subheadline: "How Hermès turned the tannery into its most strategic competitive advantage.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=90",
    readTime: "5 min read",
    tags: ["Leather", "Heritage"],
    content: `In 1922, Hermès acquired its first tannery. The decision was not made for romantic reasons — it was made because the quality of the leather reaching Paris was inconsistent. Control over the raw material was the only guarantee of the finished product.

Today, Hermès operates the Tanneries du Puy in France, producing leathers unavailable to any other house. The signature Epsom calfskin — with its distinctive fine grain — is created through a proprietary embossing process that took years to perfect. Box calfskin requires extensive polishing to achieve its characteristic mirror finish. Swift leather undergoes a unique treatment that produces an exceptionally soft, lightweight material.

The durability and colour saturation of Hermès leathers is not marketing: it is the direct result of vertical integration that competitors cannot replicate. A Béarn wallet purchased today will, with reasonable care, outlast its owner.

The orange box is not packaging. It is a signal that inside it is something worth protecting.`,
  },
  "bottega-veneta": {
    brand: "Bottega Veneta",
    headline: "When the Lining Is Your Logo",
    subheadline: "The Intrecciato technique requires skills that take years to master — and refuses to be mechanised.",
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=1200&q=90",
    readTime: "4 min read",
    tags: ["Craft", "Design"],
    content: `In 1966, Bottega Veneta was founded in Vicenza with a motto that would define the house: "When your own initials are enough." The Intrecciato weave — the technique of interlacing strips of leather in a diagonal pattern — was developed not as a decorative flourish but as a structural solution.

Strips of calf leather approximately 10mm wide are cut and woven by a single artisan. The resulting piece is stronger than a single-ply equivalent, develops a richer patina with use, and — crucially — cannot be replicated by machine. The three-dimensional geometry created by the weave requires human spatial intelligence to maintain consistency.

Each artisan spends years mastering the technique before being permitted to work on finished goods. The work is measured not in metres per hour but in centimetres. A full-size bag may take days. A wallet, a morning.

The house went through a period of reduced visibility in the early 2010s. The return under Tomas Maier, and then Daniel Lee's appointment in 2018, reaffirmed what the house had always known: the most powerful statement of luxury is restraint. No logo. No monogram. Just work.`,
  },
};

export default function EditorialDetailPage() {
  const { id } = useParams();
  const editorial = id ? EDITORIALS[id] : null;

  if (!editorial) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <p className="text-muted-foreground">This editorial could not be found.</p>
        <Link to="/editorial" className="mt-4 text-primary text-sm hover:underline">
          Return to Editorial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Back button */}
      <div className="fixed top-0 left-0 right-0 z-40 px-4 h-14 flex items-center"
        style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <Link
          to="/editorial"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Hero image */}
      <div className="relative h-64 bg-secondary">
        <img
          src={editorial.image}
          alt={editorial.headline}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#3B1A7A]" />
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-20">
        {/* Meta */}
        <p className="text-[9px] text-primary tracking-widest uppercase mb-2">
          {editorial.brand}
        </p>
        <h1 className="text-2xl font-serif text-foreground leading-tight mb-3">
          {editorial.headline}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {editorial.subheadline}
        </p>

        {/* Tags + read time */}
        <div className="flex items-center gap-3 mb-6">
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
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {editorial.readTime}
          </div>
        </div>

        <div className="divider-gold mb-6" />

        {/* Body text */}
        <div className="space-y-4">
          {editorial.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-sm text-foreground/90 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="divider-gold mt-8 mb-6" />

        {/* CTA */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-4">Explore the collection</p>
          <Link
            to={`/catalog?brand=${editorial.brand}`}
            className="inline-flex items-center gap-2 bg-[#800020] text-white px-5 py-2.5 rounded-sm text-sm font-medium tracking-wide hover:bg-[#9A0028] transition-colors"
          >
            View {editorial.brand} Pieces
          </Link>
        </div>
      </div>
    </div>
  );
}
