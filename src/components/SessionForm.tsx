import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

interface SessionFormProps {
  onAddSession: (session: {
    strain: string;
    amount: number;
    notes: string;
  }) => void;
}

const sessionSchema = z.object({
  strain: z.string().trim().min(1, { message: "Sorte ist erforderlich" }).max(100),
  amount: z.number().positive({ message: "Menge muss größer als 0 sein" }).max(1000),
  notes: z.string().max(500, { message: "Notizen zu lang (max 500 Zeichen)" }),
});

export const SessionForm = ({ onAddSession }: SessionFormProps) => {
  const { toast } = useToast();
  const [strain, setStrain] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = sessionSchema.safeParse({
      strain,
      amount: parseFloat(amount),
      notes,
    });

    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Validierungsfehler",
        description: validation.error.errors[0].message,
      });
      return;
    }

    onAddSession({
      strain: validation.data.strain,
      amount: validation.data.amount,
      notes: validation.data.notes,
    });

    setStrain("");
    setAmount("");
    setNotes("");
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Neue Session</h2>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Sorte</label>
          <Input
            value={strain}
            onChange={(e) => setStrain(e.target.value)}
            placeholder="z.B. Purple Haze"
            required
            maxLength={100}
            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Menge (g)</label>
          <Input
            type="number"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.5"
            required
            min="0.1"
            max="1000"
            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Notizen (optional)</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Wie fühlst du dich?"
            maxLength={500}
            className="bg-background/50 border-border/50 focus:border-primary transition-colors min-h-[80px]"
          />
        </div>

        <Button type="submit" className="w-full" size="lg">
          Session hinzufügen
        </Button>
      </form>
    </Card>
  );
};
