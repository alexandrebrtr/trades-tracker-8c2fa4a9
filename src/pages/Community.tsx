
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users } from 'lucide-react';

export default function Community() {
  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Communauté</h1>
        </div>
        
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
            <p className="text-lg font-medium text-center py-8">
              Coming Soon
            </p>
            <p className="text-muted-foreground text-center">
              Nous travaillons activement sur cette fonctionnalité. Restez à l'écoute pour des mises à jour prochaines.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
              <Button variant="outline" className="flex gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>S'inscrire aux notifications</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
