import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

function NexusBridgeLogo() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="28"
      height="28"
      fill="none"
      aria-label="NexusBridge logo"
      className="shrink-0"
    >
      {/* N letterform as connected nodes */}
      <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="24" cy="8" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="8" cy="24" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.9" />
      {/* Bridge connections */}
      <line x1="8" y1="8" x2="8" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="8" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      <line x1="24" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      {/* Central bridge node */}
      <circle cx="16" cy="16" r="2.5" fill="hsl(170 65% 40%)" />
      <line x1="8" y1="24" x2="16" y2="16" stroke="hsl(170 65% 40%)" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="8" x2="16" y2="16" stroke="hsl(170 65% 40%)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/docs", label: "API Docs", icon: FileText },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="flex flex-col w-56 shrink-0 border-r border-border bg-sidebar h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border">
        <NexusBridgeLogo />
        <span className="font-display font-bold text-sm tracking-tight text-foreground">
          NexusBridge
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-3">
        {/* API Status */}
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-muted-foreground font-medium" data-testid="status-api">
            Operational
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          className="flex items-center gap-2.5 px-3 py-2 w-full rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
