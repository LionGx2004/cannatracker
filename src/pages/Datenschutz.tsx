import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Datenschutz = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

        <div className="space-y-8 text-foreground/80">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="text-lg font-medium mb-2 text-foreground">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              2. Verantwortlicher
            </h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <div className="mt-2">
              <p>Pascal Mark</p>
              <p>Breitenfeld 10B</p>
              <p>79761 Waldshut-Tiengen</p>
              <p>Deutschland</p>
              <p className="mt-2">Tel.: +49 171 5624532</p>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:pascal.mark@cannatracker.online"
                  className="text-primary hover:underline"
                >
                  pascal.mark@cannatracker.online
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              3. Datenerfassung auf dieser Website
            </h2>
            
            <h3 className="text-lg font-medium mb-2 text-foreground">Cookies</h3>
            <p className="mb-4">
              Diese Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf
              Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher
              und effektiver zu machen. Einige Cookies sind „Session-Cookies", die nach Ende Ihrer
              Browser-Sitzung automatisch gelöscht werden.
            </p>

            <h3 className="text-lg font-medium mb-2 text-foreground">Registrierung und Nutzerkonto</h3>
            <p className="mb-4">
              Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen zu nutzen.
              Die dabei eingegebenen Daten verwenden wir nur zum Zweck der Nutzung des jeweiligen
              Angebotes. Die Pflichtangaben bei der Registrierung müssen vollständig angegeben werden.
              Anderenfalls werden wir die Registrierung ablehnen.
            </p>
            <p className="mb-4">
              Bei der Registrierung erheben wir folgende Daten:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>E-Mail-Adresse</li>
              <li>Passwort (verschlüsselt gespeichert)</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-foreground">Nutzungsdaten</h3>
            <p className="mb-4">
              Wenn Sie unsere App nutzen, speichern wir die von Ihnen eingegebenen Session-Daten
              (Sorte, Menge, Notizen, Zeitstempel). Diese Daten sind nur für Sie sichtbar und werden
              nicht an Dritte weitergegeben.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              4. Ihre Rechte
            </h2>
            <p className="mb-4">Sie haben jederzeit das Recht:</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Auskunft über Ihre gespeicherten Daten zu erhalten</li>
              <li>Die Berichtigung unrichtiger Daten zu verlangen</li>
              <li>Die Löschung Ihrer Daten zu verlangen</li>
              <li>Die Einschränkung der Datenverarbeitung zu verlangen</li>
              <li>Ihre Daten in einem übertragbaren Format zu erhalten</li>
              <li>Ihre Einwilligung jederzeit zu widerrufen</li>
            </ul>
            <p>
              Sie können Ihren Account und alle damit verbundenen Daten jederzeit selbst über die
              App-Einstellungen löschen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              5. Hosting
            </h2>
            <p className="mb-4">
              Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website
              erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich
              insbesondere um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten,
              Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten handeln.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              6. SSL-/TLS-Verschlüsselung
            </h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
              Inhalte eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
              daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an
              dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              7. Aktualität und Änderung dieser Datenschutzerklärung
            </h2>
            <p>
              Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Januar 2025. Durch die
              Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher Vorgaben kann
              es notwendig werden, diese Datenschutzerklärung zu ändern.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Datenschutz;
