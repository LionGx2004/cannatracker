import { useState } from "react";
import { SessionForm } from "@/components/SessionForm";
import { SessionList } from "@/components/SessionList";
import { Stats } from "@/components/Stats";
import { Leaf } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface Session {
  strain: string;
  amount: string;
  time: string;
  notes: string;
}

const Index = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  const handleAddSession = (session: Session) => {
    setSessions([session, ...sessions]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-[40vh] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="w-12 h-12 text-primary animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smoke Tracker
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tracke deine Sessions, behalte den Überblick und verstehe deine Gewohnheiten
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Stats Section */}
        {sessions.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Stats sessions={sessions} />
          </div>
        )}

        {/* Add Session Section */}
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SessionForm onAddSession={handleAddSession} />
        </div>

        {/* Sessions List */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <SessionList sessions={sessions} />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-border/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Track responsibly. This app is for personal tracking purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
