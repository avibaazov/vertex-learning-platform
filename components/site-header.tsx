import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Icon, VertexLogo } from "@/components/icons";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="text">Sign in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="primary">Sign up</Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
      </Show>
    </>
  );
}

const NAV = [
  { key: "courses", label: "Courses", href: "/" },
  { key: "learning", label: "My Learning", href: "#" },
] as const;

export function SiteHeader({
  active,
}: {
  active?: "courses" | "learning";
}) {
  return (
    <header className="border-b border-neutral-200 bg-[#F7F4F1]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href="/" aria-label="Vertex home">
            <VertexLogo />
          </Link>
          <nav className="hidden items-center gap-8 text-body font-medium sm:flex">
            {NAV.map((item) => {
              const isActive = item.key === active;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-neutral-900"
                      : "text-neutral-700 hover:text-neutral-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="text-neutral-700 transition-colors hover:text-neutral-900"
          >
            <Icon name="bell" size={22} />
          </button>
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
