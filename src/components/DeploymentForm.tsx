import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Key, Hash, Bot, User, Loader2, Info } from "lucide-react";
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
          ...data,
          plan: selectedPlan,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to submit deployment request');
      }

      navigate('/success');
    } catch (error) {
      console.error('Submission error:', error);
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
    "1month": { name: "Starter (1 Month)", price: "₹400" },
    "2months": { name: "Pro (2 Months)", price: "₹600" },
  };

  return (
    <section id="deploy" className="relative z-10 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="glass border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 glass rounded-full p-4 w-fit animate-glow">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              <span className="gradient-text">Deploy Your Bot</span>
            </CardTitle>
            <CardDescription className="text-base">
              Enter your Telegram credentials below. Your bot will be live within 30 minutes.
            </CardDescription>
            {selectedPlan && (
              <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <span className="text-sm text-muted-foreground">Selected:</span>
                <span className="font-semibold text-primary">
                  {planInfo[selectedPlan].name} - {planInfo[selectedPlan].price}
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="apiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-primary" />
                        API ID
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="12345678" 
                          className="glass border-border/50 focus:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1 text-xs">
                        <Info className="w-3 h-3" />
                        Get from my.telegram.org
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiHash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-primary" />
                        API Hash
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" 
                          className="glass border-border/50 focus:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1 text-xs">
                        <Info className="w-3 h-3" />
                        32-character hash from my.telegram.org
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stringSession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-primary" />
                        String Session
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Pyrogram/Telethon string session..." 
                          className="glass border-border/50 focus:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1 text-xs">
                        <Info className="w-3 h-3" />
                        Generated via Pyrogram or Telethon
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="botToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-primary" />
                        Bot Token
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ" 
                          className="glass border-border/50 focus:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1 text-xs">
                        <Info className="w-3 h-3" />
                        Get from @BotFather on Telegram
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Owner ID
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123456789" 
                          className="glass border-border/50 focus:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1 text-xs">
                        <Info className="w-3 h-3" />
                        Your Telegram user ID (get from @userinfobot)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !selectedPlan}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Deployment Request
                    </>
                  )}
                </Button>

                {!selectedPlan && (
                  <p className="text-center text-amber-500 text-sm">
                    ⚠️ Please select a plan above before submitting
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
