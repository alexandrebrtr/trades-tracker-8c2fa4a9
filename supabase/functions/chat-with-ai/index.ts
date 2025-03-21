
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get OpenAI API key from environment variable
  const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openAIApiKey) {
    console.error("OpenAI API key is not configured");
    return new Response(
      JSON.stringify({
        error: "OpenAI API key is not configured. Please add it in the Supabase Edge Function Secrets."
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    // Parse the request body with error handling
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const { prompt, model } = requestData;
    
    if (!prompt) {
      console.error("No prompt provided");
      return new Response(
        JSON.stringify({ error: "No prompt provided" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log(`Processing chat request with model: ${model || "gpt-4o-mini"}`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`); // Log only the first 100 chars to avoid overflow
    
    // Call OpenAI API with comprehensive error handling
    let openAIResponse;
    try {
      openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          model: model || "gpt-4o-mini", // Use specified model or default
          messages: [
            {
              role: "system",
              content: "Vous êtes TraderBot, un assistant spécialisé dans l'aide aux traders. Vous fournissez des analyses de marché, des conseils sur les stratégies de trading et répondez aux questions sur la finance. Vos réponses sont précises, éducatives et adaptées aux besoins des traders."
            },
            {
              role: "user",
              content: prompt
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
      throw new Error(errorMessage);
    }
    
    // Parse the OpenAI response
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
    
    // Validate the response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Invalid response structure from OpenAI:", data);
      throw new Error("Structure de réponse OpenAI invalide");
    }
    
    // Extract the response
    const aiResponse = data.choices[0].message.content;
    console.log("Generated AI response successfully");
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Error in chat-with-ai function:", error);
    
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
