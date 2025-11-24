import React, { useEffect, useState } from 'react';
import { Card } from './UiComponents';
import { MarketStat } from '../types';
import { getMarketInsights } from '../services/ai';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock historical data for the chart
const chartData = [
  { month: 'Jan', rate: 7.4 },
  { month: 'Fév', rate: 7.3 },
  { month: 'Mar', rate: 7.4 },
  { month: 'Avr', rate: 7.2 },
  { month: 'Mai', rate: 7.1 },
  { month: 'Juin', rate: 7.2 },
];

export const Dashboard = () => {
  const [stats, setStats] = useState<MarketStat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getMarketInsights();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-500 mt-1">Aperçu du marché de l'emploi en temps réel.</p>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-blue-100 font-medium mb-1">Taux de chômage</p>
              <h3 className="text-4xl font-bold">
                {loading ? "..." : `${stats?.unemploymentRate}%`}
              </h3>
            </div>
            <div className="mt-4 flex items-center text-blue-100 text-sm bg-white/20 w-fit px-2 py-1 rounded">
              <span>Moyenne nationale</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-gray-500 font-medium mb-1">Postes ouverts (Est.)</p>
              <h3 className="text-4xl font-bold text-gray-900">
                {loading ? "..." : stats?.openPositions.toLocaleString('fr-FR')}
              </h3>
            </div>
            <div className={`mt-4 text-sm font-medium ${stats?.trend === 'up' ? 'text-green-600' : 'text-orange-500'}`}>
               {stats?.trend === 'up' ? '↗ Tendance à la hausse' : '→ Marché stable'}
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-purple-100 font-medium mb-1">Le Conseil IA</p>
              <p className="text-lg font-medium leading-tight mt-2">
                {loading ? "Analyse en cours..." : stats?.insight}
              </p>
            </div>
            <div className="mt-4 text-purple-200 text-xs uppercase tracking-wider font-semibold">
              Généré par Gemini
            </div>
          </div>
        </Card>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Évolution du taux de chômage (6 mois)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis domain={[6, 8]} hide />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Secteurs qui recrutent</h3>
          <ul className="space-y-4">
            {[
              { name: "Informatique & Tech", jobs: "+12%", color: "bg-blue-500" },
              { name: "Santé", jobs: "+8%", color: "bg-green-500" },
              { name: "Construction", jobs: "+5%", color: "bg-orange-500" },
              { name: "Hôtellerie", jobs: "+3%", color: "bg-purple-500" },
            ].map((sector, i) => (
              <li key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${sector.color}`}></span>
                  <span className="font-medium text-gray-700">{sector.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{sector.jobs}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
