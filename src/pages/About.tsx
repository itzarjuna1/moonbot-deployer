import { Link } from "react-router-dom";
import { 
  Send, Users, Target, Heart, Code, Rocket, 
  ChevronRight, Sparkles, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeBackground from "@/components/CodeBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const stats = [
    { value: "500+", label: "Bots Deployed" },
    { value: "1000+", label: "Happy Users" },
    { value: "99.9%", label: "Uptime Rate" },
    { value: "2+", label: "Years Experience" }
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make Telegram bot hosting accessible, affordable, and hassle-free for everyone - from hobbyists to enterprises."
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "We believe in transparency, reliability, and putting our customers first. Your success is our success."
    },
    {
      icon: Code,
      title: "Our Expertise",
      description: "Years of experience in Telegram bot development and cloud infrastructure, now at your service."
    }
  ];

  const team = [
    {
      name: "The Uppermoon Team",
      role: "Developers & Support",
      description: "A passionate group of developers dedicated to making bot hosting simple and reliable.",
      emoji: "👨‍💻"
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
              <span className="text-sm font-medium">About Us</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <span className="gradient-text">We Are Uppermoon</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
              A team of passionate developers making Telegram bot hosting simple, reliable, and affordable.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="glass-hover rounded-2xl p-6 text-center animate-fade-up"
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Story Section */}
          <div className="glass-strong rounded-3xl p-8 md:p-12 mb-20 glow-premium">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-40 animate-pulse-slow" />
                <div className="relative glass-strong rounded-3xl p-8">
                  <Send className="w-16 h-16 text-primary" />
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Our <span className="gradient-text">Story</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Uppermoon Devs started with a simple idea: Telegram bot developers shouldn't have to worry about hosting, 
                  server management, or uptime. They should focus on what they do best - building amazing bots.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we've helped deploy hundreds of bots for users around the world, from simple utility bots to 
                  complex music streaming bots. Our mission remains the same: make bot hosting effortless.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What <span className="gradient-text">Drives Us</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div 
                  key={value.title}
                  className="glass-hover rounded-2xl p-8 text-center group animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="glass-strong w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Meet <span className="gradient-text">The Team</span>
            </h2>
            
            <div className="max-w-2xl mx-auto">
              {team.map((member, index) => (
                <div 
                  key={member.name}
                  className="glass-strong rounded-3xl p-8 text-center animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-6xl mb-6">{member.emoji}</div>
                  <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-muted-foreground leading-relaxed">{member.description}</p>
                  
                  <div className="flex justify-center gap-2 mt-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass-strong rounded-3xl p-12 max-w-3xl mx-auto glow-premium">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our <span className="gradient-text">Community</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Connect with us on Telegram and become part of the Uppermoon family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://t.me/snowy_hometown" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="btn-premium text-primary-foreground font-semibold px-10 py-7 text-lg rounded-2xl group">
                    <Users className="w-5 h-5 mr-2" />
                    <span className="relative z-10">Join Telegram</span>
                  </Button>
                </a>
                <Link to="/">
                  <Button size="lg" variant="outline" className="glass-hover border-border/50 px-8 py-7 text-lg rounded-2xl">
                    <Rocket className="w-5 h-5 mr-2 text-accent" />
                    Deploy Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
