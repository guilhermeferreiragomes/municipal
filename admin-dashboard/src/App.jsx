import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Technicians from './pages/Technicians';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter text-white">MuniciPal</h1>
          <p className="text-slate-500 text-xs mt-1 uppercase font-bold">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="mb-6">
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tickets</p>
            
            <button 
              onClick={() => { setCurrentPage('dashboard'); setActiveTab('overview'); }} 
              className={`cursor-pointer w-full flex items-center py-2.5 px-4 rounded-lg transition-colors ${currentPage === 'dashboard' && activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span className="mr-3">📋</span> Overview
            </button>
            
            <button 
              onClick={() => { setCurrentPage('dashboard'); setActiveTab('analytics'); }} 
              className={`cursor-pointer w-full flex items-center py-2.5 px-4 rounded-lg transition-colors mt-1 ${currentPage === 'dashboard' && activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span className="mr-3">📈</span> Analytics
            </button>
          </div>

          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Team</p>
            
            <button 
              onClick={() => setCurrentPage('technicians')} 
              className={`cursor-pointer w-full flex items-center py-2.5 px-4 rounded-lg transition-colors ${currentPage === 'technicians' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span className="mr-3">👥</span> Technicians
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Logged as</p>
                <p className="text-sm font-medium text-slate-200">Admin</p>
              </div>
              
              <button 
                onClick={() => setIsAuthenticated(false)} 
                className="cursor-pointer text-slate-400 hover:text-red-400 transition-colors" 
                title="Logout"
              >
                🚪
              </button>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 capitalize">
            {currentPage === 'technicians' ? 'Team Management' : (activeTab === 'overview' ? 'Operational Dashboard' : 'Statistical Analysis')}
          </h2>
        </header>

        <div className="flex-1 p-10 overflow-y-auto">
          {currentPage === 'dashboard' && <Dashboard activeTab={activeTab} />}
          {currentPage === 'technicians' && <Technicians />}
        </div>
      </main>

    </div>
  );
}

export default App;