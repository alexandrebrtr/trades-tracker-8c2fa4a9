import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, Facebook, X, Instagram, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Nos coordonnées</CardTitle>
                <CardDescription>
                  N'hésitez pas à nous contacter par ces différents moyens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a href="mailto:trades.tracker.officiel@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      trades.tracker.officiel@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <a href="tel:+33123456789" className="text-muted-foreground hover:text-primary transition-colors">
                      +33 (0)7 78 40 67 10
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageCircle className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <a href="https://wa.me/33123456789" className="text-muted-foreground hover:text-primary transition-colors">
                      +33 (0)7 78 40 67 10
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Globe className="w-5 h-5 mr-3 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Site Web</h3>
                    <a href="https://trades-tracker.com" className="text-muted-foreground hover:text-primary transition-colors">
                      www.trades-tracker.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Réseaux sociaux</CardTitle>
                <CardDescription>
                  Suivez-nous pour les dernières actualités
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://www.facebook.com/profile.php?id=61574739156962" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <Facebook className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://twitter.com/trades_track_of" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://instagram.com/trades_tracker_official" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://www.tiktok.com/@trades_tracker_official" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                      <TikTok className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Foire aux questions</CardTitle>
                <CardDescription>
                  Réponses aux questions les plus fréquemment posées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Comment puis-je créer un compte ?</AccordionTrigger>
                    <AccordionContent>
                      Pour créer un compte, cliquez sur le bouton "Connexion" dans le coin supérieur droit, 
                      puis choisissez "Créer un compte". Remplissez le formulaire avec vos informations et 
                      suivez les instructions pour vérifier votre adresse e-mail.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Quels sont les avantages du compte Premium ?</AccordionTrigger>
                    <AccordionContent>
                      Le compte Premium offre des fonctionnalités avancées telles que l'analyse approfondie 
                      des performances, l'accès au calendrier des trades, des alertes personnalisées, 
                      et bien plus encore. Consultez notre page Premium pour plus de détails.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Comment puis-je suivre mes performances de trading ?</AccordionTrigger>
                    <AccordionContent>
                      Une fois connecté, vous pouvez ajouter vos trades via la page "Nouveau Trade". 
                      Vos performances seront automatiquement calculées et affichées dans le tableau de bord 
                      et la section Statistiques, avec des graphiques et des indicateurs clés.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Est-il possible d'exporter mes données ?</AccordionTrigger>
                    <AccordionContent>
                      Oui, vous pouvez exporter vos données de trading au format CSV ou JSON depuis 
                      la page Paramètres, section "Compte". Cette fonctionnalité vous permet de sauvegarder 
                      vos données ou de les analyser dans d'autres logiciels.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Comment puis-je réinitialiser mon mot de passe ?</AccordionTrigger>
                    <AccordionContent>
                      Si vous avez oublié votre mot de passe, cliquez sur "Connexion", puis sur 
                      "Mot de passe oublié". Vous recevrez un e-mail avec un lien pour réinitialiser 
                      votre mot de passe. Assurez-vous de vérifier également votre dossier spam.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger>Comment puis-je annuler mon abonnement Premium ?</AccordionTrigger>
                    <AccordionContent>
                      Pour annuler votre abonnement Premium, accédez à la page Paramètres, 
                      puis à la section "Abonnement". Cliquez sur "Gérer l'abonnement" et suivez 
                      les instructions pour annuler. Vous conserverez l'accès Premium jusqu'à la fin 
                      de votre période de facturation.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Heures d'ouverture</CardTitle>
                <CardDescription>
                  Notre équipe de support est disponible aux horaires suivants et vous repondra dès que possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="font-medium">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span className="font-medium">10h00 - 14h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="font-medium">Fermé</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
