import { useState, useRef } from "react";
import { ExternalLink, Send, Music, Sparkles } from "lucide-react";
import TelegramBackground from "@/components/TelegramBackground";
import HeroSection from "@/components/HeroSection";
import PricingCards from "@/components/PricingCards";
import DeploymentForm from "@/components/DeploymentForm";
import HelpChatbot from "@/components/HelpChatbot";
import { useTelegramLogger } from "@/hooks/useTelegramLogger";

const Index = () => {
  useTelegramLogger();
  const [selectedPlan, setSelectedPlan] = useState<"1month" | "2months" | null>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TelegramBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
          
          <div className="flex items-center gap-3">
            {/* Music Bot Badge */}
            <div className="hidden sm:flex items-center gap-2 glass rounded-full px-3 py-1.5">
              <Music className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-muted-foreground">Music Bots Available</span>
            </div>
            
            <a 
              href="https://t.me/snowy_hometown" 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-hover px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 group"
            >
              <span>Support</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        
        {/* Features Section */}
        <section className="relative z-10 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🚀",
                  title: "Lightning Fast",
                  description: "Your bot goes live in under 30 minutes with our streamlined deployment process."
                },
                {
                  icon: "🎵",
                  title: "Music Bot Support",
                  description: "Full support for Pyrogram-based music bots with voice chat streaming capabilities."
                },
                {
                  icon: "🛡️",
                  title: "Enterprise Security",
                  description: "End-to-end encryption with zero credential storage. Your data stays yours."
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="glass-hover rounded-2xl p-6 text-center group animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <div ref={pricingRef}>
          <PricingCards 
            selectedPlan={selectedPlan} 
            onSelectPlan={setSelectedPlan} 
          />
        </div>
        
        <DeploymentForm selectedPlan={selectedPlan} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-border/30 py-12 px-4 mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="glass rounded-xl p-2">
                <Send className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">
                <span className="gradient-text">Uppermoon</span> Devs
              </span>
            </div>
            
            {/* Links */}
            <div className="flex items-center gap-6">
              <a 
                href="https://t.me/snowy_hometown" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Telegram Support
              </a>
            </div>
            
            {/* Copyright */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>© 2024 Uppermoon Devs</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Made with <Sparkles className="w-3.5 h-3.5 text-accent" /> for Telegram
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Help Chatbot */}
      <HelpChatbot />
    </div>
  );
};

export default Index;
