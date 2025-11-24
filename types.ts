
export interface User {
  name: string;
  email: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  postedAt: string;
  skills: string[]; // New field for tags
}

export interface MarketStat {
  unemploymentRate: number;
  openPositions: number;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  SEARCH = 'SEARCH',
}
