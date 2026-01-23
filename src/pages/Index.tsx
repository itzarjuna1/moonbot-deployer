import { useState, useRef } from "react";
import TelegramBackground from "@/components/TelegramBackground";
import HeroSection from "@/components/HeroSection";
import PricingCards from "@/components/PricingCards";
import DeploymentForm from "@/components/DeploymentForm";

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<"1month" | "2months" | null>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TelegramBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="glass rounded-full p-2">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <span className="font-bold text-lg">
              <span className="gradient-text">Uppermoon</span> Devs
            </span>
          </div>
          <a 
            href="https://t.me/snowy_hometown" 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass px-4 py-2 rounded-full text-sm hover:bg-primary/10 transition-colors"
          >
            Join Support
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        
        <div ref={pricingRef}>
          <PricingCards 
            selectedPlan={selectedPlan} 
            onSelectPlan={setSelectedPlan} 
          />
        </div>
        
        <DeploymentForm selectedPlan={selectedPlan} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-border/50 py-8 px-4 mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-sm mb-4">
            © 2024 Uppermoon Devs. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <a 
              href="https://t.me/snowy_hometown" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Telegram Support
            </a>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground text-sm">
              Made with 💙 for Telegram Bot Enthusiasts
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
