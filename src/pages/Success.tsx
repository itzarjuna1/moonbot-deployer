import { CheckCircle, Clock, Send, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TelegramBackground from "@/components/TelegramBackground";

const Success = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10">
      <TelegramBackground />

      <Card className="relative z-10 glass border-border/50 max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative glass rounded-full p-6 w-fit mx-auto">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl">
            <span className="gradient-text">Request Submitted!</span>
          </CardTitle>
          <CardDescription className="text-base">
            Your bot deployment request has been received successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Waiting Time Notice */}
          <div className="glass rounded-xl p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Deployment Time</h3>
                <p className="text-muted-foreground text-sm">
                  Please wait up to <span className="text-primary font-semibold">30 minutes</span> for your bot to be deployed. 
                  You'll receive confirmation in our support group.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="glass rounded-xl p-4 border border-accent/20">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💳</span>
              <div>
                <h3 className="font-semibold text-sm mb-1">Complete Payment</h3>
                <p className="text-muted-foreground text-sm">
                  Contact us in the support group to complete your payment via UPI or Bank Transfer.
                </p>
              </div>
            </div>
          </div>

          {/* Support Group Link */}
          <a 
            href="https://t.me/snowy_hometown" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <div className="glass rounded-xl p-4 border border-border/50 hover:border-primary/50 transition-all hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="glass rounded-full p-2">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Join Support Group</h3>
                    <p className="text-muted-foreground text-xs">@snowy_hometown</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </a>

          {/* Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-center">Next Steps</h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-3 text-sm">
                <span className="glass rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold text-primary">1</span>
                <span className="text-muted-foreground">Join our support group</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="glass rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold text-primary">2</span>
                <span className="text-muted-foreground">Complete payment via UPI/Bank</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="glass rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold text-primary">3</span>
                <span className="text-muted-foreground">Wait for deployment confirmation</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="glass rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold text-primary">4</span>
                <span className="text-muted-foreground">Start using your bot!</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Link to="/" className="block">
            <Button variant="outline" className="w-full glass hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
