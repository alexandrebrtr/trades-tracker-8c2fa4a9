
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

// Cette fonction récupère les trades Binance et les enregistre dans Supabase
Deno.serve(async (req) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId, apiKey, secretKey, startTime } = await req.json()

    if (!userId || !apiKey || !secretKey) {
      return new Response(
        JSON.stringify({ error: 'Paramètres manquants (userId, apiKey, secretKey)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Créer un client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Calcul du timestamp de début si non fourni
    const startTimeMs = startTime 
      ? new Date(startTime).getTime() 
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime() // Par défaut: 30 jours en arrière

    // Récupérer les trades de Binance
    const binanceTrades = await fetchBinanceTrades(apiKey, secretKey, startTimeMs)
    console.log(`Récupération de ${binanceTrades.length} trades depuis Binance`)

    // Convertir les trades Binance au format de notre application
    const formattedTrades = convertBinanceTradesToAppFormat(binanceTrades, userId)
    
    // Enregistrer les trades dans la base de données
    const { data, error } = await insertTrades(supabase, formattedTrades)

    if (error) {
      throw new Error(`Erreur lors de l'insertion des trades: ${error.message}`)
    }

    // Retourner les trades synchronisés
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${data.length} trades synchronisés avec succès`,
        newTradesCount: data.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur de synchronisation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Fonction pour récupérer les trades depuis l'API Binance
async function fetchBinanceTrades(apiKey: string, secretKey: string, startTime: number) {
  try {
    // Créer une signature pour l'authentification Binance
    const timestamp = Date.now()
    const queryString = `timestamp=${timestamp}&recvWindow=60000`
    
    // Créer une signature HMAC SHA256
    const encoder = new TextEncoder()
    const key = encoder.encode(secretKey)
    const message = encoder.encode(queryString)
    const cryptoKey = await crypto.subtle.importKey(
      'raw', key, { name: 'HMAC', hash: 'SHA-256' }, 
      false, ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, message)
    
    // Convertir signature en hex
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    // Construire l'URL de l'API Binance
    const url = `https://api.binance.com/api/v3/myTrades?${queryString}&signature=${signatureHex}`
    
    // Effectuer la requête à l'API Binance
    const response = await fetch(url, {
      headers: {
        'X-MBX-APIKEY': apiKey
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erreur API Binance (${response.status}): ${errorText}`)
    }
    
    const trades = await response.json()
    return trades
  } catch (error) {
    console.error('Erreur lors de la récupération des trades Binance:', error)
    throw error
  }
}

// Fonction pour convertir les trades Binance au format de notre application
function convertBinanceTradesToAppFormat(binanceTrades: any[], userId: string) {
  return binanceTrades.map(trade => {
    // Calcul du P&L
    const isBuyer = trade.isBuyer
    const price = parseFloat(trade.price)
    const qty = parseFloat(trade.qty)
    const commission = parseFloat(trade.commission || '0')
    
    // Pour un trade simple, on ne peut pas calculer le P&L sans le prix de sortie
    // Nous utilisons donc une estimation basée sur le prix actuel ou le dernier prix connu
    // Dans une implémentation réelle, il faudrait associer les ordres d'entrée et de sortie
    
    // Simplification: on utilise une commission comme estimation de P&L
    // Dans une implémentation complète, vous devriez calculer correctement le P&L
    const estimatedPnl = isBuyer ? -commission : commission
    
    return {
      user_id: userId,
      symbol: trade.symbol,
      type: isBuyer ? 'long' : 'short',
      entry_price: price,
      exit_price: price, // Simplification
      size: qty,
      fees: commission,
      pnl: estimatedPnl,
      date: new Date(trade.time).toISOString(),
      created_at: new Date().toISOString(),
      strategy: 'Binance Auto-Import',
      notes: `Trade ID: ${trade.id}, Order ID: ${trade.orderId}`
    }
  })
}

// Fonction pour insérer les trades dans la base de données
async function insertTrades(supabase: any, trades: any[]) {
  // Vérifier si des trades existent déjà (en se basant sur les notes qui contiennent l'ID du trade)
  const existingTradesIds = new Set()
  
  for (const trade of trades) {
    const { data, error } = await supabase
      .from('trades')
      .select('id')
      .like('notes', `%Trade ID: ${trade.notes.split(',')[0].split(':')[1].trim()}%`)
      .eq('user_id', trade.user_id)
    
    if (error) throw error
    
    if (data && data.length > 0) {
      data.forEach((item: any) => existingTradesIds.add(item.id))
    }
  }
  
  // Filtrer pour ne garder que les nouveaux trades
  const newTrades = trades.filter(trade => {
    const tradeId = trade.notes.split(',')[0].split(':')[1].trim()
    return !Array.from(existingTradesIds).some((id: any) => 
      id.includes(`Trade ID: ${tradeId}`)
    )
  })
  
  // S'il y a des nouveaux trades, les insérer
  if (newTrades.length > 0) {
    return await supabase.from('trades').insert(newTrades).select()
  }
  
  return { data: [], error: null }
}
