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
    // ============== AUTHENTICATION ==============
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentifizierung erforderlich" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Create client with user's token to respect RLS
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      }
    });

    // Verify the user's token
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Ungültige Authentifizierung" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    // ============== END AUTHENTICATION ==============

    const { messages } = await req.json();

    // ============== INPUT VALIDATION ==============
    // Validate messages array
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Ungültiges Nachrichtenformat" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Zu viele Nachrichten (max 50)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate message structure
    for (const msg of messages) {
      if (!msg.role || !["user", "assistant"].includes(msg.role)) {
        return new Response(
          JSON.stringify({ error: "Ungültige Nachrichtenrolle" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!msg.content || typeof msg.content !== "string") {
        return new Response(
          JSON.stringify({ error: "Ungültiger Nachrichteninhalt" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (msg.content.length > 4000) {
        return new Response(
          JSON.stringify({ error: "Nachricht zu lang (max 4000 Zeichen)" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    // ============== END INPUT VALIDATION ==============

    // Fetch user's session data server-side (RLS will filter by user_id)
    const { data: sessionData } = await supabaseAuth
      .from('sessions')
      .select('strain, amount, notes, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch strain data with effects and terpenes using authenticated client
    // These tables have public SELECT policies, so no service role needed
    const { data: strains } = await supabaseAuth
      .from("strains")
      .select(`
        name, type, thc_min, thc_max, description_de, flavor_de, aroma_de,
        strain_effects(
          intensity,
          effects(name, name_de, category)
        ),
        strain_terpenes(
          dominance,
          terpenes(name, scent_de, effects_de)
        )
      `)
      .limit(30);

    // Fetch all terpenes for reference (public read access via RLS)
    const { data: terpenes } = await supabaseAuth
      .from("terpenes")
      .select("name, scent_de, effects_de, also_found_in_de");

    // Fetch all effects for reference (public read access via RLS)
    const { data: effects } = await supabaseAuth
      .from("effects")
      .select("name, name_de, description_de, category");

    // Build strain database context
    let strainContext = "";
    if (strains && strains.length > 0) {
      strainContext = `
CANNABIS-SORTEN DATENBANK (nutze diese Informationen für präzise Antworten):

${strains.map((s: any) => {
  const effectsList = s.strain_effects
    ?.map((se: any) => `${se.effects?.name_de} (${se.intensity})`)
    .join(", ") || "keine";
  const terpenesList = s.strain_terpenes
    ?.map((st: any) => `${st.terpenes?.name} - ${st.dominance}`)
    .join(", ") || "keine";
  return `**${s.name}** (${s.type})
- THC: ${s.thc_min}-${s.thc_max}%
- Beschreibung: ${s.description_de}
- Geschmack: ${s.flavor_de}
- Aroma: ${s.aroma_de}
- Effekte: ${effectsList}
- Terpene: ${terpenesList}`;
}).join("\n\n")}`;
    }

    // Build terpene reference
    let terpeneContext = "";
    if (terpenes && terpenes.length > 0) {
      terpeneContext = `
TERPENE REFERENZ:
${terpenes.map((t: any) => `- **${t.name}**: ${t.scent_de}. Wirkung: ${t.effects_de}. Auch in: ${t.also_found_in_de}`).join("\n")}`;
    }

    // Build effect categories
    let effectContext = "";
    if (effects && effects.length > 0) {
      const positiveEffects = effects.filter((e: any) => e.category === 'positive').map((e: any) => e.name_de).join(", ");
      const medicalEffects = effects.filter((e: any) => e.category === 'medical').map((e: any) => e.name_de).join(", ");
      const negativeEffects = effects.filter((e: any) => e.category === 'negative').map((e: any) => e.name_de).join(", ");
      effectContext = `
EFFEKT-KATEGORIEN:
- Positive Effekte: ${positiveEffects}
- Medizinische Effekte: ${medicalEffects}
- Mögliche Nebenwirkungen: ${negativeEffects}`;
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
        .map(([strain, data]) => `${strain} (${data.count} Sessions, ${data.totalAmount.toFixed(1)}g)`)
        .join(", ");

      userContext = `
NUTZER SESSION-HISTORIE:
- Gesamte Sessions: ${totalSessions}
- Gesamtkonsum: ${totalAmount.toFixed(1)}g
- Top-Sorten: ${topStrains}

Nutze diese Daten für personalisierte Empfehlungen!`;
    }

    const systemPrompt = `Du bist ein freundlicher und sachkundiger Cannabis-Berater mit Zugang zu einer umfangreichen Sorten-Datenbank. Du hilfst Nutzern mit präzisen Informationen über Cannabis-Sorten, deren Wirkungen, Terpene und gibst personalisierte Empfehlungen.

WICHTIGE RICHTLINIEN:
- Antworte IMMER auf Deutsch
- Nutze die Datenbank-Informationen für präzise, faktenbasierte Antworten
- Unterscheide zwischen Indica (entspannend), Sativa (energetisierend) und Hybrid-Sorten
- Erkläre Terpene und deren Einfluss auf die Wirkung (Entourage-Effekt)
- Gib personalisierte Empfehlungen basierend auf den Session-Daten des Nutzers
- Nenne THC-Gehalt wenn nach Potenz gefragt wird
- Betone verantwortungsvollen Konsum
- Halte Antworten prägnant aber informativ (max 3-4 Absätze)
- Bei medizinischen Fragen: empfehle Arztbesuch

${strainContext}

${terpeneContext}

${effectContext}

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
