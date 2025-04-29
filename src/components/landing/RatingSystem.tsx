
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

// Définir le type pour les notes
interface RatingData {
  id: string;
  rating: number;
  created_at: string;
}

export function RatingSystem() {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Charger les statistiques des notes
    const fetchRatings = async () => {
      try {
        // Récupérer le nombre total de notes
        const { count, error: countError } = await supabase
          .from('ratings')
          .select('*', { count: 'exact', head: true }) as { count: number, error: any };
          
        if (countError) throw countError;
        
        // Calculer la moyenne des notes
        const { data, error } = await supabase
          .from('ratings')
          .select('rating') as { data: RatingData[], error: any };
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
          setAverageRating(parseFloat((sum / data.length).toFixed(1)));
          setTotalRatings(count || data.length);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
      }
    };
    
    fetchRatings();
    
    // S'abonner aux nouvelles notes en temps réel
    const subscription = supabase
      .channel('ratings_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ratings' }, 
        () => {
          fetchRatings();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleRating = async (rating: number) => {
    setUserRating(rating);
    
    try {
      const { error } = await supabase
        .from('ratings')
        .insert({ rating }) as { error: any };
        
      if (error) throw error;
      
      toast({
        title: t('landing.footer.thanks').replace('{rating}', rating.toString()),
        description: `Vous avez attribué une note de ${rating}/5 à Trades Tracker.`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la note:', error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de l'enregistrement de votre note.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star}
            className="focus:outline-none"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRating(star)}
            aria-label={`Noter ${star} sur 5`}
          >
            <Star 
              className={`h-7 w-7 ${
                star <= (hoverRating || userRating) 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-muted-foreground'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      <div className="text-sm text-muted-foreground">
        {userRating > 0 
          ? t('landing.footer.thanks').replace('{rating}', userRating.toString())
          : t('landing.footer.rateUs')
        }
      </div>
      <div className="text-xs text-muted-foreground">
        <span className="font-medium">{averageRating}</span>/5 - {t('landing.footer.basedOn').replace('{count}', totalRatings.toString())}
      </div>
    </div>
  );
}
