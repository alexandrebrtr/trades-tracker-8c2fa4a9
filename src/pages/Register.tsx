
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Créer un compte</h1>
        <div className="text-center mb-6">
          <p>Cette page sera implémentée prochainement.</p>
          <p className="mt-4">Vous pouvez retourner à la page de connexion:</p>
        </div>
        <Button asChild className="w-full">
          <Link to="/login">Aller à la page de connexion</Link>
        </Button>
      </div>
    </div>
  );
}
