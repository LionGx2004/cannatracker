import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Leaf, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useMemo } from "react";

interface Session {
  strain: string;
  amount: number;
  time: string;
  notes: string;
}

interface StatsProps {
  sessions: Session[];
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(145 55% 45%)",
  "hsl(265 50% 60%)",
  "hsl(180 50% 45%)",
  "hsl(30 70% 50%)",
  "hsl(340 60% 55%)",
];

export const Stats = ({ sessions }: StatsProps) => {
  const totalAmount = sessions.reduce((sum, session) => {
    return sum + session.amount;
  }, 0);

  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (session) => new Date(session.time).toDateString() === today
  );

  const uniqueStrains = new Set(sessions.map((s) => s.strain)).size;

  // Calculate data for weekly consumption chart
  const weeklyData = useMemo(() => {
    const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const now = new Date();
    const weekData: { day: string; amount: number; sessions: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const daySessions = sessions.filter(
        (s) => new Date(s.time).toDateString() === dateStr
      );
      const dayAmount = daySessions.reduce((sum, s) => sum + s.amount, 0);

      weekData.push({
        day: days[date.getDay()],
        amount: parseFloat(dayAmount.toFixed(2)),
        sessions: daySessions.length,
      });
    }

    return weekData;
  }, [sessions]);

  // Calculate strain distribution for pie chart
  const strainDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    sessions.forEach((s) => {
      distribution[s.strain] = (distribution[s.strain] || 0) + s.amount;
    });

    return Object.entries(distribution)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 strains
  }, [sessions]);

  // Calculate monthly trend
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const trendData: { date: string; amount: number }[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayAmount = sessions
        .filter((s) => new Date(s.time).toDateString() === dateStr)
        .reduce((sum, s) => sum + s.amount, 0);

      trendData.push({
        date: `${date.getDate()}.${date.getMonth() + 1}`,
        amount: parseFloat(dayAmount.toFixed(2)),
      });
    }

    return trendData;
  }, [sessions]);

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">{payload[0].value}g</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
          <p className="text-sm text-primary">{payload[0].value}g</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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

      {/* Charts Section */}
      {sessions.length >= 2 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Weekly Consumption Bar Chart */}
          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Wochenübersicht</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `${value}g`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Strain Distribution Pie Chart */}
          {strainDistribution.length >= 2 && (
            <Card className="p-6 border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-secondary" />
                <h3 className="font-semibold text-foreground">Sorten-Verteilung</h3>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={strainDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {strainDistribution.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {strainDistribution.slice(0, 4).map((strain, index) => (
                  <div key={strain.name} className="flex items-center gap-1 text-xs">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="text-muted-foreground truncate max-w-[80px]">
                      {strain.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 30-Day Trend Area Chart */}
          <Card className="p-6 border-border/50 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">30-Tage Trend</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `${value}g`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
