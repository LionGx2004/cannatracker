import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  strain: string;
  amount: number;
  time: string;
  notes: string;
}

interface EditSessionDialogProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (session: Session) => void;
}

const sessionSchema = z.object({
  strain: z.string().trim().min(1, { message: "Sorte ist erforderlich" }).max(100),
  amount: z.number().positive({ message: "Menge muss größer als 0 sein" }).max(1000),
  notes: z.string().max(500, { message: "Notizen zu lang (max 500 Zeichen)" }),
});

export const EditSessionDialog = ({
  session,
  open,
  onOpenChange,
  onSave,
}: EditSessionDialogProps) => {
  const { toast } = useToast();
  const [strain, setStrain] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (session) {
      setStrain(session.strain);
      setAmount(session.amount.toString());
      setNotes(session.notes || "");
    }
  }, [session]);

  const handleSave = () => {
    if (!session) return;

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

    onSave({
      ...session,
      strain: validation.data.strain,
      amount: validation.data.amount,
      notes: validation.data.notes,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session bearbeiten</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Sorte</label>
            <Input
              value={strain}
              onChange={(e) => setStrain(e.target.value)}
              placeholder="z.B. Purple Haze"
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
