import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import CodeBackground from "@/components/CodeBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PricingCards from "@/components/PricingCards";
import DeploymentForm from "@/components/DeploymentForm";
import HelpChatbot from "@/components/HelpChatbot";
import Footer from "@/components/Footer";
import { useTelegramLogger } from "@/hooks/useTelegramLogger";
import { Rocket, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  useTelegramLogger();
  const [selectedPlan, setSelectedPlan] = useState<"1month" | "2months" | null>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CodeBackground />
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        
        {/* Features Section */}
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose <span className="gradient-text">Uppermoon</span>?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Enterprise-grade hosting with all the features you need to run a successful bot.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Rocket,
                  title: "Lightning Fast",
                  description: "Your bot goes live in under 30 minutes with our streamlined deployment process.",
                  color: "text-primary",
                  bgColor: "bg-primary/10"
                },
                {
                  icon: Zap,
                  title: "Music Bot Support",
                  description: "Full support for Pyrogram-based music bots with voice chat streaming capabilities.",
                  color: "text-accent",
                  bgColor: "bg-accent/10"
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "End-to-end encryption with zero credential storage. Your data stays yours.",
                  color: "text-green-400",
                  bgColor: "bg-green-500/10"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="glass-hover rounded-2xl p-8 text-center group animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            
            {/* View All Features Link */}
            <div className="text-center mt-10">
              <Link to="/features">
                <Button variant="outline" className="glass-hover border-border/50 group">
                  <span>View All Features</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
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
      <Footer />

      {/* Help Chatbot */}
      <HelpChatbot />
    </div>
  );
};

export default Index;
