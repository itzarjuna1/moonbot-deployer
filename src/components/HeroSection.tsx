import { Send, Rocket, Zap, Shield, Clock, Sparkles, ChevronDown, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      
      {/* Logo with premium glow */}
      <div className="relative mb-8 animate-float">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-2xl opacity-40 animate-pulse-slow" />
        <div className="relative glass-strong rounded-3xl p-6 glow-premium">
          <Send className="w-14 h-14 text-primary" />
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-center tracking-tight">
        <span className="gradient-text text-glow">Uppermoon</span>
        <span className="text-foreground"> Devs</span>
      </h1>

      {/* Tagline */}
      <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground text-center max-w-3xl mb-10 leading-relaxed">
        Deploy your Telegram bots with <span className="text-primary font-medium">enterprise-grade hosting</span>, 
        instant setup, and dedicated support.
      </p>

      {/* Feature Badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {[
          { icon: Rocket, label: "30-Min Deploy", color: "text-primary" },
          { icon: Zap, label: "99.9% Uptime", color: "text-accent" },
          { icon: Shield, label: "Secure", color: "text-green-400" },
          { icon: Clock, label: "24/7 Support", color: "text-primary" },
          { icon: Music, label: "Music Bots", color: "text-pink-400" },
        ].map((feature, index) => (
          <div 
            key={feature.label}
            className="glass-hover rounded-full px-5 py-2.5 flex items-center gap-2.5 animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <feature.icon className={`w-4 h-4 ${feature.color}`} />
            <span className="text-sm font-medium">{feature.label}</span>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Button 
          onClick={onGetStarted}
          size="lg"
          className="btn-premium text-primary-foreground font-semibold px-10 py-7 text-lg rounded-2xl group"
        >
          <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
          <span className="relative z-10">Deploy Your Bot</span>
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          asChild
          className="glass-hover border-border/50 px-8 py-7 text-lg rounded-2xl"
        >
          <a href="https://t.me/snowy_hometown" target="_blank" rel="noopener noreferrer">
            <Sparkles className="w-5 h-5 mr-2 text-accent" />
            Join Community
          </a>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl w-full">
        {[
          { value: "500+", label: "Bots Deployed" },
          { value: "99.9%", label: "Uptime SLA" },
          { value: "<30min", label: "Setup Time" },
          { value: "24/7", label: "Support" },
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="glass-hover rounded-2xl p-5 text-center group animate-fade-up"
            style={{ animationDelay: `${index * 100 + 400}ms` }}
          >
            <p className="text-3xl md:text-4xl font-bold gradient-text mb-1 group-hover:text-glow transition-all">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default HeroSection;
