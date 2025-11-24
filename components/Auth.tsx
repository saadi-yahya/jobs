import React, { useState } from 'react';
import { Button, Input, Card } from './UiComponents';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({
        name: isLogin ? 'Utilisateur' : name,
        email: email
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <Card className="w-full max-w-md p-8 shadow-2xl border-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Bon retour parmi nous' : 'Créer un compte'}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {isLogin ? 'Accédez à votre espace candidat' : 'Rejoignez JobHorizon pour booster votre carrière'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <Input 
              label="Nom complet" 
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Input 
            label="Email professionnel" 
            type="email" 
            placeholder="jean@exemple.fr" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Mot de passe" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading}>
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold hover:underline focus:outline-none"
          >
            {isLogin ? "S'inscrire gratuitement" : "Se connecter"}
          </button>
        </div>
      </Card>
    </div>
  );
};