import { Link } from "wouter";
import { Layers, Moon, Sun, LogOut, Settings, LayoutDashboard, TrendingUp } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, toggle } = useThemeStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

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
          {isAdmin && (
            <>
              <Link href="/admin" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold text-blue-500">
                Admin Panel
              </Link>
              <Link href="/owner" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold text-emerald-500">
                Owner Dashboard
              </Link>
            </>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-foreground/70 px-2 py-1 rounded-lg bg-foreground/5">
                {user.firstName} {user.lastName}
              </span>
              {isAdmin && (
                <>
                  <Link href="/admin" className="p-2 hover:bg-foreground/10 rounded-lg transition-colors" title="Admin Panel">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                  <Link href="/owner" className="p-2 hover:bg-foreground/10 rounded-lg transition-colors" title="Owner Dashboard">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-primary text-primary-foreground">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
