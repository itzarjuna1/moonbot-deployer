import { useState } from "react";
import { Send, Rocket, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeployModal from "./DeployModal";

const HeroSection = () => {
  const [isDeployOpen, setIsDeployOpen] = useState(false);

  return (
    <>
      <section className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center px-4 pt-24 pb-20">
        {/* Minimal Logo */}
        <div className="mb-10">
          <div className="border border-border rounded-xl p-4 bg-card/50">
            <Send className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 text-center tracking-tight">
          <span className="text-primary">Uppermoon</span> Devs
        </h1>

        {/* Tagline */}
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-xl mb-12 leading-relaxed">
          Enterprise-grade hosting for your Telegram bots.
          <br />
          <span className="text-foreground">Fast deployment. Reliable uptime.</span>
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setIsDeployOpen(true)}
            size="lg"
            className="px-8 h-12 text-base font-medium rounded-lg"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Deploy Bot
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="px-8 h-12 text-base font-medium rounded-lg border-border"
          >
            <a href="https://t.me/snowy_hometown" target="_blank" rel="noopener noreferrer">
              Join Community
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-20 text-center">
          <div>
            <p className="text-2xl font-semibold text-foreground">500+</p>
            <p className="text-sm text-muted-foreground">Bots Deployed</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <p className="text-2xl font-semibold text-foreground">99.9%</p>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <p className="text-2xl font-semibold text-foreground">24/7</p>
            <p className="text-sm text-muted-foreground">Support</p>
          </div>
        </div>
      </section>

      <DeployModal open={isDeployOpen} onOpenChange={setIsDeployOpen} />
    </>
  );
};

export default HeroSection;
