
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
  rating: number;
  avatar: string;
}

export function TestimonialsCarousel({ staticTestimonials = [] }: { staticTestimonials?: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);
  const [loading, setLoading] = useState(staticTestimonials.length === 0);

  useEffect(() => {
    // Si on a déjà des témoignages statiques, pas besoin de charger
    if (staticTestimonials.length > 0) return;

    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        if (data) {
          setTestimonials(data.map(item => ({
            id: item.id,
            text: item.text,
            author: item.author,
            role: item.role,
            rating: item.rating,
            avatar: item.avatar_url
          })));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des témoignages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [staticTestimonials]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse">Chargement des témoignages...</div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <Carousel className="w-full max-w-6xl mx-auto">
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={testimonial.id || index} className="sm:basis-1/2 lg:basis-1/4">
            <Card className="h-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4 gap-2">
        <CarouselPrevious className="static transform-none mx-0" />
        <CarouselNext className="static transform-none mx-0" />
      </div>
    </Carousel>
  );
}
