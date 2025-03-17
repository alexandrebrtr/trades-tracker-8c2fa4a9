
import { useState } from "react";
import { usePremium } from "@/context/PremiumContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import PerformanceView from "./performance/PerformanceView";
import TradePerformanceTable from "./performance/TradePerformanceTable";
import TradeAnalysisChart from "./performance/TradeAnalysisChart";
import AdvancedAnalytics from "./AdvancedAnalytics";

export default function PerformanceMetrics() {
  const { isPremium } = usePremium();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedAnalysis, setSelectedAnalysis] = useState("general");
  
  const { 
    loading, 
    cumulativeReturnsData, 
    monthlyReturnsData, 
    volatilityData, 
    metrics 
  } = usePerformanceData(user, selectedPeriod);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analyse des performances</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Dernier mois</SelectItem>
            <SelectItem value="quarter">Dernier trimestre</SelectItem>
            <SelectItem value="year">Dernière année</SelectItem>
            <SelectItem value="all">Toutes les données</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 w-[500px]">
          <TabsTrigger value="general">Vue générale</TabsTrigger>
          <TabsTrigger value="trades">Analyse des trades</TabsTrigger>
          <TabsTrigger value="strategies">Analyse des stratégies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <PerformanceView 
            loading={loading}
            cumulativeReturnsData={cumulativeReturnsData}
            monthlyReturnsData={monthlyReturnsData}
            volatilityData={volatilityData}
            metrics={metrics}
          />
        </TabsContent>
        
        <TabsContent value="trades" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance par type de trade</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <TradeAnalysisChart type="type" userId={user?.id} period={selectedPeriod} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance par instrument</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <TradeAnalysisChart type="symbol" userId={user?.id} period={selectedPeriod} />
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Analyse détaillée des trades</CardTitle>
            </CardHeader>
            <CardContent>
              <TradePerformanceTable userId={user?.id} period={selectedPeriod} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des stratégies</CardTitle>
            </CardHeader>
            <CardContent>
              <TradeAnalysisChart type="strategy" userId={user?.id} period={selectedPeriod} showAsBar={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {isPremium && <AdvancedAnalytics />}
    </div>
  );
}
