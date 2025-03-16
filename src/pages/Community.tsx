
import { AppLayout } from '@/components/layout/AppLayout';
import { CommunityContent } from '@/components/community/CommunityContent';
import { usePremium } from '@/context/PremiumContext';

export default function Community() {
  const { isPremium } = usePremium();
  
  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Communauté</h1>
        </div>
        
        <CommunityContent />
      </div>
    </AppLayout>
  );
}
