import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard({ activeTab }) {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, techsRes] = await Promise.all([
          fetch('/tickets'),
          fetch('/users?role=TECHNICIAN')
        ]);
        
        setTickets(await ticketsRes.json());
        setTechnicians(await techsRes.json());
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(() => { fetchData(); }, 5000); 
    return () => clearInterval(intervalId);
  }, []);

  const handleTicketUpdate = async (ticket, field, value) => {
    if (ticket[field] === value) return;

    const updatedTicket = { ...ticket, [field]: value };

    try {
      const response = await fetch(`/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTicket),
      });
      
      if (response.ok) {
        setTickets(tickets.map(t => t.id === ticket.id ? updatedTicket : t));
        if (selectedTicket && selectedTicket.id === ticket.id) {
          setSelectedTicket(updatedTicket);
        }
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incident report?")) return;
    try {
      const response = await fetch(`/tickets/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTickets(tickets.filter(t => t.id !== id));
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket(null);
        }
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

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
    <>
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          
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

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-200">
                  <th className="py-4 px-6 tracking-widest">Incident</th>
                  <th className="py-4 px-6 tracking-widest">Category</th> {/* 🔴 NOVA COLUNA */}
                  <th className="py-4 px-6 tracking-widest">Urgency</th>
                  <th className="py-4 px-6 tracking-widest">Status</th>
                  <th className="py-4 px-6 tracking-widest">Assigned To</th>
                  <th className="py-4 px-6 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* TÍTULO LIMPADO */}
                    <td className="py-4 px-6">
                       <p className="text-slate-800 font-bold">{ticket.title}</p>
                    </td>

                    {/* 🔴 NOVA CÉLULA: CATEGORIA */}
                    <td className="py-4 px-6">
                       <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-slate-200">
                         🏷️ {ticket.category || 'OTHER'}
                       </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border
                          ${ticket.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' : ''}
                          ${ticket.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                          ${!ticket.priority || ticket.priority === 'LOW' ? 'bg-slate-50 text-slate-600 border-slate-100' : ''}
                        `}>
                        {ticket.priority || 'LOW'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border
                          ${ticket.status === 'OPEN' ? 'bg-red-50 text-red-600 border-red-100' : ''}
                          ${ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                          ${ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
                        `}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                       {ticket.assignedTo ? (
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{ticket.assignedTo}</span>
                       ) : (
                          <span className="text-xs text-slate-400 italic">Unassigned</span>
                       )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setSelectedTicket(ticket)}
                        className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Review Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {tickets.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">No tickets available in the system.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Distribution</h3>
            <div className="h-80"><ResponsiveContainer><PieChart><Pie data={chartData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">{chartData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Volume</h3>
            <div className="h-80"><ResponsiveContainer><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip cursor={{fill: '#f8fafc'}} /><Bar dataKey="value" radius={[10, 10, 0, 0]}>{chartData.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar></BarChart></ResponsiveContainer></div>
          </div>
        </div>
      )}

{selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* CABEÇALHO MAIS ESTREITO E LIMPO */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800">Incident Details</h2>
                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-slate-200">
                  {selectedTicket.category || 'OTHER'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* CORPO - DUAS COLUNAS BEM DIMENSIONADAS */}
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row bg-white">
               
               {/* LADO ESQUERDO: INFORMAÇÃO COMPACTA */}
               <div className="w-full md:w-2/3 p-6 space-y-6">
                  
                  {/* Info */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{selectedTicket.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Imagem (Mais pequena e bem enquadrada) */}
                  {selectedTicket.imageUrl && selectedTicket.imageUrl !== 'No image attached' && (
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Attached Evidence</h4>
                       <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                          <img src={selectedTicket.imageUrl} alt="Evidence" className="w-full h-56 object-contain" />
                       </div>
                    </div>
                  )}

                  {/* Mapa (Botão mais subtil) */}
                  <div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Exact Location</h4>
                     {selectedTicket.latitude && selectedTicket.longitude ? (
                        <a 
                          href={`http://googleusercontent.com/maps.google.com/maps?q=${selectedTicket.latitude},${selectedTicket.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 bg-blue-50/50 hover:bg-blue-50 w-full p-4 rounded-xl border border-blue-100 transition-colors shadow-sm"
                        >
                          <span className="text-2xl">🗺️</span>
                          <div>
                            <p className="font-bold text-sm text-blue-800">Open in Google Maps</p>
                            <p className="text-xs text-blue-600/70 font-medium mt-0.5">View coordinates natively</p>
                          </div>
                        </a>
                     ) : (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                           <p className="text-sm text-slate-500 italic">No GPS coordinates captured for this incident.</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* LADO DIREITO: BARRA DE CONTROLOS APERTADA */}
               <div className="w-full md:w-1/3 p-6 bg-slate-50 border-l border-slate-100 flex flex-col shrink-0">
                  
                  <div className="flex-1 space-y-5">
                    {/* Urgência */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Urgency Level</label>
                      <select
                          value={selectedTicket.priority || 'LOW'}
                          onChange={(e) => handleTicketUpdate(selectedTicket, 'priority', e.target.value)}
                          className="w-full p-2.5 text-sm rounded-lg border border-slate-200 font-bold text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer bg-white shadow-sm"
                        >
                          <option value="LOW">🔵 LOW PRIORITY</option>
                          <option value="MEDIUM">🟡 MEDIUM PRIORITY</option>
                          <option value="HIGH">🔴 HIGH PRIORITY</option>
                      </select>
                    </div>

                    {/* Estado */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Set Status</label>
                      <select
                          value={selectedTicket.status}
                          onChange={(e) => handleTicketUpdate(selectedTicket, 'status', e.target.value)}
                          className="w-full p-2.5 text-sm rounded-lg border border-slate-200 font-bold text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer bg-white shadow-sm"
                        >
                          <option value="OPEN">🔴 OPEN</option>
                          <option value="IN_PROGRESS">🟡 IN PROGRESS</option>
                          <option value="RESOLVED">🟢 RESOLVED</option>
                      </select>
                    </div>

                    {/* Delegação */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Delegate to Team</label>
                      <select
                          value={selectedTicket.assignedTo || ''}
                          onChange={(e) => handleTicketUpdate(selectedTicket, 'assignedTo', e.target.value)}
                          className="w-full p-2.5 text-sm rounded-lg border border-slate-200 font-bold text-slate-700 focus:border-blue-500 focus:outline-none cursor-pointer bg-white shadow-sm"
                        >
                          <option value="">-- Unassigned --</option>
                          {technicians.map((tech) => (
                            <option key={tech.id} value={tech.name}>{tech.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Botões de Ação Pequenos e Normais */}
                  <div className="mt-6 space-y-3 pt-6 border-t border-slate-200">
                    <button 
                       onClick={() => setSelectedTicket(null)}
                       className="w-full py-2.5 flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer"
                    >
                       💾 Save Changes
                    </button>

                    <button 
                       onClick={() => handleDeleteTicket(selectedTicket.id)}
                       className="w-full py-2 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                    >
                       🗑️ Delete Ticket
                    </button>
                  </div>
               </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}