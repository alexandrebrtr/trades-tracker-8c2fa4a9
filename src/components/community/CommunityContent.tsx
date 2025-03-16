
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CommunityContent() {
  const navigate = useNavigate();
  
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Users className="w-6 h-6 text-primary" />
          <span>Communauté Trades Tracker</span>
        </CardTitle>
        <CardDescription className="text-base">
          Rejoignez notre communauté de traders pour partager vos expériences et apprendre ensemble
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Forums de discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Participez à des discussions sur les stratégies de trading, analyses de marché et plus encore.</p>
              <Button variant="outline" className="w-full">
                Accéder aux forums
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Événements exclusifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Webinaires, sessions de Q&A avec des traders professionnels et autres événements premium.</p>
              <Button variant="outline" className="w-full">
                Voir le calendrier
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <Button className="flex gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>Démarrer une nouvelle discussion</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
