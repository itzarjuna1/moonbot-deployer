import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Activity, Clock, ChevronDown, ChevronUp, RefreshCw, Terminal, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import CodeBackground from "@/components/CodeBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Deployment {
  id: string;
  botName: string;
  status: "running" | "stopped" | "deploying";
  createdAt: string;
  plan: string;
  logs: string[];
}

// Mock data - in production this would come from your backend
const mockDeployments: Deployment[] = [
  {
    id: "dep_001",
    botName: "MusicBot_Premium",
    status: "running",
    createdAt: "2026-02-01T10:30:00Z",
    plan: "Pro (2 Months)",
    logs: [
      "[2026-02-02 11:00:00] Bot started successfully",
      "[2026-02-02 11:00:01] Connected to Telegram API",
      "[2026-02-02 11:00:02] Voice chat module initialized",
      "[2026-02-02 11:00:03] Ready to receive commands",
      "[2026-02-02 11:15:00] /play command received from user",
      "[2026-02-02 11:15:02] Streaming: Never Gonna Give You Up",
    ],
  },
  {
    id: "dep_002",
    botName: "AdminBot_v2",
    status: "deploying",
    createdAt: "2026-02-02T08:00:00Z",
    plan: "Starter (1 Month)",
    logs: [
      "[2026-02-02 08:00:00] Deployment initiated",
      "[2026-02-02 08:00:05] Pulling latest code...",
      "[2026-02-02 08:00:30] Installing dependencies...",
    ],
  },
];

const Dashboard = () => {
  const [expandedLogs, setExpandedLogs] = useState<string | null>(null);
  const [deployments] = useState<Deployment[]>(mockDeployments);

  const toggleLogs = (id: string) => {
    setExpandedLogs(expandedLogs === id ? null : id);
  };

  const getStatusIcon = (status: Deployment["status"]) => {
    switch (status) {
      case "running":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "stopped":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "deploying":
        return <RefreshCw className="w-4 h-4 text-accent animate-spin" />;
    }
  };

  const getStatusLabel = (status: Deployment["status"]) => {
    switch (status) {
      case "running":
        return "Running";
      case "stopped":
        return "Stopped";
      case "deploying":
        return "Deploying...";
    }
  };

  return (
    <div className="min-h-screen relative">
      <CodeBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Monitor your bot deployments and view logs
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="glass">
              <CardContent className="pt-6 text-center">
                <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{deployments.filter(d => d.status === "running").length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="pt-6 text-center">
                <RefreshCw className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold">{deployments.filter(d => d.status === "deploying").length}</p>
                <p className="text-xs text-muted-foreground">Deploying</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="pt-6 text-center">
                <Send className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{deployments.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
          </div>

          {/* Deployments List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Deployments</h2>
              <Button variant="outline" size="sm" className="glass-hover">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {deployments.length === 0 ? (
              <Card className="glass text-center py-12">
                <CardContent>
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No deployments yet</p>
                  <Link to="/">
                    <Button className="btn-premium">
                      <Send className="w-4 h-4 mr-2" />
                      Deploy Your First Bot
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              deployments.map((deployment) => (
                <Card key={deployment.id} className="glass overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="glass rounded-lg p-2">
                          <Send className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{deployment.botName}</CardTitle>
                          <p className="text-xs text-muted-foreground">{deployment.plan}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 glass rounded-full px-3 py-1">
                          {getStatusIcon(deployment.status)}
                          <span className="text-xs font-medium">{getStatusLabel(deployment.status)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLogs(deployment.id)}
                        >
                          {expandedLogs === deployment.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(deployment.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-mono text-[10px]">{deployment.id}</span>
                    </div>
                  </CardHeader>

                  {/* Expandable Logs */}
                  {expandedLogs === deployment.id && (
                    <CardContent className="pt-0">
                      <div className="bg-background/80 rounded-lg p-4 border border-border/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Terminal className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Live Logs</span>
                        </div>
                        <div className="font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
                          {deployment.logs.map((log, i) => (
                            <div key={i} className="text-muted-foreground hover:text-foreground transition-colors">
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
