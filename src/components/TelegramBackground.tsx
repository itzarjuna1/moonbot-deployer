import { Send } from "lucide-react";

const TelegramBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      
      {/* Animated blurred Telegram icons */}
      <div className="absolute top-20 left-10 opacity-10 blur-sm animate-float">
        <Send className="w-32 h-32 text-primary" />
      </div>
      
      <div className="absolute top-40 right-20 opacity-5 blur-md animate-float" style={{ animationDelay: '2s' }}>
        <Send className="w-48 h-48 text-accent" />
      </div>
      
      <div className="absolute bottom-32 left-1/4 opacity-8 blur-sm animate-float" style={{ animationDelay: '1s' }}>
        <Send className="w-24 h-24 text-primary" />
      </div>
      
      <div className="absolute top-1/3 right-1/3 opacity-5 blur-lg animate-float" style={{ animationDelay: '3s' }}>
        <Send className="w-64 h-64 text-accent" />
      </div>
      
      <div className="absolute bottom-20 right-10 opacity-10 blur-sm animate-float" style={{ animationDelay: '4s' }}>
        <Send className="w-20 h-20 text-primary" />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
    </div>
  );
};

export default TelegramBackground;
