import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Send, Menu, X, LayoutDashboard, BookOpen, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeployModal from "./DeployModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/guidelines", label: "Guidelines", icon: BookOpen },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/faq", label: "FAQ" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Menu Button (Left) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Logo (Center on mobile, Left on desktop) */}
          <Link to="/" className="flex items-center gap-2 md:order-first">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-lg blur-lg" />
              <div className="relative glass rounded-lg p-2">
                <Send className="w-4 h-4 text-primary" />
              </div>
            </div>
            <span className="font-semibold text-sm md:text-base">
              <span className="gradient-text">Uppermoon</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Deploy Button */}
          <Button
            onClick={() => setIsDeployOpen(true)}
            size="sm"
            className="btn-premium text-xs md:text-sm"
          >
            <Rocket className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Deploy</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-strong border-t border-border/30 animate-fade-in">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <DeployModal open={isDeployOpen} onOpenChange={setIsDeployOpen} />
    </>
  );
};

export default Navbar;
