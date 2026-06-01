import { useState, useEffect } from 'react';

export default function Technicians() {
  const [techs, setTechs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const fetchTechs = async () => {
    try {
      const response = await fetch('/users?role=TECHNICIAN');
      const data = await response.json();
      setTechs(data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingId ? `/users/${editingId}` : '/users';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'TECHNICIAN' }),
      });

      if (response.ok) {
        closeModal();
        fetchTechs();
      } else {
        alert("Failed to save. Does this email already exist?");
      }
    } catch (error) {
      console.error("Error saving technician:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this technician's access?")) return;
    try {
      const response = await fetch(`/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTechs(techs.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error("Error deleting technician:", error);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (tech) => {
    setEditingId(tech.id);
    setFormData({ name: tech.name, email: tech.email, password: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Field Technicians</h3>
          <p className="text-slate-500 text-sm">Manage maintenance team access and accounts.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="cursor-pointer bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          + Add Technician
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-200">
              <th className="py-4 px-6 tracking-widest">Name</th>
              <th className="py-4 px-6 tracking-widest">Email</th>
              <th className="py-4 px-6 tracking-widest">Role</th>
              <th className="py-4 px-6 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {techs.map((tech) => (
              <tr key={tech.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-slate-800 font-bold">{tech.name}</td>
                <td className="py-4 px-6 text-slate-500 text-sm">{tech.email}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600">
                    Active
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={() => openEditModal(tech)}
                    className="cursor-pointer text-slate-400 hover:text-blue-600 transition-colors duration-200 text-sm font-bold mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(tech.id)}
                    className="cursor-pointer text-slate-400 hover:text-red-600 transition-colors duration-200 text-sm font-bold"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
            
            {techs.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400 text-sm">
                  No technicians found. Add your first team member!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-400px animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {editingId ? 'Edit Technician' : 'New Technician'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                  placeholder="e.g. Luigi Rossi"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                  placeholder="luigi@municipal.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  {editingId ? 'New Password (Optional)' : 'Password'}
                </label>
                <input 
                  type="password" 
                  required={!editingId}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="cursor-pointer px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                >
                  {editingId ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}