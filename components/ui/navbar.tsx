import { cn } from "@/lib/cn";
import { VertexLogo } from "@/components/icons";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export function Navbar({
  items = [
    { label: "Courses", href: "#", active: true },
    { label: "My Learning", href: "#" },
  ],
  className,
}: {
  items?: NavItem[];
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex h-16 items-center gap-8 rounded-lg border border-neutral-200 bg-white px-6",
        className,
      )}
    >
      <a href="#" aria-label="Vertex home">
        <VertexLogo />
      </a>
      <nav className="flex items-center gap-6 text-body font-medium">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "relative py-1 transition-colors",
              item.active
                ? "text-primary-500 after:absolute after:-bottom-[21px] after:left-0 after:h-0.5 after:w-full after:bg-primary-500"
                : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
