import { Card } from "@/components/ui/card";
import { Calendar, Leaf, FileText } from "lucide-react";

interface SessionCardProps {
  strain: string;
  amount: number;
  time: string;
  notes?: string;
}

export const SessionCard = ({ strain, amount, time, notes }: SessionCardProps) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-card via-card to-card/80 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">{strain}</h3>
        </div>
        <span className="text-2xl font-bold text-primary">{amount.toFixed(1)}g</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Calendar className="w-4 h-4" />
        <span>{formatTime(time)}</span>
      </div>

      {notes && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">{notes}</p>
          </div>
        </div>
      )}
    </Card>
  );
};
