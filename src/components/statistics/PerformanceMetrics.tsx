
import { usePremium } from "@/context/PremiumContext";
import PerformanceView from "./performance/PerformanceView";
import AdvancedAnalytics from "./AdvancedAnalytics";

export default function PerformanceMetrics() {
  const { isPremium } = usePremium();
  
  return (
    <div className="space-y-8">
      <PerformanceView />
      {isPremium && <AdvancedAnalytics />}
    </div>
  );
}
