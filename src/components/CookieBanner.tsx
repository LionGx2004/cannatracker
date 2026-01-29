import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cookie, Settings, Shield, BarChart3 } from "lucide-react";

const COOKIE_CONSENT_KEY = "cookie-consent";

interface CookiePreferences {
  essential: boolean;
  marketing: boolean;
}

const getStoredPreferences = (): CookiePreferences | null => {
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    // Legacy format compatibility
    if (stored === "accepted") {
      return { essential: true, marketing: true };
    } else if (stored === "declined") {
      return { essential: true, marketing: false };
    }
    return null;
  }
};

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    marketing: false,
  });

  useEffect(() => {
    const stored = getStoredPreferences();
    if (!stored) {
      setShowBanner(true);
    } else {
      setPreferences(stored);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, marketing: true });
  };

  const handleDeclineAll = () => {
    savePreferences({ essential: true, marketing: false });
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card/95 backdrop-blur-md border-t border-border shadow-lg animate-in slide-in-from-bottom-4 duration-300">
        <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p>
                Wir verwenden Cookies, um deine Einstellungen zu speichern und dein Erlebnis zu verbessern.{" "}
                <Link to="/datenschutz" className="text-primary hover:underline">
                  Mehr erfahren
                </Link>
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSettings(true)}
              className="gap-1"
            >
              <Settings className="w-4 h-4" />
              Einstellungen
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeclineAll}>
              Ablehnen
            </Button>
            <Button size="sm" onClick={handleAcceptAll}>
              Alle akzeptieren
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-primary" />
              Cookie-Einstellungen
            </DialogTitle>
            <DialogDescription>
              Hier kannst du deine Cookie-Präferenzen anpassen. Essentielle Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Essential Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Essentielle Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Notwendig für Grundfunktionen wie Navigation, Authentifizierung und Speicherung deiner Einstellungen.
                  </p>
                </div>
              </div>
              <Switch 
                checked={true} 
                disabled 
                className="opacity-50"
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <Label htmlFor="marketing-cookies" className="text-sm font-medium">Marketing & Analyse Cookies</Label>
                  <p className="text-xs text-muted-foreground">
                    Helfen uns zu verstehen, wie Besucher die Website nutzen, um unser Angebot zu verbessern.
                  </p>
                </div>
              </div>
              <Switch 
                id="marketing-cookies"
                checked={preferences.marketing}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, marketing: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleDeclineAll}
              className="w-full sm:w-auto"
            >
              Nur essentielle
            </Button>
            <Button 
              onClick={handleSaveSettings}
              className="w-full sm:w-auto"
            >
              Einstellungen speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
