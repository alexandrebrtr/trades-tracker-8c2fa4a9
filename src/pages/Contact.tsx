
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Globe, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire
    setTimeout(() => {
      toast({
        title: "Message envoyé",
        description: "Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.",
      });
      
      // Réinitialiser le formulaire
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Contactez-nous</h1>
        <p className="text-muted-foreground">
          Notre équipe est à votre disposition pour répondre à toutes vos questions concernant Trades Tracker.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Nom</label>
                      <Input 
                        id="name" 
                        placeholder="Votre nom" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="votre@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Comment pouvons-nous vous aider ?" 
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Envoi en cours...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">contact@tradestracker.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-sm text-muted-foreground">+33 (0)1 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-sm text-muted-foreground">
                      10 rue de la Bourse<br />
                      75002 Paris<br />
                      France
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Site web</h3>
                    <p className="text-sm text-muted-foreground">www.tradestracker.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Horaires</h3>
                    <p className="text-sm text-muted-foreground">
                      Lundi - Vendredi: 9h - 18h<br />
                      Samedi - Dimanche: Fermé
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Support premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Les membres premium bénéficient d'un support prioritaire et d'une assistance personnalisée.
                </p>
                <Button variant="outline" className="w-full">
                  Contacter le support premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>FAQ - Questions fréquemment posées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Comment puis-je m'abonner au forfait premium ?</h3>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez vous abonner au forfait premium en vous rendant dans la section "Premium" de votre profil.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Comment réinitialiser mon mot de passe ?</h3>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez réinitialiser votre mot de passe en cliquant sur "Mot de passe oublié" sur la page de connexion.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Quelles sont les méthodes de paiement acceptées ?</h3>
                <p className="text-sm text-muted-foreground">
                  Nous acceptons les paiements par carte de crédit (Visa, Mastercard, American Express) et PayPal.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Comment exporter mes données de trading ?</h3>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez exporter vos données de trading au format CSV depuis la page "Journal" en cliquant sur le bouton "Exporter".
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="px-0">Voir toutes les questions fréquentes</Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
