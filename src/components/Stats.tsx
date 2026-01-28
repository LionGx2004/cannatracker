import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Leaf, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useMemo, useState } from "react";

type TimeFilter = "week" | "month" | "year" | "all";

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

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: "week", label: "Woche" },
  { value: "month", label: "Monat" },
  { value: "year", label: "Jahr" },
  { value: "all", label: "Alle" },
];

export const Stats = ({ sessions }: StatsProps) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");

  // Filter sessions by time period
  const filteredSessions = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeFilter) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        return sessions;
    }

    return sessions.filter((s) => new Date(s.time) >= cutoffDate);
  }, [sessions, timeFilter]);

  const totalAmount = filteredSessions.reduce((sum, session) => {
    return sum + session.amount;
  }, 0);

  const today = new Date().toDateString();
  const todaySessions = filteredSessions.filter(
    (session) => new Date(session.time).toDateString() === today
  );

  const uniqueStrains = new Set(filteredSessions.map((s) => s.strain)).size;

  // Calculate data for consumption chart based on filter
  const periodData = useMemo(() => {
    const now = new Date();

    if (timeFilter === "week") {
      const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
      const weekData: { label: string; amount: number; sessions: number }[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const daySessions = filteredSessions.filter(
          (s) => new Date(s.time).toDateString() === dateStr
        );
        const dayAmount = daySessions.reduce((sum, s) => sum + s.amount, 0);

        weekData.push({
          label: days[date.getDay()],
          amount: parseFloat(dayAmount.toFixed(2)),
          sessions: daySessions.length,
        });
      }
      return weekData;
    }

    if (timeFilter === "month") {
      const monthData: { label: string; amount: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const dayAmount = filteredSessions
          .filter((s) => new Date(s.time).toDateString() === dateStr)
          .reduce((sum, s) => sum + s.amount, 0);

        monthData.push({
          label: `${date.getDate()}.${date.getMonth() + 1}`,
          amount: parseFloat(dayAmount.toFixed(2)),
        });
      }
      return monthData;
    }

    if (timeFilter === "year") {
      const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
      const yearData: { label: string; amount: number }[] = [];

      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const month = date.getMonth();
        const year = date.getFullYear();

        const monthAmount = filteredSessions
          .filter((s) => {
            const sDate = new Date(s.time);
            return sDate.getMonth() === month && sDate.getFullYear() === year;
          })
          .reduce((sum, s) => sum + s.amount, 0);

        yearData.push({
          label: months[month],
          amount: parseFloat(monthAmount.toFixed(2)),
        });
      }
      return yearData;
    }

    // "all" - group by month
    const allData: { label: string; amount: number }[] = [];
    const grouped: Record<string, number> = {};

    filteredSessions.forEach((s) => {
      const date = new Date(s.time);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      grouped[key] = (grouped[key] || 0) + s.amount;
    });

    Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .forEach(([key, amount]) => {
        const [year, month] = key.split("-");
        allData.push({
          label: `${month}/${year.slice(2)}`,
          amount: parseFloat(amount.toFixed(2)),
        });
      });

    return allData;
  }, [filteredSessions, timeFilter]);

  // Calculate strain distribution for pie chart
  const strainDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    filteredSessions.forEach((s) => {
      distribution[s.strain] = (distribution[s.strain] || 0) + s.amount;
    });

    return Object.entries(distribution)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 strains
  }, [filteredSessions]);

  const getChartTitle = () => {
    switch (timeFilter) {
      case "week":
        return "Wochenübersicht";
      case "month":
        return "Monatsübersicht";
      case "year":
        return "Jahresübersicht";
      case "all":
        return "Gesamtübersicht";
    }
  };

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
      {/* Time Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {TIME_FILTERS.map((filter) => (
          <Button
            key={filter.value}
            variant={timeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter(filter.value)}
            className="min-w-[80px]"
          >
            {filter.label}
          </Button>
        ))}
      </div>

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
      {filteredSessions.length >= 2 && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Period Consumption Chart */}
          <Card className="p-6 border-border/50 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">{getChartTitle()}</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                {timeFilter === "week" ? (
                  <BarChart data={periodData}>
                    <XAxis 
                      dataKey="label" 
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
                ) : (
                  <AreaChart data={periodData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="label" 
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
                )}
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Strain Distribution Pie Chart */}
          {strainDistribution.length >= 2 && (
            <Card className="p-6 border-border/50 md:col-span-2">
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
                      innerRadius={50}
                      outerRadius={80}
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
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {strainDistribution.map((strain, index) => (
                  <div key={strain.name} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="text-muted-foreground">
                      {strain.name} ({strain.value}g)
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
