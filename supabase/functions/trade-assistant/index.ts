
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    
    // Appel à l'API OpenAI avec gestion complète des erreurs
    let openAIResponse;
    try {
      openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
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
        }),
      });
    } catch (fetchError) {
      console.error("Network error during OpenAI API call:", fetchError);
      throw new Error("Erreur de connexion à l'API OpenAI. Veuillez vérifier votre connexion internet et réessayer.");
    }

    if (!openAIResponse.ok) {
      let errorMessage;
      try {
        const errorData = await openAIResponse.json();
        console.error("OpenAI API error:", errorData);
        errorMessage = errorData.error?.message || `API OpenAI a retourné le statut ${openAIResponse.status}`;
      } catch (e) {
        errorMessage = `API OpenAI a retourné le statut ${openAIResponse.status} sans détails supplémentaires`;
      }
      console.error(`Error from OpenAI API: ${errorMessage}`);
      throw new Error(errorMessage);
    }
    
    // Analyse de la réponse OpenAI
    let data;
    try {
      data = await openAIResponse.json();
    } catch (jsonError) {
      console.error("Failed to parse OpenAI response:", jsonError);
      throw new Error("La réponse de l'API OpenAI n'est pas au format JSON valide.");
    }
    
    if (data.error) {
      console.error("OpenAI API error in response:", data.error);
      throw new Error(data.error.message || "Erreur de l'API OpenAI");
    }
    
    // Validation de la structure de la réponse
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Invalid response structure from OpenAI:", data);
      throw new Error("Structure de réponse OpenAI invalide");
    }
    
    // Extraction de la réponse
    const aiResponse = data.choices[0].message.content;
    console.log("Generated AI response successfully");
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
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
