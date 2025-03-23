
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Globe, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Contact = () => {
  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Contactez-nous</h1>
          <p className="text-muted-foreground">
            Vous avez une question ou besoin d'aide ? N'hésitez pas à nous contacter par l'un des moyens ci-dessous.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Par email
                </CardTitle>
                <CardDescription>Envoyez-nous un email pour toute question</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Email général :</span>
                  <a href="mailto:contact@tradingjournal.fr" className="text-primary hover:underline">
                    contact@tradingjournal.fr
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Support technique :</span>
                  <a href="mailto:support@tradingjournal.fr" className="text-primary hover:underline">
                    support@tradingjournal.fr
                  </a>
                </div>
                <Button variant="outline" asChild className="w-full mt-2">
                  <a href="mailto:contact@tradingjournal.fr">
                    <Mail className="mr-2 h-4 w-4" />
                    Envoyer un email
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Par téléphone
                </CardTitle>
                <CardDescription>Contactez-nous par téléphone pour un service rapide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Service client :</span>
                  <a href="tel:+33187654321" className="text-primary hover:underline">
                    +33 1 87 65 43 21
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Horaires d'ouverture :</span>
                  <p className="text-muted-foreground">Lun-Ven : 9h - 18h</p>
                </div>
                <Button variant="outline" asChild className="w-full mt-2">
                  <a href="tel:+33187654321">
                    <Phone className="mr-2 h-4 w-4" />
                    Nous appeler
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Notre adresse
              </CardTitle>
              <CardDescription>Visitez nos bureaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base">
                123 Avenue des Champs-Élysées<br />
                75008 Paris<br />
                France
              </p>
              <Button variant="outline" asChild className="mt-2">
                <a href="https://maps.google.com/?q=123+Avenue+des+Champs-Élysées,+75008+Paris,+France" target="_blank" rel="noopener noreferrer">
                  <MapPin className="mr-2 h-4 w-4" />
                  Voir sur Google Maps
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Réseaux sociaux
              </CardTitle>
              <CardDescription>Suivez-nous pour rester informé</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button variant="outline" asChild className="flex items-center gap-2 h-auto py-3">
                  <a href="https://twitter.com/tradingjournal" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                    <span>Twitter</span>
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2 h-auto py-3">
                  <a href="https://linkedin.com/company/tradingjournal" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5 text-[#0077B5]" />
                    <span>LinkedIn</span>
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2 h-auto py-3">
                  <a href="https://facebook.com/tradingjournal" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5 text-[#1877F2]" />
                    <span>Facebook</span>
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2 h-auto py-3">
                  <a href="https://instagram.com/tradingjournal" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5 text-[#E4405F]" />
                    <span>Instagram</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Foire aux questions</CardTitle>
              <CardDescription>Trouvez rapidement des réponses aux questions les plus fréquentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Comment créer un compte ?</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Cliquez sur "S'inscrire" en haut à droite de la page et suivez les instructions.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Comment réinitialiser mon mot de passe ?</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Sur la page de connexion, cliquez sur "Mot de passe oublié" et suivez les instructions.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Comment puis-je accéder aux fonctionnalités premium ?</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Rendez-vous sur la page Premium depuis le menu principal et sélectionnez l'abonnement qui vous convient.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-muted-foreground text-sm mb-3">
                  Vous ne trouvez pas la réponse à votre question ?
                </p>
                <Button asChild>
                  <a href="mailto:contact@tradingjournal.fr">
                    <Mail className="mr-2 h-4 w-4" />
                    Contactez-nous directement
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Contact;
