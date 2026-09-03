import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, VertexLogo, type IconName } from "@/components/icons";
import {
  Badge,
  Breadcrumbs,
  Button,
  type ButtonVariant,
  CourseCard,
  Input,
  Kbd,
  LessonCard,
  Navbar,
  Pagination,
  ProgressBar,
  ResourceCard,
  Select,
  StatusIndicator,
  VideoLessonCard,
} from "@/components/ui";

/* ============================================================
   Showcase chrome
   ============================================================ */

function Panel({
  n,
  title,
  children,
  className,
}: {
  n: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8",
        className,
      )}
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="text-body font-semibold text-primary-500">{n}</span>
        <h2 className="text-small font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Subhead({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-body font-medium text-neutral-700">{children}</p>
  );
}

/* ============================================================
   01 · Colors
   ============================================================ */

const primaryScale = [
  { name: "Primary 500", hex: "#F97316" },
  { name: "Primary 400", hex: "#FB923C" },
  { name: "Primary 300", hex: "#FDBA74" },
  { name: "Primary 200", hex: "#FED7AA" },
  { name: "Primary 100", hex: "#FFEEE5" },
];

const neutralScale = [
  { name: "Neutral 900", hex: "#0F172A" },
  { name: "Neutral 700", hex: "#334155" },
  { name: "Neutral 500", hex: "#64748B" },
  { name: "Neutral 300", hex: "#CBD5E1" },
  { name: "Neutral 200", hex: "#E2E8F0" },
  { name: "Neutral 100", hex: "#F1F5F9" },
  { name: "Neutral 50", hex: "#FAFAFC" },
  { name: "White", hex: "#FFFFFF" },
];

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div>
      <div
        className="h-20 w-full rounded-md border border-neutral-200"
        style={{ background: hex }}
      />
      <p className="mt-2 text-body font-medium text-neutral-900">{name}</p>
      <p className="text-small tabular-nums text-neutral-500">{hex}</p>
    </div>
  );
}

function Colors() {
  return (
    <Panel n="01" title="Colors">
      <Subhead>Primary</Subhead>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {primaryScale.map((c) => (
          <Swatch key={c.name} {...c} />
        ))}
      </div>
      <div className="mt-8">
        <Subhead>Neutral</Subhead>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {neutralScale.map((c) => (
            <Swatch key={c.name} {...c} />
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================
   02 · Typography  &  03 · Type scale
   ============================================================ */

function Typography() {
  return (
    <Panel n="02" title="Typography">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex items-center gap-6">
          <span className="font-display text-[72px] leading-none text-neutral-900">
            Ag
          </span>
          <div>
            <p className="text-heading-3 font-medium text-neutral-900">
              Playfair Display
            </p>
            <p className="text-body text-neutral-500">
              Elegant · Readable · Timeless
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[72px] font-semibold leading-none text-neutral-900">
            Ag
          </span>
          <div>
            <p className="text-heading-3 font-medium text-neutral-900">Inter</p>
            <p className="text-body text-neutral-500">
              Clean · Modern · Highly legible
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

const typeScale: {
  style: string;
  className: string;
  font: string;
  size: string;
  weight: string;
  use: string;
}[] = [
  {
    style: "Display 1",
    className: "font-display text-display-1",
    font: "Playfair Display",
    size: "48 / 56",
    weight: "Bold",
    use: "Page titles",
  },
  {
    style: "Display 2",
    className: "font-display text-display-2",
    font: "Playfair Display",
    size: "36 / 44",
    weight: "Bold",
    use: "Section titles",
  },
  {
    style: "Heading 1",
    className: "text-heading-1",
    font: "Inter",
    size: "28 / 36",
    weight: "Semi Bold",
    use: "Card titles",
  },
  {
    style: "Heading 2",
    className: "text-heading-2",
    font: "Inter",
    size: "22 / 30",
    weight: "Semi Bold",
    use: "Sub section",
  },
  {
    style: "Heading 3",
    className: "text-heading-3",
    font: "Inter",
    size: "18 / 26",
    weight: "Medium",
    use: "Small titles",
  },
  {
    style: "Body Large",
    className: "text-body-lg",
    font: "Inter",
    size: "16 / 24",
    weight: "Regular",
    use: "Body copy",
  },
  {
    style: "Body",
    className: "text-body",
    font: "Inter",
    size: "14 / 20",
    weight: "Regular",
    use: "Supporting text",
  },
  {
    style: "Small",
    className: "text-small",
    font: "Inter",
    size: "12 / 16",
    weight: "Regular",
    use: "Captions, meta",
  },
];

function TypeScale() {
  return (
    <Panel n="03" title="Type Scale">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-200 text-small font-semibold uppercase tracking-wide text-neutral-500">
              <th className="py-2 pr-4 font-semibold">Style</th>
              <th className="py-2 pr-4 font-semibold">Font</th>
              <th className="py-2 pr-4 font-semibold">Size / Line height</th>
              <th className="py-2 pr-4 font-semibold">Weight</th>
              <th className="py-2 font-semibold">Use</th>
            </tr>
          </thead>
          <tbody>
            {typeScale.map((row) => (
              <tr
                key={row.style}
                className="border-b border-neutral-100 align-middle"
              >
                <td className="py-3 pr-4">
                  <span
                    className={cn(
                      "whitespace-nowrap text-neutral-900",
                      row.className,
                    )}
                  >
                    {row.style}
                  </span>
                </td>
                <td className="py-3 pr-4 text-body text-neutral-500">
                  {row.font}
                </td>
                <td className="py-3 pr-4 text-body tabular-nums text-neutral-500">
                  {row.size}
                </td>
                <td className="py-3 pr-4 text-body text-neutral-500">
                  {row.weight}
                </td>
                <td className="py-3 text-body text-neutral-500">{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ============================================================
   04 · Spacing
   ============================================================ */

const spacing = [
  { px: 4, rem: "0.25rem" },
  { px: 8, rem: "0.5rem" },
  { px: 12, rem: "0.75rem" },
  { px: 16, rem: "1rem" },
  { px: 24, rem: "1.5rem" },
  { px: 32, rem: "2rem" },
  { px: 40, rem: "2.5rem" },
  { px: 48, rem: "3rem" },
  { px: 64, rem: "4rem" },
];

function Spacing() {
  return (
    <Panel n="04" title="Spacing System">
      <Subhead>Base unit: 4px</Subhead>
      <div className="flex flex-wrap items-end gap-6">
        {spacing.map((s) => (
          <div key={s.px} className="flex flex-col items-center gap-2">
            <div
              className="rounded-xs bg-primary-200"
              style={{ width: s.px, height: s.px }}
            />
            <div className="text-center">
              <p className="text-body font-medium tabular-nums text-neutral-900">
                {s.px}
              </p>
              <p className="text-small tabular-nums text-neutral-500">
                ({s.rem})
              </p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ============================================================
   05 · Radius & Shadows
   ============================================================ */

const radii = [
  { label: "4px", name: "xs", radius: "4px" },
  { label: "8px", name: "sm", radius: "8px" },
  { label: "12px", name: "md", radius: "12px" },
  { label: "16px", name: "lg", radius: "16px" },
  { label: "24px", name: "xl", radius: "24px" },
  { label: "Full", name: "circle", radius: "9999px" },
];

const shadows = [
  { name: "Sm", value: "0 1px 2px 0 rgba(15, 23, 42, 0.05)" },
  { name: "Md", value: "0 4px 12px -2px rgba(15, 23, 42, 0.08)" },
  { name: "Lg", value: "0 12px 24px -4px rgba(15, 23, 42, 0.10)" },
  { name: "Xl", value: "0 20px 40px -8px rgba(15, 23, 42, 0.12)" },
];

function RadiusShadows() {
  return (
    <Panel n="05" title="Radius & Shadows">
      <Subhead>Radius</Subhead>
      <div className="flex flex-wrap gap-6">
        {radii.map((r) => (
          <div key={r.name} className="flex flex-col items-center gap-2">
            <div
              className="h-16 w-16 border border-neutral-200 bg-neutral-50"
              style={{ borderRadius: r.radius }}
            />
            <div className="text-center">
              <p className="text-body font-medium tabular-nums text-neutral-900">
                {r.label}
              </p>
              <p className="text-small text-neutral-500">({r.name})</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Subhead>Shadows</Subhead>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shadows.map((s) => (
            <div
              key={s.name}
              className="rounded-md border border-neutral-100 bg-white p-4"
              style={{ boxShadow: s.value }}
            >
              <p className="text-body font-semibold text-neutral-900">
                {s.name}
              </p>
              <p className="mt-1 text-small text-neutral-500">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================
   06 · Icons
   ============================================================ */

const iconRow: IconName[] = [
  "bell",
  "search",
  "play-circle",
  "file",
  "bookmark",
  "chart",
  "clock",
  "user",
  "chevron-right",
];

function Icons() {
  return (
    <Panel n="06" title="Icons">
      <Subhead>Outline style</Subhead>
      <div className="flex flex-wrap gap-5 text-neutral-700">
        {iconRow.map((name) => (
          <Icon key={name} name={name} />
        ))}
      </div>
      <div className="mt-6">
        <Subhead>Filled style</Subhead>
        <div className="flex flex-wrap gap-5 text-neutral-900">
          {iconRow.map((name) => (
            <Icon key={name} name={name} variant="filled" />
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-1.5 text-body text-neutral-500">
        <p className="mb-1 text-body font-medium text-neutral-700">Icon specs</p>
        <p>· 24 × 24px grid</p>
        <p>· 2px stroke width (outline)</p>
        <p>· Rounded line caps</p>
        <p>· Consistent optical balance</p>
      </div>
    </Panel>
  );
}

/* ============================================================
   07 · Buttons
   ============================================================ */

const buttonCols: {
  variant: ButtonVariant;
  label: string;
  icon?: IconName;
  hover: string;
}[] = [
  { variant: "primary", label: "Get Started", hover: "bg-primary-400" },
  { variant: "secondary", label: "Explore Courses", hover: "bg-primary-100" },
  {
    variant: "tertiary",
    label: "View Lesson",
    icon: "external-link",
    hover: "bg-primary-100 text-primary-400",
  },
  {
    variant: "text",
    label: "Watch Video",
    icon: "play",
    hover: "text-primary-400",
  },
];

function ButtonCell({
  col,
  state,
}: {
  col: (typeof buttonCols)[number];
  state: "default" | "hover" | "disabled";
}) {
  return (
    <Button
      variant={col.variant}
      disabled={state === "disabled"}
      className={state === "hover" ? col.hover : undefined}
    >
      {col.label}
      {col.icon && <Icon name={col.icon} size={16} />}
    </Button>
  );
}

function Buttons() {
  return (
    <Panel n="07" title="Buttons">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-small font-semibold uppercase tracking-wide text-neutral-500">
              <th className="w-24" />
              {buttonCols.map((c) => (
                <th key={c.variant} className="px-3 pb-3 text-left font-semibold">
                  {c.variant}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["default", "hover", "disabled"] as const).map((state) => (
              <tr key={state}>
                <td className="py-3 pr-3 text-body capitalize text-neutral-500">
                  {state}
                </td>
                {buttonCols.map((col) => (
                  <td key={col.variant} className="px-3 py-3">
                    <ButtonCell col={col} state={state} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-1.5 text-body text-neutral-500">
        <p className="mb-1 text-body font-medium text-neutral-700">
          Button specs
        </p>
        <p>· Height: 44px (default)</p>
        <p>· Padding: 0 16px (lg), 0 12px (md)</p>
        <p>· Radius: 12px</p>
        <p>· Font: Inter Medium (14–16px)</p>
      </div>
    </Panel>
  );
}

/* ============================================================
   08 · Inputs
   ============================================================ */

function Inputs() {
  return (
    <Panel n="08" title="Inputs">
      <div className="grid gap-6 sm:max-w-md">
        <div>
          <Subhead>Search / text input</Subhead>
          <Input
            placeholder="Search anything…"
            trailing={
              <Kbd>
                <span>⌘</span>K
              </Kbd>
            }
          />
        </div>
        <div>
          <Subhead>Select</Subhead>
          <Select defaultValue="relevant">
            <option value="relevant">Most Relevant</option>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
          </Select>
        </div>
      </div>
      <div className="mt-6 grid gap-1.5 text-body text-neutral-500">
        <p className="mb-1 text-body font-medium text-neutral-700">Field specs</p>
        <p>· Height: 44px</p>
        <p>· Radius: 12px</p>
        <p>· Border: 1px solid #E2E8F0</p>
        <p>· Padding: 0 16px</p>
        <p>· Focus: Border color #FB923C</p>
      </div>
    </Panel>
  );
}

/* ============================================================
   09 · Badges  ·  10 · Status  ·  11 · Progress
   ============================================================ */

function BadgesStatusProgress() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Panel n="09" title="Badges / Tags">
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-2">
            <p className="text-small text-neutral-500">Video</p>
            <Badge tone="video">Video</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-small text-neutral-500">Lesson</p>
            <Badge tone="lesson">Lesson</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-small text-neutral-500">Popular</p>
            <Badge tone="popular">Popular</Badge>
          </div>
        </div>
      </Panel>

      <Panel n="10" title="Status / Indicators">
        <div className="grid gap-3">
          <StatusIndicator status="in-progress" />
          <StatusIndicator status="completed" />
          <StatusIndicator status="now-playing" />
          <StatusIndicator status="locked" />
        </div>
      </Panel>

      <Panel n="11" title="Progress Bar">
        <ProgressBar value={35} />
        <div className="mt-4">
          <ProgressBar value={72} />
        </div>
      </Panel>
    </div>
  );
}

/* ============================================================
   12 · Cards
   ============================================================ */

function Cards() {
  return (
    <Panel n="12" title="Cards">
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <CourseCard
          title="Next.js for Production"
          description="Build scalable, high-performance web applications with Next.js."
        />
        <VideoLessonCard
          title="Data Fetching in Server Components"
          description="Learn how to fetch data on the server using async/await and Next.js best practices."
        />
        <LessonCard
          title="Data Fetching & Caching"
          description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
        />
        <ResourceCard
          title="Caching and Revalidation Guide"
          description="Deep dive into Next.js caching strategies."
        />
      </div>
    </Panel>
  );
}

/* ============================================================
   13 · Navigation
   ============================================================ */

function Navigation() {
  return (
    <Panel n="13" title="Navigation">
      <div className="space-y-8">
        <Navbar />
        <div>
          <Subhead>Breadcrumbs</Subhead>
          <Breadcrumbs
            items={[
              { label: "All Courses", href: "#" },
              { label: "Next.js for Production", href: "#" },
              { label: "Data Fetching & Caching" },
            ]}
          />
        </div>
        <div>
          <Subhead>Pagination</Subhead>
          <Pagination totalPages={8} />
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================
   14 · Principles
   ============================================================ */

const principles: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "search",
    title: "Clarity First",
    body: "Every element should communicate clearly.",
  },
  {
    icon: "chart",
    title: "Consistency",
    body: "Use components and patterns consistently across the platform.",
  },
  {
    icon: "circle-dashed",
    title: "Focus & Calm",
    body: "Remove noise and help learners focus on what matters.",
  },
  {
    icon: "user",
    title: "Accessible",
    body: "Design with accessibility and inclusivity in mind.",
  },
];

function Principles() {
  return (
    <Panel n="14" title="Principles">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((p) => (
          <div key={p.title} className="space-y-2">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-100 text-primary-500">
              <Icon name={p.icon} size={20} />
            </span>
            <p className="text-heading-3 font-semibold text-neutral-900">
              {p.title}
            </p>
            <p className="text-body text-neutral-500">{p.body}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function Home() {
  const gridBg: CSSProperties = {
    backgroundImage:
      "radial-gradient(circle at 1px 1px, var(--color-neutral-200) 1px, transparent 0)",
    backgroundSize: "32px 32px",
  };

  return (
    <div className="min-h-full" style={gridBg}>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
        {/* Header */}
        <header className="mb-12">
          <VertexLogo className="mb-8" />
          <h1 className="font-display text-display-1 text-neutral-900">
            Design System
          </h1>
          <p className="mt-4 max-w-md text-body-lg text-neutral-500">
            A unified design language for the Vertex learning platform. Clean,
            modern and focused on clarity, consistency and intuitive learning
            experiences.
          </p>
          <p className="mt-6 text-small font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Version 1.0 · May 2025
          </p>
        </header>

        <div className="space-y-6">
          <Colors />
          <div className="grid gap-6 lg:grid-cols-2">
            <Typography />
            <TypeScale />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Spacing />
            <RadiusShadows />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Icons />
            <div className="lg:col-span-2">
              <Buttons />
            </div>
          </div>
          <Inputs />
          <BadgesStatusProgress />
          <Cards />
          <Navigation />
          <Principles />
        </div>

        <footer className="mt-16 border-t border-neutral-200 pt-6 text-small text-neutral-500">
          Vertex Design System · built with Next.js, Tailwind CSS v4, Inter &
          Playfair Display
        </footer>
      </main>
    </div>
  );
}
