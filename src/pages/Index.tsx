import { Link } from "react-router-dom";
import CodeBackground from "@/components/CodeBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HelpChatbot from "@/components/HelpChatbot";
import Footer from "@/components/Footer";
import { useTelegramLogger } from "@/hooks/useTelegramLogger";
import { Rocket, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  useTelegramLogger();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CodeBackground />
      <Navbar />

      <main>
        <HeroSection />

        {/* Features Section */}
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Why Choose <span className="gradient-text">Uppermoon</span>?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                Enterprise-grade hosting with all the features you need.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: Rocket,
                  title: "Lightning Fast",
                  description: "Your bot goes live in under 30 minutes.",
                },
                {
                  icon: Zap,
                  title: "Music Bot Support",
                  description: "Full Pyrogram music bot with voice chat.",
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "End-to-end encryption. Zero storage.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="glass-hover rounded-xl p-6 text-center group"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/features">
                <Button variant="outline" className="glass-hover border-border/50 group">
                  View All Features
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <HelpChatbot />
    </div>
  );
};

export default Index;
