import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

function App() {
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // 1. GET: Carregar tickets da API
  const fetchTickets = async () => {
    try {
      const response = await fetch('/tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Can't load tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 2. PUT: Mudar o estado diretamente a partir do Dropdown
  const handleStatusChange = async (ticket, newStatus) => {
    // Se o estado for igual ao que já estava, não fazemos pedidos desnecessários ao servidor
    if (ticket.status === newStatus) return;

    try {
      const response = await fetch(`/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos o novo estado que veio do dropdown
        body: JSON.stringify({ ...ticket, status: newStatus }),
      });

      if (response.ok) {
        // Atualiza a tabela instantaneamente
        setTickets(tickets.map(t => t.id === ticket.id ? { ...t, status: newStatus } : t));
      } else {
        console.error("Failed to update status on server");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  // 3. DELETE: Apagar um Ticket
  const handleDeleteTicket = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      const response = await fetch(`/tickets/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTickets(tickets.filter(t => t.id !== id));
      } else {
        console.error("Failed to delete ticket on server");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  // Cálculos de dados
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'OPEN').length;
  const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolved = tickets.filter(t => t.status === 'RESOLVED').length;

  const chartData = [
    { name: 'Open', value: open, color: '#ef4444' },
    { name: 'In Progress', value: inProgress, color: '#f59e0b' },
    { name: 'Resolved', value: resolved, color: '#10b981' }
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter text-white">MuniciPal</h1>
          <p className="text-slate-500 text-xs mt-1 uppercase font-bold">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`cursor-pointer w-full flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <span className="mr-3">📋</span> Overview
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`cursor-pointer w-full flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <span className="mr-3">📈</span> Analytics
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800 p-4 rounded-xl">
              <p className="text-xs text-slate-500 uppercase font-bold">Logged as</p>
              <p className="text-sm font-medium text-slate-200">Engineer Smith</p>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 capitalize">
            {activeTab === 'overview' ? 'Operational Dashboard' : 'Statistical Analysis'}
          </h2>
        </header>

        <div className="flex-1 p-10 overflow-y-auto">
          
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Cards with numbers */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-slate-400 text-xs font-black uppercase mb-1">Total</h3>
                  <p className="text-3xl font-bold text-slate-800">{total}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-red-500">
                  <h3 className="text-slate-400 text-xs font-black uppercase mb-1">Open</h3>
                  <p className="text-3xl font-bold text-red-500">{open}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
                  <h3 className="text-slate-400 text-xs font-black uppercase mb-1">In Progress</h3>
                  <p className="text-3xl font-bold text-amber-500">{inProgress}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
                  <h3 className="text-slate-400 text-xs font-black uppercase mb-1">Resolved</h3>
                  <p className="text-3xl font-bold text-emerald-500">{resolved}</p>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-200">
                      <th className="py-4 px-6 tracking-widest">Title</th>
                      <th className="py-4 px-6 tracking-widest">Description</th>
                      <th className="py-4 px-6 tracking-widest">Status</th>
                      <th className="py-4 px-6 tracking-widest text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 text-slate-800 font-semibold">{ticket.title}</td>
                        <td className="py-4 px-6 text-slate-500 text-sm truncate max-w-xs">{ticket.description}</td>
                        
                        {/* COLUNA DO ESTADO (AGORA COM DROPDOWN INTERATIVO) */}
                        <td className="py-4 px-6">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket, e.target.value)}
                            className={`cursor-pointer px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                              ${ticket.status === 'OPEN' ? 'bg-red-50 border-red-200 text-red-700' : ''}
                              ${ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}
                              ${ticket.status === 'RESOLVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}
                            `}
                          >
                            <option value="OPEN" className="text-slate-800 bg-white font-bold">OPEN</option>
                            <option value="IN_PROGRESS" className="text-slate-800 bg-white font-bold">IN_PROGRESS</option>
                            <option value="RESOLVED" className="text-slate-800 bg-white font-bold">RESOLVED</option>
                          </select>
                        </td>

                        {/* COLUNA DE AÇÕES (AGORA SÓ COM O APAGAR) */}
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleDeleteTicket(ticket.id)}
                            className="cursor-pointer p-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 transition-colors"
                            title="Delete Ticket"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tickets.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-sm">No tickets available.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Incident Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Volume Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                        {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default App