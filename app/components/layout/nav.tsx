import { Link, useLocation } from "react-router";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";
import { Search, Heart, User, Grid2X2, BookOpen, Home } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/catalog", label: "Catalog", icon: Grid2X2 },
  { href: "/editorial", label: "Editorial", icon: BookOpen },
  { href: "/collection", label: "Collection", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const { config } = useConfigurables();

  const goldColor = config?.brandColor?.primary ?? "#C9A96E";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#111114] border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[52px] transition-all duration-200",
                isActive ? "opacity-100" : "opacity-40"
              )}
            >
              <span
                className="w-5 h-5 flex items-center justify-center"
                style={isActive ? { color: goldColor } : undefined}
              >
                <Icon className="w-5 h-5" />
              </span>
              {isActive && (
                <span
                  className="text-[9px] font-medium tracking-widest uppercase"
                  style={{ color: goldColor }}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar({
  title,
  showSearch = false,
  transparent = false,
}: {
  title?: string;
  showSearch?: boolean;
  transparent?: boolean;
}) {
  const { config } = useConfigurables();
  const appName = config?.appName ?? "Sylph";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14",
        transparent
          ? "bg-transparent"
          : "bg-[#111114]/90 backdrop-blur-md border-b border-border/50"
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex-1">
        {title ? (
          <h1 className="text-sm font-serif tracking-widest uppercase text-foreground/80">
            {title}
          </h1>
        ) : (
          <span className="text-lg font-serif tracking-[0.2em] text-foreground">
            {appName}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {showSearch && (
          <Link
            to="/catalog?search=true"
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>
        )}
      </div>
    </header>
  );
}

export function PageLayout({
  children,
  title,
  showSearch = false,
  topTransparent = false,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  topTransparent?: boolean;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar title={title} showSearch={showSearch} transparent={topTransparent} />
      <main
        className={cn(
          "pt-14 pb-24",
          className
        )}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
