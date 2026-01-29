import { Link } from "react-router-dom";
import { Sparkles, HelpCircle, Rocket, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CodeBackground from "@/components/CodeBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQ = () => {
  const faqs = [
    {
      question: "How long does deployment take?",
      answer: "Your bot will be deployed within 30 minutes after we receive your payment confirmation. In most cases, it's even faster!"
    },
    {
      question: "What information do I need to provide?",
      answer: "You'll need your API ID and API Hash (from my.telegram.org), a String Session, your Bot Token (from @BotFather), and your Telegram User ID. Optionally, you can also provide a MongoDB URI and Logger Group ID."
    },
    {
      question: "How do I get my API ID and API Hash?",
      answer: "Visit my.telegram.org, log in with your phone number, and go to 'API development tools'. Create a new application and you'll receive your API ID and API Hash."
    },
    {
      question: "What is a String Session?",
      answer: "A String Session is an encrypted authentication token that allows your bot to access your Telegram account. You can generate one using tools like Pyrogram's session generator."
    },
    {
      question: "Is my data safe?",
      answer: "Absolutely! Your credentials are transmitted via encrypted channels directly to our secure servers. We do not store any of your sensitive information."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI and Bank Transfer payments. After selecting your plan, you'll receive payment instructions via our Telegram support."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Yes! You can upgrade from the 1-month to 2-month plan at any time. Contact our support team for assistance."
    },
    {
      question: "What if my bot goes offline?",
      answer: "We have automatic crash detection and restart systems in place. If your bot goes offline, it will be automatically restarted within seconds."
    },
    {
      question: "Do you support music bots?",
      answer: "Yes! We fully support Pyrogram-based music bots with voice chat streaming capabilities. Our Pro plan includes dedicated music bot support."
    },
    {
      question: "How can I contact support?",
      answer: "Join our Telegram support group at t.me/snowy_hometown. Our team is available 24/7 to help you with any issues or questions."
    },
    {
      question: "Can I use my own MongoDB?",
      answer: "Yes! You can optionally provide your own MongoDB connection URI during the deployment process for persistent data storage."
    },
    {
      question: "What happens when my plan expires?",
      answer: "We'll send you a reminder before your plan expires. If not renewed, your bot will be safely shut down. Your data remains secure, and you can renew anytime to continue."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CodeBackground />
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Got Questions?</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <span className="gradient-text">FAQ</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
              Find answers to commonly asked questions about our bot deployment service.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="glass-strong rounded-3xl p-6 md:p-10 mb-16 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="glass rounded-xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5 group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <HelpCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm md:text-base pr-4">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 pl-12 pr-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Still Have Questions */}
          <div className="text-center">
            <div className="glass-strong rounded-3xl p-12 glow-premium">
              <div className="glass-strong w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Still Have <span className="gradient-text">Questions</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you 24/7.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://t.me/snowy_hometown" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="btn-premium text-primary-foreground font-semibold px-10 py-7 text-lg rounded-2xl group">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    <span className="relative z-10">Contact Support</span>
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

export default FAQ;
