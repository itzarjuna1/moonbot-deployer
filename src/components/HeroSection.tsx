import { useState } from "react";
import { Send, Rocket, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeployModal from "./DeployModal";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const [isDeployOpen, setIsDeployOpen] = useState(false);

  return (
    <>
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center px-4 pt-20 pb-16">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-[120px]" />
        
        {/* Logo */}
        <div className="relative mb-8 animate-float">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-2xl opacity-30" />
          <div className="relative glass-strong rounded-2xl p-5 glow-premium">
            <Send className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-center">
          <span className="gradient-text">Uppermoon</span>
          <span className="text-foreground"> Devs</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-8">
          Deploy your Telegram bots with enterprise-grade hosting.
          <span className="text-primary"> Fast. Secure. Reliable.</span>
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { icon: Rocket, label: "30-Min Deploy" },
            { icon: Zap, label: "99.9% Uptime" },
            { icon: Shield, label: "Secure" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="glass rounded-full px-4 py-2 flex items-center gap-2"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              <span className="text-sm">{feature.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setIsDeployOpen(true)}
            size="lg"
            className="btn-premium px-8 py-6 text-lg rounded-xl group"
          >
            <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            Deploy Your Bot
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="glass-hover border-border/50 px-8 py-6 text-lg rounded-xl"
          >
            <a href="https://t.me/snowy_hometown" target="_blank" rel="noopener noreferrer">
              <Sparkles className="w-5 h-5 mr-2 text-accent" />
              Join Community
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl w-full">
          {[
            { value: "500+", label: "Bots Deployed" },
            { value: "99.9%", label: "Uptime" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <DeployModal open={isDeployOpen} onOpenChange={setIsDeployOpen} />
    </>
  );
};

export default HeroSection;
