import { SessionCard } from "./SessionCard";
import { Clock } from "lucide-react";

interface Session {
  id: string;
  strain: string;
  amount: number;
  time: string;
  notes: string;
}

interface SessionListProps {
  sessions: Session[];
  onEditSession?: (id: string) => void;
}

export const SessionList = ({ sessions, onEditSession }: SessionListProps) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground text-lg">Noch keine Sessions getracked</p>
        <p className="text-muted-foreground text-sm mt-2">Starte deine erste Session oben!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold">Deine Sessions</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <SessionCard 
            key={session.id} 
            {...session} 
            onEdit={onEditSession}
          />
        ))}
      </div>
    </div>
  );
};
