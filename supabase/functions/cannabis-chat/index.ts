import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from user's session data
    let userContext = "";
    if (sessionData && sessionData.length > 0) {
      const strainCounts: Record<string, { count: number; totalAmount: number }> = {};
      let totalSessions = sessionData.length;
      let totalAmount = 0;

      sessionData.forEach((session: { strain: string; amount: number; notes?: string }) => {
        if (!strainCounts[session.strain]) {
          strainCounts[session.strain] = { count: 0, totalAmount: 0 };
        }
        strainCounts[session.strain].count++;
        strainCounts[session.strain].totalAmount += session.amount;
        totalAmount += session.amount;
      });

      const topStrains = Object.entries(strainCounts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([strain, data]) => `${strain} (${data.count} sessions, ${data.totalAmount.toFixed(1)}g total)`)
        .join(", ");

      userContext = `
User's Session History:
- Total sessions: ${totalSessions}
- Total consumption: ${totalAmount.toFixed(1)}g
- Top strains: ${topStrains}

Use this data to provide personalized recommendations and insights when relevant.`;
    }

    const systemPrompt = `Du bist ein freundlicher und sachkundiger Cannabis-Berater. Du hilfst Nutzern mit Informationen über Cannabis-Sorten, deren Wirkungen, Terpene und gibst personalisierte Empfehlungen basierend auf ihren Vorlieben und Session-Daten.

Wichtige Richtlinien:
- Antworte immer auf Deutsch
- Sei sachlich und informativ über Cannabis-Sorten und deren Eigenschaften
- Unterscheide zwischen Indica, Sativa und Hybrid-Sorten
- Erkläre Terpene und deren Einfluss auf die Wirkung
- Gib personalisierte Empfehlungen basierend auf den Session-Daten des Nutzers
- Betone verantwortungsvollen Konsum
- Halte Antworten prägnant aber informativ
- Bei Fragen zu Gesundheit oder medizinischen Themen weise darauf hin, dass ein Arzt konsultiert werden sollte

${userContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit erreicht. Bitte versuche es später erneut." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Keine Credits mehr. Bitte lade dein Konto auf." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI-Dienst vorübergehend nicht verfügbar." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("cannabis-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
