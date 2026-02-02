import { Link } from "react-router-dom";
import { ArrowLeft, Key, Hash, Send, Bot, User, Database, MessageSquare, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";
import CodeBackground from "@/components/CodeBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const guidelines = [
  {
    title: "API ID",
    icon: Hash,
    description: "A unique numeric identifier for your Telegram application.",
    howToGet: [
      "Go to my.telegram.org",
      "Log in with your phone number",
      "Click on 'API Development Tools'",
      "Create a new application if you haven't",
      "Copy the 'api_id' number",
    ],
    important: "Keep this private. Never share publicly.",
    link: "https://my.telegram.org",
  },
  {
    title: "API Hash",
    icon: Key,
    description: "A 32-character secret hash paired with your API ID.",
    howToGet: [
      "Found in the same place as API ID",
      "Go to my.telegram.org → API Development Tools",
      "Look for 'api_hash' field",
      "Copy the full 32-character string",
    ],
    important: "This is a secret key. Treat it like a password.",
    link: "https://my.telegram.org",
  },
  {
    title: "String Session",
    icon: Send,
    description: "An encrypted authentication string for your userbot account that allows the bot to join voice chats.",
    howToGet: [
      "Use a Pyrogram or Telethon session generator",
      "Run the session generator script",
      "Enter your phone number when prompted",
      "Enter the OTP code you receive",
      "Copy the generated session string",
    ],
    important: "This gives full access to your account. Only use on accounts you control.",
    link: "https://replit.com/@AniketDevs/String-Session-Generator",
  },
  {
    title: "Bot Token",
    icon: Bot,
    description: "The authentication token for your Telegram bot.",
    howToGet: [
      "Open Telegram and search for @BotFather",
      "Send /newbot command",
      "Follow the prompts to name your bot",
      "Copy the token that looks like: 123456789:ABCdef...",
    ],
    important: "Revoke and regenerate if ever exposed.",
    link: "https://t.me/BotFather",
  },
  {
    title: "Owner ID",
    icon: User,
    description: "Your numeric Telegram user ID (not your username).",
    howToGet: [
      "Open Telegram and search for @userinfobot",
      "Send any message to the bot",
      "It will reply with your user ID",
      "Copy the numeric ID",
    ],
    important: "This ID gives you admin control over the bot.",
    link: "https://t.me/userinfobot",
  },
  {
    title: "MongoDB URI (Optional)",
    icon: Database,
    description: "Connection string for persistent storage of playlists and settings.",
    howToGet: [
      "Go to mongodb.com/atlas",
      "Create a free cluster",
      "Click 'Connect' on your cluster",
      "Choose 'Connect your application'",
      "Copy the connection string",
      "Replace <password> with your actual password",
    ],
    important: "Optional but recommended for saving user data.",
    link: "https://www.mongodb.com/atlas",
  },
  {
    title: "Logger Group ID (Optional)",
    icon: MessageSquare,
    description: "A Telegram group where the bot sends activity logs.",
    howToGet: [
      "Create a Telegram group",
      "Add your bot as an admin",
      "Add @userinfobot to the group",
      "Copy the group ID (starts with -100)",
      "Remove @userinfobot after",
    ],
    important: "The bot must be an admin in this group.",
    link: "https://t.me/userinfobot",
  },
];

const Guidelines = () => {
  return (
    <div className="min-h-screen relative">
      <CodeBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Deployment Guidelines</span>
            </h1>
            <p className="text-muted-foreground">
              Step-by-step guide to gather all credentials needed for deployment
            </p>
          </div>

          {/* Warning Card */}
          <Card className="glass border-amber-500/30 mb-8">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-400 mb-1">Security Notice</h3>
                <p className="text-sm text-muted-foreground">
                  Your credentials are sent securely via HTTPS and are never stored on our servers.
                  However, always keep these credentials private and never share them publicly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines List */}
          <div className="space-y-6">
            {guidelines.map((guide, index) => (
              <Card key={guide.title} className="glass overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <guide.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-1">
                        <span className="text-muted-foreground text-sm font-normal">#{index + 1}</span>
                        {guide.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{guide.description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* How to Get */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">How to get:</h4>
                    <ol className="space-y-2">
                      {guide.howToGet.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Important Note */}
                  <div className="flex items-start gap-2 bg-primary/5 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{guide.important}</p>
                  </div>

                  {/* Link */}
                  <a
                    href={guide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open {new URL(guide.link).hostname}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Ready to deploy?</p>
            <Link to="/">
              <Button className="btn-premium">
                <Send className="w-4 h-4 mr-2" />
                Go to Deployment
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Guidelines;
