import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Define the form schema with Zod
const formSchema = z.object({
  symbol: z.string().min(1, { message: 'Le symbole est requis' }),
  type: z.enum(['long', 'short']),
  entry_price: z.coerce.number().positive({ message: 'Le prix d\'entrée doit être positif' }),
  exit_price: z.coerce.number().positive({ message: 'Le prix de sortie doit être positif' }),
  size: z.coerce.number().positive({ message: 'La taille doit être positive' }),
  date: z.date(),
  fees: z.coerce.number().min(0, { message: 'Les frais ne peuvent pas être négatifs' }).optional(),
  pnl: z.coerce.number().optional(),
  strategy: z.string().optional(),
  notes: z.string().optional(),
});

// Define the form values type
type TradeFormValues = z.infer<typeof formSchema>;

// Styles for the form
const inputStyles = 'w-full';
const formItemStyles = 'space-y-1';

export const TradeForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<TradeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: '',
      type: 'long',
      entry_price: 0,
      exit_price: 0,
      size: 0,
      date: new Date(),
      fees: 0,
      pnl: undefined,
      strategy: '',
      notes: ''
    },
  });

  const handleSubmit = async (values: TradeFormValues) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer un trade.",
        variant: "destructive"
      });
      return;
    }
    
    let pnl = values.pnl;
    
    try {
      setIsSubmitting(true);
      
      // Calculate PnL if not provided
      if (!values.pnl && values.entry_price && values.exit_price && values.size) {
        if (values.type === "long") {
          pnl = (values.exit_price - values.entry_price) * values.size;
        } else if (values.type === "short") {
          pnl = (values.entry_price - values.exit_price) * values.size;
        }
        
        // Subtract fees if provided
        if (values.fees) {
          pnl -= values.fees;
        }
      }
      
      const newTrade = {
        user_id: user?.id,
        symbol: values.symbol,
        type: values.type,
        entry_price: values.entry_price,
        exit_price: values.exit_price,
        size: values.size,
        date: values.date?.toISOString() || new Date().toISOString(),
        fees: values.fees || 0,
        pnl: pnl,
        strategy: values.strategy || null,
        notes: values.notes || null,
      };
      
      // Insert new trade
      const { error: insertError } = await supabase
        .from('trades')
        .insert([newTrade]);
        
      if (insertError) throw insertError;
      
      // Update trades count in user profile
      if (user?.id) {
        import('@/hooks/useTradesFetcher').then(({ updateTradesCount }) => {
          updateTradesCount(user.id);
        });
      }
      
      toast({
        title: "Trade enregistré",
        description: "Votre trade a été ajouté avec succès.",
      });
      
      form.reset({
        symbol: '',
        type: 'long',
        entry_price: 0,
        exit_price: 0,
        size: 0,
        date: new Date(),
        fees: 0,
        pnl: undefined,
        strategy: '',
        notes: ''
      });
      
    } catch (error: any) {
      console.error('Error submitting trade:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement du trade.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du Trade</CardTitle>
        <CardDescription>Entrez les informations de votre trade</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Symbol */}
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem className={formItemStyles}>
                    <FormLabel>Symbole</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: BTCUSDT" {...field} className={inputStyles} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className={formItemStyles}>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="long">Long</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Entry Price */}
              <FormField
                control={form.control}
                name="entry_price"
                render={({ field }) => (
                  <FormItem className={formItemStyles}>
                    <FormLabel>Prix d'entrée</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className={inputStyles} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Exit Price */}
              <FormField
                control={form.control}
                name="exit_price"
                render={({ field }) => (
                  <FormItem className={formItemStyles}>
                    <FormLabel>Prix de sortie</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className={inputStyles} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Size */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className={formItemStyles}>
                    <FormLabel>Taille</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className={inputStyles} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className={formItemStyles}>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fees */}
              <FormField
                control={form.control}
                name="fees"
                render={({ field }) => (
                  <FormItem className={formItemStyles}>
                    <FormLabel>Frais</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className={inputStyles} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PnL */}
              <FormField
                control={form.control}
                name="pnl"
                render={({ field }) => (
                  <FormItem className={formItemStyles}>
                    <FormLabel>P&L (optionnel)</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} className={inputStyles} />
                    </FormControl>
                    <FormDescription>
                      Laissez vide pour un calcul automatique
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Strategy */}
              <FormField
                control={form.control}
                name="strategy"
                render={({ field }) => (
                  <FormItem className={formItemStyles}>
                    <FormLabel>Stratégie</FormLabel>
                    <FormControl>
                      <Input {...field} className={inputStyles} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className={formItemStyles}>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ajoutez des notes sur votre trade..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer le trade"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
