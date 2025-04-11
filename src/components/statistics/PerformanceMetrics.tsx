
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import PerformanceView from "./performance/PerformanceView";
import TradePerformanceTable from "./performance/TradePerformanceTable";
import TradeAnalysisChart from "./performance/TradeAnalysisChart";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PerformanceMetrics() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedAnalysis, setSelectedAnalysis] = useState("general");
  const isMobile = useIsMobile();
  
  const { 
    loading, 
    cumulativeReturnsData, 
    monthlyReturnsData, 
    volatilityData, 
    metrics 
  } = usePerformanceData(user, selectedPeriod);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Analyse des performances</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-full md:w-[180px]">
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
        <TabsList className={`grid ${isMobile ? "grid-cols-2 gap-2" : "grid-cols-3 w-[500px]"} mb-4`}>
          <TabsTrigger value="general" className="text-xs md:text-sm">Vue générale</TabsTrigger>
          <TabsTrigger value="trades" className="text-xs md:text-sm">Analyse des trades</TabsTrigger>
          {!isMobile && <TabsTrigger value="strategies" className="text-xs md:text-sm">Analyse des stratégies</TabsTrigger>}
        </TabsList>
        
        {isMobile && (
          <TabsList className="grid grid-cols-1 mb-4 mt-1">
            <TabsTrigger value="strategies" className="text-xs md:text-sm">Analyse des stratégies</TabsTrigger>
          </TabsList>
        )}
        
        <TabsContent value="general" className="mt-4 md:mt-6">
          <PerformanceView 
            loading={loading}
            cumulativeReturnsData={cumulativeReturnsData}
            monthlyReturnsData={monthlyReturnsData}
            volatilityData={volatilityData}
            metrics={metrics}
          />
        </TabsContent>
        
        <TabsContent value="trades" className="mt-4 md:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader className="pb-1 md:pb-2">
                <CardTitle className="text-base md:text-lg">Performance par type de trade</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 md:pt-4">
                <TradeAnalysisChart type="type" userId={user?.id} period={selectedPeriod} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-1 md:pb-2">
                <CardTitle className="text-base md:text-lg">Performance par instrument</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 md:pt-4">
                <TradeAnalysisChart type="symbol" userId={user?.id} period={selectedPeriod} />
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-4 md:mt-6">
            <CardHeader className="pb-1 md:pb-2">
              <CardTitle className="text-base md:text-lg">Analyse détaillée des trades</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 md:pt-4">
              <div className="overflow-x-auto">
                <TradePerformanceTable userId={user?.id} period={selectedPeriod} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategies" className="mt-4 md:mt-6">
          <Card>
            <CardHeader className="pb-1 md:pb-2">
              <CardTitle className="text-base md:text-lg">Analyse des stratégies</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 md:pt-4">
              <TradeAnalysisChart type="strategy" userId={user?.id} period={selectedPeriod} showAsBar={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
