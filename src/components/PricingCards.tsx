import { Check, Star, Crown, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PricingCardsProps {
  selectedPlan: "1month" | "2months" | null;
  onSelectPlan: (plan: "1month" | "2months") => void;
}

const PricingCards = ({ selectedPlan, onSelectPlan }: PricingCardsProps) => {
  const plans = [
    {
      id: "1month" as const,
      name: "Starter",
      duration: "1 Month",
      price: "₹400",
      priceDetail: "/month",
      icon: Star,
      features: [
        "Full bot deployment",
        "24/7 uptime monitoring",
        "Telegram support",
        "Free setup assistance",
        "1 bot instance",
        "Basic analytics"
      ],
      popular: false,
      gradient: "from-primary/20 to-primary/5"
    },
    {
      id: "2months" as const,
      name: "Pro",
      duration: "2 Months",
      price: "₹600",
      priceDetail: "/2 months",
      savings: "Save ₹200!",
      icon: Crown,
      features: [
        "Everything in Starter",
        "Priority support queue",
        "Extended hosting period",
        "Performance optimization",
        "Advanced analytics",
        "Music bot support"
      ],
      popular: true,
      gradient: "from-accent/20 via-primary/10 to-accent/5"
    }
  ];

  return (
    <section id="pricing" className="relative z-10 py-24 px-4">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Simple & Transparent</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Choose Your Plan</span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get your bot running in under 30 minutes. No hidden fees, no surprises.
            Pay securely via UPI or Bank Transfer.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden cursor-pointer transition-all duration-500 group
                  ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}
                  ${isSelected 
                    ? 'glass-strong ring-2 ring-primary glow-premium scale-[1.02]' 
                    : 'glass-hover'
                  }`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => onSelectPlan(plan.id)}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50 transition-opacity duration-500 group-hover:opacity-80`} />
                
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-px left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground text-xs font-bold px-6 py-1.5 rounded-b-xl">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Savings badge */}
                {plan.savings && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-green-500/30">
                      {plan.savings}
                    </span>
                  </div>
                )}

                <CardHeader className={`relative text-center ${plan.popular ? 'pt-10' : 'pt-6'} pb-4`}>
                  {/* Icon */}
                  <div className={`mx-auto mb-6 relative ${plan.popular ? 'animate-float-slow' : ''}`}>
                    <div className={`absolute inset-0 rounded-2xl blur-xl ${plan.popular ? 'bg-accent/30' : 'bg-primary/30'} animate-pulse-slow`} />
                    <div className="relative glass-strong rounded-2xl p-4">
                      <Icon className={`w-8 h-8 ${plan.popular ? 'text-accent' : 'text-primary'}`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl mb-1">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{plan.duration}</CardDescription>
                </CardHeader>

                <CardContent className="relative text-center">
                  {/* Price */}
                  <div className="mb-8">
                    <span className="text-5xl md:text-6xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-muted-foreground text-lg ml-1">{plan.priceDetail}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 text-left mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex} 
                        className="flex items-center gap-3 text-sm group/item"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    variant={isSelected ? "default" : "outline"}
                    size="lg"
                    className={`w-full rounded-xl py-6 text-base font-semibold transition-all duration-300 group/btn
                      ${isSelected 
                        ? 'btn-premium' 
                        : 'glass-hover border-border/50 hover:border-primary/50'
                      }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSelected ? 'Selected' : 'Select Plan'}
                      <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? '' : 'group-hover/btn:translate-x-1'}`} />
                    </span>
                  </Button>
                </CardContent>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none" />
                )}
              </Card>
            );
          })}
        </div>

        {/* Payment note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 glass rounded-2xl px-6 py-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl">💳</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-muted-foreground">UPI / Bank Transfer • No card required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
