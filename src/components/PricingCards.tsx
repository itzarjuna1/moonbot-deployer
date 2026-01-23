import { Check, Star, Crown } from "lucide-react";
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
        "1 bot instance"
      ],
      popular: false
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
        "Priority support",
        "Extended hosting",
        "Performance optimization",
        "Best value deal"
      ],
      popular: true
    }
  ];

  return (
    <section id="pricing" className="relative z-10 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Simple Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose your plan and get your bot running in under 30 minutes. 
            Manual payment via UPI/Bank Transfer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <Card 
                key={plan.id}
                className={`relative glass cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
                    : 'hover:border-primary/50'
                } ${plan.popular ? 'md:scale-105' : ''}`}
                onClick={() => onSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {plan.savings && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.savings}
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 glass rounded-full p-3 w-fit">
                    <Icon className={`w-6 h-6 ${plan.popular ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.priceDetail}</span>
                  </div>

                  <ul className="space-y-3 text-left mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full ${
                      isSelected 
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90' 
                        : 'hover:bg-primary/10'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-8">
          💳 Payment via UPI/Bank Transfer after form submission
        </p>
      </div>
    </section>
  );
};

export default PricingCards;
