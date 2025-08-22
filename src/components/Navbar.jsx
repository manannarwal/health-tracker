import { Heart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ currentPage, onPageChange }) {
  const navigationItems = [
    { name: "Dashboard", href: "dashboard", current: currentPage === "dashboard" },
    { name: "Reports", href: "reports", current: currentPage === "reports" },
    { name: "Analytics", href: "analytics", current: currentPage === "analytics" },
    { name: "Settings", href: "settings", current: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">Health Tracker</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onPageChange && onPageChange(item.href)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  item.current
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="space-y-3">
                    {navigationItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => onPageChange && onPageChange(item.href)}
                        className={`block px-3 py-2 text-base font-medium rounded-md transition-colors w-full text-left ${
                          item.current
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="outline" className="w-full">
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
