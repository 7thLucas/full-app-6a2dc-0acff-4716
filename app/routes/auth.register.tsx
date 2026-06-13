import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { RegisterCard } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const user = await AuthService.register({
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({
      sub: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
      email_verified: user.email_verified ?? false,
    });
    return redirect("/", { headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return { error: message };
  }
}

export default function RegisterRoute() {
  const { config } = useConfigurables();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-serif text-foreground tracking-wider">
          {config?.appName ?? "Renard's"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{config?.tagline ?? "Rare. Restrained. Yours."}</p>
      </div>
      <div className="w-full max-w-sm">
        <RegisterCard />
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Already have an account?{" "}
        <a href="/auth/login" className="text-primary hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
