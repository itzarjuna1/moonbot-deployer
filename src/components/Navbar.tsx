import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Send, ExternalLink, Music, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/about", label: "About" },
    { to: "/faq", label: "FAQ" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg" />
            <div className="relative glass rounded-xl p-2.5">
              <Send className="w-5 h-5 text-primary" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="gradient-text">Uppermoon</span>
            <span className="text-muted-foreground"> Devs</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Music Bot Badge - Desktop */}
          <div className="hidden lg:flex items-center gap-2 glass rounded-full px-3 py-1.5">
            <Music className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-muted-foreground">Music Bots</span>
          </div>

          {/* Support Link - Desktop */}
          <a
            href="https://t.me/snowy_hometown"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex glass-hover px-4 py-2 rounded-xl text-sm font-medium items-center gap-2 group"
          >
            <span>Support</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-strong border-t border-border/30 animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-border/30 pt-4 mt-2">
              <a
                href="https://t.me/snowy_hometown"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Join Support</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
