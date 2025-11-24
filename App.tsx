import React, { useState } from 'react';
import { User, ViewState } from './types';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { JobSearch } from './components/JobSearch';
import { Button } from './components/UiComponents';

const Navbar = ({ 
  user, 
  currentView, 
  onChangeView, 
  onLogout 
}: { 
  user: User | null; 
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
}) => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center cursor-pointer" onClick={() => onChangeView(ViewState.DASHBOARD)}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 shadow-lg shadow-blue-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">JobHorizon</span>
        </div>

        {user ? (
          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="hidden md:flex space-x-1">
              <button 
                onClick={() => onChangeView(ViewState.DASHBOARD)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === ViewState.DASHBOARD ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Tableau de bord
              </button>
              <button 
                onClick={() => onChangeView(ViewState.SEARCH)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === ViewState.SEARCH ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Offres d'emploi
              </button>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Candidat</p>
              </div>
              <div className="h-9 w-9 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                 <img src="https://picsum.photos/100/100" alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <button onClick={onLogout} className="text-gray-400 hover:text-red-500 ml-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <Button variant="primary" onClick={() => onChangeView(ViewState.AUTH)}>
              Connexion
            </Button>
          </div>
        )}
      </div>
    </div>
    
    {/* Mobile sub-menu */}
    {user && (
      <div className="md:hidden border-t border-gray-100 flex justify-around p-2 bg-gray-50">
         <button 
            onClick={() => onChangeView(ViewState.DASHBOARD)}
            className={`flex-1 text-center py-2 text-xs font-medium ${currentView === ViewState.DASHBOARD ? 'text-blue-600' : 'text-gray-500'}`}
          >
            Tableau de bord
          </button>
          <button 
            onClick={() => onChangeView(ViewState.SEARCH)}
            className={`flex-1 text-center py-2 text-xs font-medium ${currentView === ViewState.SEARCH ? 'text-blue-600' : 'text-gray-500'}`}
          >
            Recherche
          </button>
      </div>
    )}
  </nav>
);

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.AUTH);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(ViewState.AUTH);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar 
        user={user} 
        currentView={currentView} 
        onChangeView={setCurrentView}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user || currentView === ViewState.AUTH ? (
          <Auth onLogin={handleLogin} />
        ) : currentView === ViewState.DASHBOARD ? (
          <Dashboard />
        ) : (
          <JobSearch />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © 2024 JobHorizon. Tous droits réservés. Propulsé par Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
