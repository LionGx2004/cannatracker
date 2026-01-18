import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session as SupabaseSession } from "@supabase/supabase-js";
import { SessionForm } from "@/components/SessionForm";
import { SessionList } from "@/components/SessionList";
import { Stats } from "@/components/Stats";
import { ChatBot } from "@/components/ChatBot";
import { EditSessionDialog } from "@/components/EditSessionDialog";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Session {
  id: string;
  strain: string;
  amount: number;
  time: string;
  notes: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load sessions when user is authenticated
  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Laden",
        description: "Sessions konnten nicht geladen werden.",
      });
      return;
    }

    if (data) {
      setSessions(
        data.map((s) => ({
          id: s.id,
          strain: s.strain,
          amount: s.amount,
          time: s.created_at,
          notes: s.notes || "",
        }))
      );
    }
  };

  const handleAddSession = async (sessionData: {
    strain: string;
    amount: number;
    notes: string;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("sessions")
      .insert([
        {
          user_id: user.id,
          strain: sessionData.strain,
          amount: sessionData.amount,
          notes: sessionData.notes,
        },
      ])
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Session konnte nicht gespeichert werden.",
      });
      return;
    }

    if (data) {
      const newSession: Session = {
        id: data.id,
        strain: data.strain,
        amount: data.amount,
        time: data.created_at,
        notes: data.notes || "",
      };
      setSessions([newSession, ...sessions]);
      
      toast({
        title: "Session gespeichert!",
        description: `${sessionData.strain} wurde hinzugefügt.`,
      });
    }
  };

  const handleEditSession = (id: string) => {
    const sessionToEdit = sessions.find((s) => s.id === id);
    if (sessionToEdit) {
      setEditingSession(sessionToEdit);
      setEditDialogOpen(true);
    }
  };

  const handleSaveSession = async (updatedSession: Session) => {
    const { error } = await supabase
      .from("sessions")
      .update({
        strain: updatedSession.strain,
        amount: updatedSession.amount,
        notes: updatedSession.notes,
      })
      .eq("id", updatedSession.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Session konnte nicht aktualisiert werden.",
      });
      return;
    }

    setSessions(
      sessions.map((s) =>
        s.id === updatedSession.id ? updatedSession : s
      )
    );

    toast({
      title: "Session aktualisiert!",
      description: `${updatedSession.strain} wurde gespeichert.`,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.rpc("delete_current_user");
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: "Account konnte nicht gelöscht werden.",
        });
        return;
      }

      toast({
        title: "Account gelöscht",
        description: "Dein Account wurde erfolgreich gelöscht.",
      });
      
      // Sign out and redirect
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <Leaf className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
          <div className="mt-4 flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Account löschen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Account wirklich löschen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Diese Aktion kann nicht rückgängig gemacht werden. Dein Account und alle deine Sessions werden dauerhaft gelöscht.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>
                    Ja, Account löschen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
          <SessionList sessions={sessions} onEditSession={handleEditSession} />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-border/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Track responsibly. This app is for personal tracking purposes only.</p>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatBot
        sessions={sessions.map((s) => ({
          id: s.id,
          strain: s.strain,
          amount: s.amount,
          notes: s.notes,
          created_at: s.time,
        }))}
      />

      {/* Edit Session Dialog */}
      <EditSessionDialog
        session={editingSession}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveSession}
      />
    </div>
  );
};

export default Index;
