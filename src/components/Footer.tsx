import { Link } from "react-router-dom";
import { Send, ExternalLink, Sparkles, Github, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", to: "/features" },
      { label: "Pricing", to: "/#pricing" },
      { label: "FAQ", to: "/faq" },
    ],
    company: [
      { label: "About Us", to: "/about" },
      { label: "Support", href: "https://t.me/snowy_hometown" },
    ],
  };

  return (
    <footer className="relative z-10 glass border-t border-border/30 py-16 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="glass rounded-xl p-2">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-lg">
                <span className="gradient-text">Uppermoon</span> Devs
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Professional Telegram bot hosting with enterprise-grade infrastructure, 
              instant deployment, and dedicated 24/7 support.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://t.me/snowy_hometown"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-hover p-2.5 rounded-xl transition-all duration-300 group"
              >
                <Send className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {'to' in link ? (
                    <Link
                      to={link.to}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>© {currentYear} Uppermoon Devs</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3.5 h-3.5 text-destructive fill-destructive" /> for Telegram
              </span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3">
              <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">Premium Hosting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
