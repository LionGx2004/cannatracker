import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Impressum</h1>

        <div className="space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">Angaben gemäß § 5 TMG</h2>
            <p>Pascal Mark</p>
            <p>Breitenfeld 10B</p>
            <p>79761 Waldshut-Tiengen</p>
            <p>Deutschland</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">Kontakt</h2>
            <p>Tel.: +49 171 5624532</p>
            <p>
              E-Mail:{" "}
              <a
                href="mailto:pascal.mark@cannatracker.online"
                className="text-primary hover:underline"
              >
                pascal.mark@cannatracker.online
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              Verbraucherstreitbeilegung
            </h2>
            <p>
              Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
