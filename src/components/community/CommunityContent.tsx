
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CommunityForums } from './CommunityForums';
import { CommunityMembers } from './CommunityMembers';
import { CommunityEvents } from './CommunityEvents';
import { CommunityTopTraders } from './CommunityTopTraders';

export function CommunityContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('forums');
  
  return (
    <div className="space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span>Forums</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Discussions sur les stratégies et analyses de marché</p>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('forums')}>
                  Accéder
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Membres</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Découvrez et suivez d'autres traders</p>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('members')}>
                  Explorer
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Événements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Webinaires et formations à venir</p>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('events')}>
                  Calendrier
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Top Traders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Les traders les plus performants du mois</p>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('top-traders')}>
                  Classement
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none gap-4 bg-transparent h-auto py-0">
          <TabsTrigger value="forums" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none">
            <MessageSquare className="w-4 h-4 mr-2" />
            Forums de discussion
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none">
            <Users className="w-4 h-4 mr-2" />
            Membres
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none">
            <Calendar className="w-4 h-4 mr-2" />
            Événements
          </TabsTrigger>
          <TabsTrigger value="top-traders" className="data-[state=active]:border-primary border-b-2 border-transparent rounded-none">
            <TrendingUp className="w-4 h-4 mr-2" />
            Top Traders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="forums" className="mt-6">
          <CommunityForums />
        </TabsContent>
        
        <TabsContent value="members" className="mt-6">
          <CommunityMembers />
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <CommunityEvents />
        </TabsContent>
        
        <TabsContent value="top-traders" className="mt-6">
          <CommunityTopTraders />
        </TabsContent>
      </Tabs>
    </div>
  );
}
