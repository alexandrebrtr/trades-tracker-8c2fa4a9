
import { AppLayout } from '@/components/layout/AppLayout';
import { PremiumAnalyticsContent } from '@/components/statistics/PremiumAnalyticsContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, ArrowLeft } from 'lucide-react';

export default function PremiumAnalytics() {
  return (
    <AppLayout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Analyses Premium</h1>
          </div>
          <Button variant="outline" asChild>
            <Link to="/statistics" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux statistiques</span>
            </Link>
          </Button>
        </div>
        
        <PremiumAnalyticsContent />
      </div>
    </AppLayout>
  );
}
