import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Key, Hash, Bot, User, Loader2, Database, MessageSquare, HelpCircle, X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const SUPABASE_URL = "https://geivgnyebocxjphdvibm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlaXZnbnllYm9jeGpwaGR2aWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTA5MTcsImV4cCI6MjA4NDc2NjkxN30.8aJyS2HFGMFXJ-gXjtUC3u9eDEp0k3A8I0wUXpeREto";

const formSchema = z.object({
  apiId: z.string().min(1, "Required").regex(/^\d+$/, "Must be numeric"),
  apiHash: z.string().min(1, "Required").length(32, "Must be 32 characters"),
  stringSession: z.string().min(1, "Required").min(100, "Session seems too short"),
  botToken: z.string().min(1, "Required").regex(/^\d+:[A-Za-z0-9_-]+$/, "Invalid format"),
  ownerId: z.string().min(1, "Required").regex(/^\d+$/, "Must be numeric"),
  mongoUri: z.string().optional(),
  loggerGroup: z.string().optional(),
  plan: z.enum(["1month", "2months"]),
});

type FormData = z.infer<typeof formSchema>;

interface DeployModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, title: "Plan", description: "Select your hosting plan" },
  { id: 2, title: "Credentials", description: "Telegram API credentials" },
  { id: 3, title: "Optional", description: "Additional configuration" },
  { id: 4, title: "Review", description: "Confirm and deploy" },
];

const formFields = [
  {
    name: "apiId" as const,
    label: "API ID",
    icon: Hash,
    placeholder: "12345678",
    helpText: "Go to my.telegram.org → API Development Tools → Create application",
    step: 2,
  },
  {
    name: "apiHash" as const,
    label: "API Hash",
    icon: Key,
    placeholder: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    helpText: "32-character secret hash from my.telegram.org",
    step: 2,
  },
  {
    name: "stringSession" as const,
    label: "String Session",
    icon: Send,
    placeholder: "Pyrogram/Telethon session string...",
    helpText: "Generated via Pyrogram or Telethon session generator",
    step: 2,
  },
  {
    name: "botToken" as const,
    label: "Bot Token",
    icon: Bot,
    placeholder: "123456789:ABCdefGHIjklMNOpqrSTUvwxYZ",
    helpText: "Get from @BotFather on Telegram",
    step: 2,
  },
  {
    name: "ownerId" as const,
    label: "Owner ID",
    icon: User,
    placeholder: "123456789",
    helpText: "Your Telegram user ID from @userinfobot",
    step: 2,
  },
  {
    name: "mongoUri" as const,
    label: "MongoDB URI",
    icon: Database,
    placeholder: "mongodb+srv://user:pass@cluster.mongodb.net/db",
    helpText: "Optional: For persistent storage of playlists and settings",
    step: 3,
  },
  {
    name: "loggerGroup" as const,
    label: "Logger Group ID",
    icon: MessageSquare,
    placeholder: "-1001234567890",
    helpText: "Optional: Group to receive bot activity logs",
    step: 3,
  },
];

const plans = [
  { id: "1month" as const, name: "Starter", price: "₹400", duration: "1 Month", features: ["Full deployment", "24/7 uptime", "Basic support"] },
  { id: "2months" as const, name: "Pro", price: "₹600", duration: "2 Months", features: ["Everything in Starter", "Priority support", "Music bot support"], popular: true },
];

const DeployModal = ({ open, onOpenChange }: DeployModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
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
      mongoUri: "",
      loggerGroup: "",
      plan: "1month",
    },
  });

  const selectedPlan = form.watch("plan");

  const validateStep = async (step: number) => {
    if (step === 2) {
      return await form.trigger(["apiId", "apiHash", "stringSession", "botToken", "ownerId"]);
    }
    return true;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-to-telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ...data,
          mongoUri: data.mongoUri || undefined,
          loggerGroup: data.loggerGroup || undefined,
          timestamp: Date.now(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      onOpenChange(false);
      navigate('/success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm text-center mb-6">
              Select a hosting plan for your Telegram bot
            </p>
            <div className="grid gap-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => form.setValue("plan", plan.id)}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    selectedPlan === plan.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2 right-3 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{plan.name}</h4>
                      <p className="text-xs text-muted-foreground">{plan.duration}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold gradient-text">{plan.price}</span>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-green-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
      case 3:
        const stepFields = formFields.filter((f) => f.step === currentStep);
        return (
          <TooltipProvider>
            <div className="space-y-4">
              {currentStep === 3 && (
                <p className="text-muted-foreground text-sm text-center mb-4">
                  These fields are optional but recommended
                </p>
              )}
              {stepFields.map((fieldConfig) => (
                <FormField
                  key={fieldConfig.name}
                  control={form.control}
                  name={fieldConfig.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <fieldConfig.icon className="w-4 h-4 text-primary" />
                          {fieldConfig.label}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="p-1 rounded-full hover:bg-primary/10">
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-[280px]">
                            <p className="text-sm">{fieldConfig.helpText}</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={fieldConfig.placeholder}
                          className="h-11 rounded-lg bg-background/50"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </TooltipProvider>
        );

      case 4:
        const planInfo = plans.find((p) => p.id === selectedPlan);
        return (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-medium mb-3">Selected Plan</h4>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{planInfo?.name}</span>
                <span className="gradient-text font-bold text-xl">{planInfo?.price}</span>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-medium mb-3">Credentials Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API ID</span>
                  <span className="font-mono">{form.getValues("apiId") || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner ID</span>
                  <span className="font-mono">{form.getValues("ownerId") || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MongoDB</span>
                  <span>{form.getValues("mongoUri") ? "✓ Configured" : "Not set"}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Your bot will be deployed within 30 minutes after submission
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong border-border/50">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="gradient-text">Deploy Bot</span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between px-2 mb-4">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-4">
          <h3 className="font-semibold">{steps[currentStep - 1].title}</h3>
          <p className="text-xs text-muted-foreground">{steps[currentStep - 1].description}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            <div className="flex gap-3 pt-2">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}

              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep} className="flex-1 btn-premium">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="flex-1 btn-premium">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Deploy Now
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeployModal;
