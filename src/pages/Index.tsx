import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <HeroSection />

        {/* Features Section */}
        <section className="py-24 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Why Choose Uppermoon?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Enterprise-grade infrastructure for your Telegram bots.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Rocket,
                  title: "Fast Deployment",
                  description: "Your bot goes live in under 30 minutes after submission.",
                },
                {
                  icon: Zap,
                  title: "Music Bot Support",
                  description: "Full Pyrogram music bot with voice chat integration.",
                },
                {
                  icon: Shield,
                  title: "Secure Hosting",
                  description: "End-to-end encryption. Your credentials are never stored.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/features">
                <Button variant="outline" className="border-border">
                  View All Features
                  <ArrowRight className="w-4 h-4 ml-2" />
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
