import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        
        if (userData.role !== 'ADMIN') {
          setError('Access denied. This dashboard is for Administrators only.');
          return;
        }

        onLogin();
                
      } else {
        const errData = await response.json();
        setError(errData.message || 'Email or password incorrect.');
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError('Connection to server failed.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900 font-sans">
      <div className="p-10 bg-white rounded-2xl shadow-2xl w-400px">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800">MuniciPal</h1>
          <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest font-bold">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold text-center border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
              placeholder="admin@municipal.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="cursor-pointer w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}