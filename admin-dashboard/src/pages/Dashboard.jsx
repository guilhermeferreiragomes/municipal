import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard({ activeTab }) {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);

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

    // Reload evety 5 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); 

    return () => clearInterval(intervalId);
  }, []);


  const handleTicketUpdate = async (ticket, field, value) => {
    if (ticket[field] === value)
      return;
    const updatedTicket = { ...ticket, [field]: value };

    try {
      const response = await fetch(`/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTicket),
      });
      
      if (response.ok) {
        setTickets(tickets.map(t => t.id === ticket.id ? updatedTicket : t));
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const response = await fetch(`/tickets/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTickets(tickets.filter(t => t.id !== id));
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

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-200">
                  <th className="py-4 px-6 tracking-widest">Title</th>
                  <th className="py-4 px-6 tracking-widest">Description</th>
                  <th className="py-4 px-6 tracking-widest">Status</th>
                  {/* NOVA COLUNA */}
                  <th className="py-4 px-6 tracking-widest">Assignee</th>
                  <th className="py-4 px-6 tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-semibold">{ticket.title}</td>
                    <td className="py-4 px-6 text-slate-500 text-sm truncate max-w-xs">{ticket.description}</td>
                    
                    <td className="py-4 px-6">
                      <select
                        value={ticket.status}
                        onChange={(e) => handleTicketUpdate(ticket, 'status', e.target.value)}
                        className={`cursor-pointer px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase border-2 focus:outline-none transition-colors
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

                    {/* NOVO DROPDOWN DE ATRIBUIÇÃO */}
                    <td className="py-4 px-6">
                      <select
                        value={ticket.assignedTo || ''}
                        onChange={(e) => handleTicketUpdate(ticket, 'assignedTo', e.target.value)}
                        className="cursor-pointer w-full px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50"
                      >
                        <option value="" className="text-slate-400">Unassigned</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.name}>{tech.name}</option>
                        ))}
                      </select>
                    </td>

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
            <h3 className="text-lg font-bold text-slate-800 mb-6">Distribution</h3>
            <div className="h-80"><ResponsiveContainer><PieChart><Pie data={chartData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">{chartData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Volume</h3>
            <div className="h-80"><ResponsiveContainer><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip cursor={{fill: '#f8fafc'}} /><Bar dataKey="value" radius={[10, 10, 0, 0]}>{chartData.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar></BarChart></ResponsiveContainer></div>
          </div>
        </div>
      )}
    </>
  );
}