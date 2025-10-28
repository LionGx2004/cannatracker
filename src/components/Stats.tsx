import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Leaf } from "lucide-react";

interface Session {
  strain: string;
  amount: string;
  time: string;
  notes: string;
}

interface StatsProps {
  sessions: Session[];
}

export const Stats = ({ sessions }: StatsProps) => {
  const totalAmount = sessions.reduce((sum, session) => {
    return sum + parseFloat(session.amount);
  }, 0);

  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (session) => new Date(session.time).toDateString() === today
  );

  const uniqueStrains = new Set(sessions.map((s) => s.strain)).size;

  const stats = [
    {
      label: "Gesamt verbraucht",
      value: `${totalAmount.toFixed(1)}g`,
      icon: Leaf,
      gradient: "from-primary/20 to-primary/5",
    },
    {
      label: "Sessions heute",
      value: todaySessions.length,
      icon: Calendar,
      gradient: "from-secondary/20 to-secondary/5",
    },
    {
      label: "Verschiedene Sorten",
      value: uniqueStrains,
      icon: TrendingUp,
      gradient: "from-accent/20 to-accent/5",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`p-6 bg-gradient-to-br ${stat.gradient} border-border/50 hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <Icon className="w-8 h-8 text-primary opacity-60" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
