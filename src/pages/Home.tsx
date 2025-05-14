
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Trades Tracker</h1>
        <p className="text-xl md:text-2xl text-muted-foreground">Suivez et analysez vos trades facilement</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg">
            <Link to="/login">Se connecter</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/register">Créer un compte</Link>
          </Button>
        </div>
        
        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold">Tableau de bord</h3>
              <p>Visualisez vos performances en un coup d'œil</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold">Portefeuille</h3>
              <p>Gérez vos investissements facilement</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold">Statistiques avancées</h3>
              <p>Analysez vos trades en détail</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
