import { useState, useMemo } from "react";
import { SessionCard } from "./SessionCard";
import { Clock, Search, ArrowUpDown, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onDeleteSession?: (id: string) => void;
}

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "strain-asc" | "strain-desc";

export const SessionList = ({ sessions, onEditSession, onDeleteSession }: SessionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const uniqueStrains = useMemo(() => {
    const strains = [...new Set(sessions.map((s) => s.strain))];
    return strains.sort((a, b) => a.localeCompare(b));
  }, [sessions]);

  const filteredAndSortedSessions = useMemo(() => {
    let result = [...sessions];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.strain.toLowerCase().includes(term) ||
          s.notes.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        case "date-asc":
          return new Date(a.time).getTime() - new Date(b.time).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        case "strain-asc":
          return a.strain.localeCompare(b.strain);
        case "strain-desc":
          return b.strain.localeCompare(a.strain);
        default:
          return 0;
      }
    });

    return result;
  }, [sessions, searchTerm, sortBy]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Deine Sessions</h2>
          <span className="text-sm text-muted-foreground">
            ({filteredAndSortedSessions.length} von {sessions.length})
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-[200px] bg-background/50 border-border/50"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sortieren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Neueste zuerst</SelectItem>
              <SelectItem value="date-asc">Älteste zuerst</SelectItem>
              <SelectItem value="amount-desc">Menge (hoch → niedrig)</SelectItem>
              <SelectItem value="amount-asc">Menge (niedrig → hoch)</SelectItem>
              <SelectItem value="strain-asc">Sorte (A-Z)</SelectItem>
              <SelectItem value="strain-desc">Sorte (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedSessions.length === 0 ? (
        <div className="text-center py-8">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">Keine Sessions gefunden</p>
          <p className="text-sm text-muted-foreground mt-1">
            Versuche einen anderen Suchbegriff
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedSessions.map((session) => (
            <SessionCard
              key={session.id}
              {...session}
              onEdit={onEditSession}
              onDelete={onDeleteSession}
            />
          ))}
        </div>
      )}
    </div>
  );
};
