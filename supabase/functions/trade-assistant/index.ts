
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { OpenAI } from "https://esm.sh/openai@4.28.0";

// Configuration des en-têtes CORS pour permettre l'accès depuis n'importe quelle origine
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gestion des requêtes préliminaires CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Récupération de la clé API OpenAI depuis les variables d'environnement
  const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openAIApiKey) {
    console.error("OpenAI API key is not configured");
    return new Response(
      JSON.stringify({
        error: "La clé API OpenAI n'est pas configurée. Veuillez l'ajouter dans les secrets de la fonction edge Supabase."
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    // Analyse du corps de la requête avec gestion des erreurs
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Format de requête invalide" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const { message, model = "gpt-4o-mini" } = requestData;
    
    if (!message) {
      console.error("No message provided");
      return new Response(
        JSON.stringify({ error: "Aucun message fourni" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log(`Traitement de la requête de chat avec le modèle: ${model}`);
    console.log(`Message: ${message.substring(0, 100)}...`); // Log only the first 100 chars
    
    // Initialisation du client OpenAI
    const openai = new OpenAI({
      apiKey: openAIApiKey
    });
    
    // Appel à l'API OpenAI avec le SDK officiel
    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: "Vous êtes TraderAssistant, un expert en trading et en finance. Vous fournissez des analyses de marché, des conseils stratégiques et des informations sur les actifs financiers. Vos réponses sont précises, éducatives et adaptées aux besoins des traders, qu'ils soient débutants ou expérimentés."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });
      
      // Extraction de la réponse
      const aiResponse = completion.choices[0].message.content;
      console.log("Generated AI response successfully");
      
      return new Response(
        JSON.stringify({ response: aiResponse }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (apiError) {
      console.error("OpenAI API error:", apiError);
      throw new Error(apiError.message || "Erreur lors de l'appel à l'API OpenAI");
    }
  } catch (error) {
    console.error("Error in trade-assistant function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Une erreur est survenue lors du traitement de votre demande",
        details: "Veuillez réessayer avec une autre question ou contacter le support si le problème persiste."
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
