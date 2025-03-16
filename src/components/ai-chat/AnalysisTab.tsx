
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, BarChart3, PlusCircle } from 'lucide-react';

interface AnalysisTabProps {
  isProcessing: boolean;
  onRequestAnalysis: (analysisType: string) => void;
}

export function AnalysisTab({ isProcessing, onRequestAnalysis }: AnalysisTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyses IA</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Card className="border border-muted-foreground/20">
            <CardHeader>
              <CardTitle className="text-base">Demander une analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start text-left"
                  onClick={() => onRequestAnalysis("Analyse mes performances récentes et donne-moi des conseils pour m'améliorer.")}
                  disabled={isProcessing}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyser mes performances récentes
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start text-left"
                  onClick={() => onRequestAnalysis("Quelles sont les tendances actuelles du marché et les opportunités à surveiller?")}
                  disabled={isProcessing}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tendances du marché & opportunités
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start text-left"
                  onClick={() => onRequestAnalysis("Donne-moi des conseils stratégiques pour améliorer mon trading.")}
                  disabled={isProcessing}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Conseils stratégiques personnalisés
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start text-left"
                  onClick={() => onRequestAnalysis("Explique-moi comment mieux gérer les risques et dimensionner mes positions.")}
                  disabled={isProcessing}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Gestion des risques avancée
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-muted-foreground/20">
            <CardHeader>
              <CardTitle className="text-base">Fonctionnalités premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Débloquez des analyses avancées et des prédictions de marché en temps réel avec notre abonnement premium.
              </p>
              <Button className="w-full">
                Explorer les options premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
