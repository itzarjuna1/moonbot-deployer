import { Send, Rocket, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20 pb-10">
      {/* Logo/Brand */}
      <div className="flex items-center gap-3 mb-6 animate-float">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50" />
          <div className="relative glass rounded-full p-4">
            <Send className="w-10 h-10 text-primary" />
          </div>
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center">
        <span className="gradient-text">Uppermoon</span>
        <span className="text-foreground"> Devs</span>
      </h1>

      {/* Tagline */}
      <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-8">
        Deploy your Telegram bots in minutes. Professional hosting, instant setup, 
        and dedicated support for your automation needs.
      </p>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
          <Rocket className="w-4 h-4 text-primary" />
          <span className="text-sm">Fast Deployment</span>
        </div>
        <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm">24/7 Uptime</span>
        </div>
        <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" />
          <span className="text-sm">Telegram Native</span>
        </div>
      </div>

      {/* CTA Button */}
      <Button 
        onClick={onGetStarted}
        size="lg"
        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300 animate-glow"
      >
        <Rocket className="w-5 h-5 mr-2" />
        Deploy Your Bot Now
      </Button>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-8 mt-16">
        <div className="text-center">
          <p className="text-3xl font-bold gradient-text">500+</p>
          <p className="text-sm text-muted-foreground">Bots Deployed</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold gradient-text">99.9%</p>
          <p className="text-sm text-muted-foreground">Uptime</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold gradient-text">30min</p>
          <p className="text-sm text-muted-foreground">Setup Time</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
