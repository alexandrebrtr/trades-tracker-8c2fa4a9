
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

    // Send confirmation email to the person who submitted the form
    const emailToSender = await resend.emails.send({
      from: "Trades Tracker <onboarding@resend.dev>",
      to: [email],
      subject: "Nous avons reçu votre message !",
      html: `
        <h1>Merci de nous avoir contacté, ${name} !</h1>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <p>Pour rappel, voici votre message :</p>
        <blockquote>${message}</blockquote>
        <p>Cordialement,<br>L'équipe Trades Tracker</p>
      `,
    });

    // Send notification email to admin
    const emailToAdmin = await resend.emails.send({
      from: "Trades Tracker <onboarding@resend.dev>",
      to: ["trades.tracker.officiel@gmail.com"],
      subject: "Nouveau message de contact",
      html: `
        <h1>Nouveau message de contact</h1>
        <p><strong>De :</strong> ${name} (${email})</p>
        <p><strong>Message :</strong></p>
        <blockquote>${message}</blockquote>
      `,
    });

    console.log("Emails sent successfully:", { emailToSender, emailToAdmin });

    return new Response(
      JSON.stringify({ message: "Emails sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
