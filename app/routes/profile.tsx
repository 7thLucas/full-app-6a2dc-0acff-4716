import { useLoaderData, Link, Form } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { PageLayout } from "~/components/layout/nav";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { LogOut, ChevronRight, User, Lock, Mail, Heart, MessageSquare } from "lucide-react";

type LoaderData = {
  isAuthenticated: boolean;
  username?: string;
  email?: string;
  userId?: string;
  inquiryCount: number;
  collectionCount: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return { isAuthenticated: false, inquiryCount: 0, collectionCount: 0 };

  const baseUrl = new URL(request.url).origin;
  let inquiryCount = 0;
  let collectionCount = 0;

  try {
    const [inquiriesRes, collectionRes] = await Promise.all([
      fetch(`${baseUrl}/api/inquiries/user/${user.id}`),
      fetch(`${baseUrl}/api/collection/${user.id}`),
    ]);
    const [inquiriesData, collectionData] = await Promise.all([
      inquiriesRes.ok ? inquiriesRes.json() : { items: [] },
      collectionRes.ok ? collectionRes.json() : { items: [] },
    ]);
    inquiryCount = inquiriesData.items?.length ?? 0;
    collectionCount = collectionData.items?.length ?? 0;
  } catch {
    // Non-critical
  }

  return {
    isAuthenticated: true,
    username: user.username,
    email: user.email,
    userId: user.id,
    inquiryCount,
    collectionCount,
  };
}

export default function ProfilePage() {
  const { isAuthenticated, username, email, inquiryCount, collectionCount } =
    useLoaderData<LoaderData>();
  const { config, loading } = useConfigurables();
  const appName = loading ? "Renard's" : (config?.appName ?? "Renard's");
  const tagline = loading ? "Rare. Restrained. Yours." : (config?.tagline ?? "Rare. Restrained. Yours.");
  const footerText = loading ? "" : (config?.footerText ?? "");

  if (!isAuthenticated) {
    return (
      <PageLayout title="Profile">
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-6">
            <User className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-serif text-foreground mb-2">Welcome to {appName}</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
            {tagline}
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

  return (
    <PageLayout title="Profile">
      <div className="px-4 pt-4 pb-6 space-y-6">
        {/* User avatar/info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-serif text-primary">
              {(username ?? email ?? "U")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-serif text-foreground">
              {username ?? "Member"}
            </h2>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/collection?tab=all"
            className="bg-card rounded-lg p-3 border border-border/50 text-center hover:border-primary/30 transition-colors"
          >
            <p className="text-2xl font-serif text-primary">{collectionCount}</p>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Collection</p>
          </Link>
          <div className="bg-card rounded-lg p-3 border border-border/50 text-center">
            <p className="text-2xl font-serif text-primary">{inquiryCount}</p>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Inquiries</p>
          </div>
        </div>

        <div className="divider-gold" />

        {/* Menu */}
        <div className="space-y-1">
          <ProfileMenuItem
            href="/collection"
            icon={Heart}
            label="My Collection"
            description="Wishlist and owned pieces"
          />
          <ProfileMenuItem
            href="/catalog"
            icon={MessageSquare}
            label="Browse Catalog"
            description="Explore all available pieces"
          />
        </div>

        <div className="divider-gold" />

        {/* Account */}
        <div className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">Email</p>
              <p className="text-[11px] text-muted-foreground">{email}</p>
            </div>
          </div>
          <ProfileMenuItem
            href="/auth/forgot-password"
            icon={Lock}
            label="Change Password"
            description="Update your account password"
          />
        </div>

        <div className="divider-gold" />

        {/* Sign out */}
        <Form method="POST" action="/auth/logout">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left hover:bg-muted/30 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-3.5 h-3.5 text-destructive" />
            </div>
            <span className="text-sm text-destructive font-medium">Sign Out</span>
          </button>
        </Form>

        {/* Footer */}
        {footerText && (
          <p className="text-[10px] text-muted-foreground/50 text-center pt-2">{footerText}</p>
        )}
      </div>
    </PageLayout>
  );
}

function ProfileMenuItem({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/30 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </Link>
  );
}
