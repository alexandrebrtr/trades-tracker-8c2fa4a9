
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Video, MapPin } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Webinaire: Analyse technique avancée',
    description: 'Un webinaire interactif sur les techniques avancées d\'analyse des graphiques pour le trading d\'actions et de crypto-monnaies.',
    type: 'webinar',
    date: '2024-06-05T19:00:00',
    duration: 90, // minutes
    host: 'Michel Durant',
    hostAvatar: '',
    participants: 87,
    isPremium: false,
    isRegistered: false
  },
  {
    id: 2,
    title: 'Séminaire en ligne: Gestion du risque et du capital',
    description: 'Apprenez à gérer efficacement votre capital et à mettre en place une stratégie de gestion des risques optimale.',
    type: 'seminar',
    date: '2024-06-10T18:30:00',
    duration: 120, // minutes
    host: 'Sophia Mercier',
    hostAvatar: '',
    participants: 45,
    isPremium: true,
    isRegistered: true
  },
  {
    id: 3,
    title: 'Q&A avec un trader professionnel',
    description: 'Session de questions-réponses avec un trader professionnel ayant plus de 15 ans d\'expérience sur les marchés internationaux.',
    type: 'qa',
    date: '2024-06-15T20:00:00',
    duration: 60, // minutes
    host: 'Jean-Pierre Lefebvre',
    hostAvatar: '',
    participants: 132,
    isPremium: false,
    isRegistered: false
  },
  {
    id: 4,
    title: 'Trading en direct: Session de marché américain',
    description: 'Observez un trader expérimenté pendant une session en direct sur le marché américain, avec commentaires et analyses en temps réel.',
    type: 'live',
    date: '2024-06-18T15:30:00',
    duration: 180, // minutes
    host: 'Christine Leroy',
    hostAvatar: '',
    participants: 76,
    isPremium: true,
    isRegistered: false
  },
  {
    id: 5,
    title: 'Atelier pratique: Configuration des graphiques',
    description: 'Un atelier pratique pour apprendre à configurer efficacement vos graphiques de trading avec les bons indicateurs.',
    type: 'workshop',
    date: '2024-06-22T14:00:00',
    duration: 150, // minutes
    host: 'Marc Dubois',
    hostAvatar: '',
    participants: 53,
    isPremium: false,
    isRegistered: true
  }
];

export function CommunityEvents() {
  const [tabValue, setTabValue] = useState('upcoming');
  const [registrations, setRegistrations] = useState<number[]>([2, 5]); // IDs of events already registered
  
  const handleRegistration = (eventId: number) => {
    if (registrations.includes(eventId)) {
      setRegistrations(registrations.filter(id => id !== eventId));
    } else {
      setRegistrations([...registrations, eventId]);
    }
  };
  
  // Filter events based on the selected tab
  const currentDate = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.date) > currentDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const registeredEvents = events
    .filter(event => registrations.includes(event.id))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const formatDateToFrench = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const formatTimeToFrench = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-80">
          <TabsTrigger value="upcoming">Événements à venir</TabsTrigger>
          <TabsTrigger value="registered">Mes inscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <Card key={event.id} className={event.isPremium ? "border-primary/30" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {event.isPremium && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Premium
                          </Badge>
                        )}
                        <Badge variant="outline" className={getEventTypeBadgeClasses(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDateToFrench(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm gap-1 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTimeToFrench(event.date)} ({event.duration} min)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  
                  <div className="flex items-center mt-4 gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={event.hostAvatar} alt={event.host} />
                      <AvatarFallback>{event.host.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <span>Animé par </span>
                      <span className="font-medium">{event.host}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.participants} participants</span>
                  </div>
                  <Button 
                    variant={registrations.includes(event.id) ? "outline" : "default"}
                    disabled={event.isPremium && !false} // Replace with isPremiumUser when available
                    onClick={() => handleRegistration(event.id)}
                  >
                    {registrations.includes(event.id) ? "Inscrit" : "S'inscrire"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun événement à venir pour le moment.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="registered" className="space-y-4 mt-6">
          {registeredEvents.length > 0 ? (
            registeredEvents.map(event => (
              <Card key={event.id} className="border-primary/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {event.isPremium && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Premium
                          </Badge>
                        )}
                        <Badge variant="outline" className={getEventTypeBadgeClasses(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDateToFrench(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm gap-1 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTimeToFrench(event.date)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="bg-muted/50 p-3 rounded-lg mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-5 w-5 text-primary" />
                      <span className="font-medium">Informations de connexion</span>
                    </div>
                    <p className="text-sm">
                      Le lien de connexion vous sera envoyé par email 30 minutes avant le début de l'événement.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      Ajouter au calendrier
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                      Se désinscrire
                    </Button>
                  </div>
                  <Button>Rejoindre</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Vous n'êtes inscrit à aucun événement.</p>
              <Button variant="outline" className="mt-4" onClick={() => setTabValue('upcoming')}>
                Voir les événements disponibles
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions for event types
function getEventTypeLabel(type: string): string {
  switch (type) {
    case 'webinar': return 'Webinaire';
    case 'seminar': return 'Séminaire';
    case 'qa': return 'Questions/Réponses';
    case 'live': return 'Trading en direct';
    case 'workshop': return 'Atelier pratique';
    default: return type;
  }
}

function getEventTypeBadgeClasses(type: string): string {
  switch (type) {
    case 'webinar': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'seminar': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'qa': return 'bg-green-50 text-green-700 border-green-200';
    case 'live': return 'bg-red-50 text-red-700 border-red-200';
    case 'workshop': return 'bg-amber-50 text-amber-700 border-amber-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
