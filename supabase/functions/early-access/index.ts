import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FORWARD_TO = "be.there.accnts@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "A valid email is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Persist the email (ignore duplicate errors so re-submits don't fail).
    const { error: insertError } = await supabase
      .from("early_access_emails")
      .insert({ email: cleanEmail });

    if (insertError && insertError.code !== "23505") {
      throw insertError;
    }

    // Forward a notification to the owner's Gmail via Resend.
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Be Ther Early Access <onboarding@resend.dev>",
          to: FORWARD_TO,
          subject: `New early access signup: ${cleanEmail}`,
          text: `Someone new joined the early access list!\n\nEmail: ${cleanEmail}\n\nThey'll be stored in the early_access_emails table.`,
        }),
      });
      if (!res.ok) {
        console.error("Resend failed:", await res.text());
      }
    } else {
      console.warn("RESEND_API_KEY not set — email stored in database but not forwarded.");
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("early-access error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
