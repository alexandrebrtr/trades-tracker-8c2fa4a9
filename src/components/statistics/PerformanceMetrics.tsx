
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { usePerformanceData } from '@/hooks/usePerformanceData';
import { MetricsCards } from './performance/MetricsCards';
import { CumulativeReturnsChart } from './performance/CumulativeReturnsChart';
import { MonthlyReturnsChart } from './performance/MonthlyReturnsChart';
import { VolatilityChart } from './performance/VolatilityChart';

const PerformanceMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const { user } = useAuth();
  const { 
    loading, 
    cumulativeReturnsData, 
    monthlyReturnsData, 
    volatilityData,
    metrics 
  } = usePerformanceData(user, selectedPeriod);

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Métriques de Performance</h2>
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-[350px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Métriques de Performance</h2>
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

      <MetricsCards metrics={metrics} />

      <CumulativeReturnsChart data={cumulativeReturnsData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyReturnsChart data={monthlyReturnsData} />
        <VolatilityChart data={volatilityData} />
      </div>
    </div>
  );
};

export default PerformanceMetrics;
