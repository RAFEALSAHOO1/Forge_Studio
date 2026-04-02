import { Link } from "wouter";
import { Layers, Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, toggle } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b glass-panel">
      <div className="container flex h-16 items-center mx-auto px-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Layers className="h-6 w-6 text-primary" />
          <span className="font-bold tracking-tight text-lg">DesignForge Studio</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/browse" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Templates
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
