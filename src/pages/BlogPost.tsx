
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  
  // Mock blog post data
  const blogPosts = [
    {
      id: "1",
      title: language === "fr" ? "Comment tenir un journal de trading efficace" : "How to keep an effective trading journal",
      content: language === "fr" 
        ? `<p>La tenue d'un journal de trading est l'un des outils les plus puissants pour améliorer vos performances en tant que trader. Cet article explore les meilleures pratiques pour documenter vos trades et en tirer des enseignements précieux.</p>
           <h2>Pourquoi tenir un journal de trading ?</h2>
           <p>Un journal de trading bien tenu vous permet de :</p>
           <ul>
             <li>Identifier les modèles récurrents dans vos succès et échecs</li>
             <li>Maintenir la discipline et la responsabilité</li>
             <li>Quantifier objectivement vos performances</li>
             <li>Affiner votre stratégie au fil du temps</li>
           </ul>
           <h2>Les éléments essentiels d'un journal de trading</h2>
           <p>Un journal de trading efficace devrait inclure :</p>
           <ol>
             <li><strong>Informations de base :</strong> Date, heure, paire/actif, direction</li>
             <li><strong>Détails du trade :</strong> Prix d'entrée, taille de position, stop-loss, take-profit</li>
             <li><strong>Résultat :</strong> Prix de sortie, P&L, durée</li>
             <li><strong>Analyse technique :</strong> Indicateurs utilisés, configuration du graphique</li>
             <li><strong>Contexte :</strong> Conditions du marché, événements influents</li>
             <li><strong>État mental :</strong> Votre humeur, niveau de fatigue, confiance</li>
             <li><strong>Raison du trade :</strong> Stratégie appliquée, signal identifié</li>
             <li><strong>Évaluation post-trade :</strong> Ce qui a fonctionné, ce qui n'a pas marché</li>
           </ol>
           <h2>Utiliser la technologie à votre avantage</h2>
           <p>TradesTracker offre une solution complète pour automatiser la collecte des données de vos trades et générer des analyses pertinentes pour améliorer votre trading.</p>`
        : `<p>Keeping a trading journal is one of the most powerful tools for improving your performance as a trader. This article explores the best practices for documenting your trades and extracting valuable insights.</p>
           <h2>Why keep a trading journal?</h2>
           <p>A well-maintained trading journal allows you to:</p>
           <ul>
             <li>Identify recurring patterns in your successes and failures</li>
             <li>Maintain discipline and accountability</li>
             <li>Objectively quantify your performance</li>
             <li>Refine your strategy over time</li>
           </ul>
           <h2>Essential elements of a trading journal</h2>
           <p>An effective trading journal should include:</p>
           <ol>
             <li><strong>Basic information:</strong> Date, time, pair/asset, direction</li>
             <li><strong>Trade details:</strong> Entry price, position size, stop-loss, take-profit</li>
             <li><strong>Outcome:</strong> Exit price, P&L, duration</li>
             <li><strong>Technical analysis:</strong> Indicators used, chart setup</li>
             <li><strong>Context:</strong> Market conditions, influential events</li>
             <li><strong>Mental state:</strong> Your mood, fatigue level, confidence</li>
             <li><strong>Reason for trade:</strong> Applied strategy, identified signal</li>
             <li><strong>Post-trade evaluation:</strong> What worked, what didn't</li>
           </ol>
           <h2>Using technology to your advantage</h2>
           <p>TradesTracker offers a comprehensive solution to automate the collection of your trade data and generate relevant analyses to improve your trading.</p>`,
      category: "trading",
      author: "Alexandre Berthier",
      date: "2023-04-15",
      readingTime: "8 min",
      image: "/lovable-uploads/7b5e102a-70c9-4618-a03e-87c1f375227e.png"
    },
    {
      id: "2",
      title: language === "fr" ? "5 indicateurs techniques à connaître absolument" : "5 technical indicators you absolutely need to know",
      content: language === "fr" 
        ? `<p>Les indicateurs techniques sont des outils essentiels pour l'analyse des marchés. Découvrez les 5 indicateurs que tout trader devrait maîtriser.</p>
           <h2>1. Moyennes Mobiles</h2>
           <p>Les moyennes mobiles lissent les données de prix pour créer une ligne de tendance qui permet de déterminer la direction actuelle du marché. Elles sont particulièrement utiles pour identifier le momentum et les changements de tendance.</p>
           <h2>2. RSI (Relative Strength Index)</h2>
           <p>Le RSI est un oscillateur qui mesure la vitesse et le changement des mouvements de prix. Il aide à identifier les conditions de surachat et de survente du marché.</p>
           <h2>3. MACD (Moving Average Convergence Divergence)</h2>
           <p>Le MACD est un indicateur de suivi de tendance qui montre la relation entre deux moyennes mobiles des prix. Il est excellent pour identifier les changements de momentum.</p>
           <h2>4. Bandes de Bollinger</h2>
           <p>Les Bandes de Bollinger sont un indicateur de volatilité qui trace une moyenne mobile avec deux bandes d'écart-type au-dessus et en dessous. Elles aident à identifier quand un actif est suracheté ou survendu en fonction de la volatilité récente.</p>
           <h2>5. Fibonacci Retracement</h2>
           <p>Les niveaux de retracement de Fibonacci sont utilisés pour identifier les niveaux de support et de résistance potentiels, basés sur la séquence de Fibonacci. Ils aident à déterminer les points d'entrée et de sortie dans le sens de la tendance dominante.</p>`
        : `<p>Technical indicators are essential tools for market analysis. Discover the 5 indicators that every trader should master.</p>
           <h2>1. Moving Averages</h2>
           <p>Moving averages smooth price data to create a trend line that helps determine the current market direction. They are particularly useful for identifying momentum and trend changes.</p>
           <h2>2. RSI (Relative Strength Index)</h2>
           <p>RSI is an oscillator that measures the speed and change of price movements. It helps identify overbought and oversold market conditions.</p>
           <h2>3. MACD (Moving Average Convergence Divergence)</h2>
           <p>MACD is a trend-following indicator that shows the relationship between two moving averages of prices. It's excellent for identifying momentum changes.</p>
           <h2>4. Bollinger Bands</h2>
           <p>Bollinger Bands are a volatility indicator that plots a moving average with two standard deviation bands above and below. They help identify when an asset is overbought or oversold based on recent volatility.</p>
           <h2>5. Fibonacci Retracement</h2>
           <p>Fibonacci retracement levels are used to identify potential support and resistance levels, based on the Fibonacci sequence. They help determine entry and exit points in the direction of the dominant trend.</p>`,
      category: "analysis",
      author: "Sophie Martin",
      date: "2023-05-22",
      readingTime: "12 min",
      image: "/lovable-uploads/6b9faeba-9821-4d33-be9c-6a099aa8c1fe.png"
    },
    // Add other blog posts with content as needed
  ];
  
  useEffect(() => {
    // Simulate loading blog post data
    setLoading(true);
    
    setTimeout(() => {
      const foundPost = blogPosts.find(post => post.id === id);
      
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/blog');
      }
      
      setLoading(false);
    }, 500);
  }, [id, navigate, language]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === "fr" 
      ? date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen w-full bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      
      <div className="w-full px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('blog.backToBlog')}
          </Button>
          
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-80 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : post ? (
            <article className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
              <h1 className="mb-6 text-3xl sm:text-4xl font-bold">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
              
              <div className="aspect-video mb-8 overflow-hidden rounded-lg">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              
              <div className="mt-12 border-t pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t('blog.shareBlogPost')}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">{t('blog.postNotFound')}</h2>
              <Button onClick={() => navigate('/blog')}>
                {t('blog.backToBlog')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
