
import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, Badge, Modal, Input } from './UiComponents';
import { searchJobsWithAI } from '../services/ai';
import { Job } from '../types';

export const JobSearch = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Application Modal State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    type: 'Tous',
    remote: 'Tous',
    sort: 'Pertinence'
  });

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const results = await searchJobsWithAI(query, location);
      setJobs(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query, location]);

  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openApplyModal = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJob(job);
    setApplicationSuccess(false);
    setIsModalOpen(true);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      setApplicationSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setApplicationSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="pb-12 animate-fade-in">
      {/* --- Header & Search Section --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2 relative z-10">Explatorez de nouveaux horizons</h2>
        <p className="text-gray-500 mb-8 relative z-10">Plus de 10 000 offres validées par notre IA vous attendent.</p>

        <form onSubmit={handleSearch} className="relative z-10 flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text"
              placeholder="Poste, compétence ou entreprise..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all outline-none"
            />
          </div>

          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <input 
              type="text"
              placeholder="Ville ou code postal" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all outline-none"
            />
          </div>

          <Button type="submit" variant="primary" className="py-3 px-8 text-lg font-semibold rounded-xl w-full lg:w-auto shadow-lg shadow-blue-200" isLoading={loading}>
            Rechercher
          </Button>
        </form>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-gray-100 relative z-10">
          <span className="text-sm font-medium text-gray-500 mr-2">Filtres rapides :</span>
          <select 
            className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:border-blue-400 transition-colors"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="Tous">Type de contrat (Tous)</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Freelance">Freelance</option>
          </select>

          <select 
            className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:border-blue-400 transition-colors"
            value={filters.remote}
            onChange={(e) => setFilters({...filters, remote: e.target.value})}
          >
            <option value="Tous">Télétravail (Tous)</option>
            <option value="Full">Total</option>
            <option value="Hybrid">Hybride</option>
            <option value="OnSite">Sur site</option>
          </select>

           <div className="flex-grow"></div>
           <div className="text-sm text-gray-500">
             <span className="font-bold text-gray-900">{jobs.length}</span> offres trouvées
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- Sidebar Services --- */}
        <div className="hidden lg:block space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white border-none overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Alerte Emploi</h3>
              <p className="text-blue-100 text-sm mb-4">Recevez les nouvelles offres pour "{query || 'votre profil'}" par email.</p>
              <Button variant="secondary" className="w-full text-sm py-2">Créer une alerte</Button>
            </div>
            <div className="absolute bottom-0 right-0 opacity-20 transform translate-x-4 translate-y-4">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
            </div>
          </Card>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Outils Carrière</h4>
            {[
              { icon: "📄", title: "Analyse de CV", desc: "Optimisez votre CV avec l'IA" },
              { icon: "💰", title: "Simulateur Salaire", desc: "Estimez votre valeur" },
              { icon: "🎓", title: "Formations", desc: "Boostez vos compétences" }
            ].map((tool, idx) => (
              <button key={idx} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left group">
                <span className="text-2xl bg-gray-50 w-10 h-10 flex items-center justify-center rounded-lg group-hover:bg-blue-50 transition-colors">{tool.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{tool.title}</div>
                  <div className="text-xs text-gray-500">{tool.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* --- Job List --- */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm h-80 animate-pulse flex flex-col overflow-hidden">
                  <div className="h-32 bg-gray-200"></div>
                  <div className="p-6 flex-1 space-y-4">
                     <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                     </div>
                     <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                     <div className="h-10 bg-gray-50 rounded mt-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.length > 0 ? jobs.map((job, idx) => (
                <div key={job.id} className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative transform hover:-translate-y-1">
                  
                  {/* Card Cover Image */}
                  <div className="h-32 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${job.id}/600/300`} 
                      alt="Office" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                       <span className="text-white text-xs font-bold bg-black/30 backdrop-blur-md px-2 py-1 rounded border border-white/20">
                         {job.postedAt}
                       </span>
                       <button className="text-white hover:text-red-400 transition-colors p-1">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                       </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-4 mb-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=48&font-size=0.5`} 
                        alt={job.company} 
                        className="w-12 h-12 rounded-lg shadow-sm border border-gray-100 flex-shrink-0" 
                      />
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <p className="text-sm text-gray-500 font-medium">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills?.slice(0,3).map((skill, sIdx) => (
                        <Badge key={sIdx} color="gray" className="text-[10px] uppercase tracking-wide bg-gray-50 text-gray-600 border-gray-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100/50">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="truncate">{job.salary}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <span className="truncate">{job.type}</span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{job.description}</p>

                    <div className="pt-3 mt-auto flex gap-3">
                      <Button variant="outline" className="flex-1 text-sm border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm" onClick={() => {/* Details view */}}>
                        Détails
                      </Button>
                      <Button variant="primary" className="flex-1 text-sm bg-blue-600 hover:bg-blue-700 shadow-blue-100" onClick={(e) => openApplyModal(job, e)}>
                        Postuler
                      </Button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Aucune offre trouvée</h3>
                  <p className="text-gray-500 mt-1">Essayez d'élargir vos critères de recherche.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- Quick Apply Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Postuler chez ${selectedJob?.company}`}
      >
        {applicationSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Candidature envoyée !</h3>
            <p className="text-gray-500 mt-2">L'entreprise reviendra vers vous sous peu.</p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
              <h4 className="font-bold text-blue-900 text-sm">{selectedJob?.title}</h4>
              <p className="text-blue-700 text-xs mt-1">{selectedJob?.location} • {selectedJob?.type}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <Input label="Prénom" placeholder="Jean" required />
               <Input label="Nom" placeholder="Dupont" required />
            </div>
            <Input label="Email" type="email" placeholder="jean@exemple.com" required />
            <Input label="Téléphone" type="tel" placeholder="06 12 34 56 78" />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CV (PDF)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">Télécharger un fichier</span>
                  </div>
                  <p className="text-xs text-gray-500">PDF jusqu'à 5MB</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Annuler</Button>
              <Button type="submit" variant="primary" className="flex-1" isLoading={isApplying}>Envoyer ma candidature</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
