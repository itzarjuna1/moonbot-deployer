import { Link } from "react-router-dom";
import { 
  Rocket, Zap, Shield, Clock, Music, Server, 
  Database, Globe, Headphones, Code, Terminal, 
  Bot, ChevronRight, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeBackground from "@/components/CodeBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Features = () => {
  const features = [
    {
      icon: Rocket,
      title: "Lightning Fast Deployment",
      description: "Your bot goes live in under 30 minutes. Our streamlined process handles everything from setup to launch.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Server,
      title: "Enterprise Hosting",
      description: "Premium cloud infrastructure with 99.9% uptime guarantee. Your bot stays online 24/7/365.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Music,
      title: "Music Bot Support",
      description: "Full support for Pyrogram-based music bots with voice chat streaming and queue management.",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10"
    },
    {
      icon: Shield,
      title: "End-to-End Security",
      description: "Your credentials are encrypted and transmitted directly. Zero storage policy ensures maximum privacy.",
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Database,
      title: "MongoDB Integration",
      description: "Optional MongoDB support for persistent data storage. Keep your bot's data safe and accessible.",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated Telegram support group with quick response times. We're here when you need us.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Low-latency connections worldwide. Your bot responds fast no matter where your users are.",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10"
    },
    {
      icon: Terminal,
      title: "Custom Commands",
      description: "Full command customization support. Make your bot truly unique with personalized interactions.",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: Bot,
      title: "Auto Restart",
      description: "Automatic crash detection and restart. Your bot recovers instantly from any unexpected issues.",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CodeBackground />
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Powerful Features</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <span className="gradient-text">Everything You Need</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
              Professional-grade bot hosting with all the tools and support you need to succeed.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-hover rounded-2xl p-6 group animate-fade-up"
                style={{ animationDelay: `${index * 50 + 300}ms` }}
              >
                <div className={`${feature.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="glass-strong rounded-3xl p-12 max-w-3xl mx-auto glow-premium">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to <span className="gradient-text">Deploy</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Get your Telegram bot running in under 30 minutes with our premium hosting service.
              </p>
              <Link to="/">
                <Button size="lg" className="btn-premium text-primary-foreground font-semibold px-10 py-7 text-lg rounded-2xl group">
                  <Rocket className="w-5 h-5 mr-2" />
                  <span className="relative z-10">Get Started Now</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Features;
