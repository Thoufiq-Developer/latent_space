import { useState } from 'react';
import { Home, Users, PhoneOutgoing, BookOpen, Activity, PhoneCall, CheckCircle } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);

  const mockUsers = [
    { id: '919988776655', name: 'Ramesh Singh', village: 'Rampur', lang: 'Hindi', lastCall: '2 days ago', risk: 'high', riskScore: 0.85, events: 12, topRisks: ['Missed medication', 'Crop failure anxiety'], entitlements: ['PM-KISAN (Unclaimed)', 'Ayushman Bharat'] },
    { id: '918877665544', name: 'Meena Devi', village: 'Shivpur', lang: 'Marathi', lastCall: '45 days ago', risk: 'high', riskScore: 0.78, events: 5, topRisks: ['No recent diabetes refill'], entitlements: ['Widow Pension'] },
    { id: '917766554433', name: 'Arun Kumar', village: 'Kondhwa', lang: 'Telugu', lastCall: '1 week ago', risk: 'low', riskScore: 0.2, events: 8, topRisks: ['None'], entitlements: ['Education Scholarship'] },
  ];

  const mockProactive = [
    { user: 'Meena Devi', reason: 'Health (Diabetes check)', time: '10:00 AM Today', status: 'pending', script: 'Meena tai, I noticed it has been a while since you mentioned your diabetes medicines...' },
    { user: 'Ramesh Singh', reason: 'Finance (Crop advisory)', time: '08:30 AM Today', status: 'sent', script: 'Ramu bhai, good morning. Your wheat sowing window opens in 12 days...' },
  ];

  const chartData = {
    labels: ['Healthcare', 'Finance', 'Government', 'Education', 'Other'],
    datasets: [
      {
        label: 'Calls Today',
        data: [120, 45, 60, 25, 10],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      }
    ]
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow border-l-4 border-indigo-500">
          <div className="text-slate-500 text-sm font-semibold">Total Calls Today</div>
          <div className="text-2xl font-bold text-slate-800 flex items-center mt-1"><PhoneCall className="mr-2 text-indigo-400" size={20} /> 265</div>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <div className="text-slate-500 text-sm font-semibold">Active Users</div>
          <div className="text-2xl font-bold text-slate-800 flex items-center mt-1"><Users className="mr-2 text-green-400" size={20} /> 12,400</div>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-amber-500">
          <div className="text-slate-500 text-sm font-semibold">Proactive Calls</div>
          <div className="text-2xl font-bold text-slate-800 flex items-center mt-1"><PhoneOutgoing className="mr-2 text-amber-400" size={20} /> 89</div>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <div className="text-slate-500 text-sm font-semibold">Issues Resolved</div>
          <div className="text-2xl font-bold text-slate-800 flex items-center mt-1"><CheckCircle className="mr-2 text-blue-400" size={20} /> 94%</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Calls by Domain</h3>
        <div className="h-64">
           <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow overflow-hidden">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Recent Activity</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b">
              <th className="p-2">User ID</th>
              <th className="p-2">Language</th>
              <th className="p-2">Domain</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b text-sm">
              <td className="p-2 font-mono text-slate-500">**4532</td>
              <td className="p-2">Hindi</td>
              <td className="p-2 text-indigo-600">Healthcare</td>
              <td className="p-2">3m 12s</td>
              <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Resolved</span></td>
            </tr>
             <tr className="border-b text-sm">
              <td className="p-2 font-mono text-slate-500">**8911</td>
              <td className="p-2">Marathi</td>
              <td className="p-2 text-indigo-600">Government</td>
              <td className="p-2">5m 40s</td>
              <td className="p-2"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Resolved</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="flex gap-6 h-full">
      <div className="flex-1 bg-white rounded shadow overflow-hidden">
         <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Village</th>
              <th className="p-3">Language</th>
              <th className="p-3">Risk Score</th>
              <th className="p-3">Events</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(u => (
              <tr key={u.id} onClick={() => setSelectedUser(u)} className={`cursor-pointer hover:bg-indigo-50 border-b text-sm ${selectedUser?.id === u.id ? 'bg-indigo-50' : ''}`}>
                <td className="p-3 font-medium text-indigo-900">{u.name}</td>
                <td className="p-3 text-slate-600">{u.village}</td>
                <td className="p-3 text-slate-600">{u.lang}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${u.risk === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {(u.riskScore * 100).toFixed(0)} / 100
                  </span>
                </td>
                <td className="p-3 text-slate-600">{u.events}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="w-80 bg-white rounded shadow p-5 border-t-4 border-indigo-600 flex flex-col">
          <h3 className="text-xl font-bold text-indigo-900">{selectedUser.name}</h3>
          <p className="text-slate-500 text-sm mb-4">{selectedUser.village} • {selectedUser.lang}</p>
          
          <div className="mb-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Top Risk Factors</h4>
            <ul className="space-y-1">
              {selectedUser.topRisks.map((r, i) => (
                <li key={i} className="text-sm bg-red-50 text-red-700 px-2 flex items-center p-1 rounded"><Activity size={14} className="mr-2"/> {r}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Entitlements Identified</h4>
            <ul className="space-y-1">
              {selectedUser.entitlements.map((e, i) => (
                <li key={i} className="text-sm border border-indigo-100 text-indigo-800 px-2 p-1 rounded bg-indigo-50/50">{e}</li>
              ))}
            </ul>
          </div>

          <div className="mt-auto">
             <button className="w-full bg-indigo-600 text-white rounded p-2 text-sm font-medium hover:bg-indigo-700">Trigger Outbound Call</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderProactive = () => (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-600 text-sm border-b">
            <th className="p-3">User</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Scheduled</th>
            <th className="p-3">Status</th>
            <th className="p-3">Script Preview</th>
          </tr>
        </thead>
        <tbody>
          {mockProactive.map((p, i) => (
            <tr key={i} className="border-b text-sm">
              <td className="p-3 font-medium text-indigo-900">{p.user}</td>
              <td className="p-3 text-slate-600">{p.reason}</td>
              <td className="p-3 text-slate-600">{p.time}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${p.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                  {p.status.toUpperCase()}
                </span>
              </td>
              <td className="p-3 text-xs text-slate-500 italic truncate max-w-[200px]">{p.script}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold tracking-wider border-b border-indigo-800 flex items-center justify-center">
          VAANI <span className="text-xs ml-2 bg-indigo-700 px-2 py-0.5 rounded text-indigo-200">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center p-3 rounded transition ${activeTab === 'overview' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}>
            <Home className="mr-3" size={20} /> Overview
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center p-3 rounded transition ${activeTab === 'users' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}>
            <Users className="mr-3" size={20} /> Life-Graph Users
          </button>
          <button onClick={() => setActiveTab('proactive')} className={`w-full flex items-center p-3 rounded transition ${activeTab === 'proactive' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}>
            <PhoneOutgoing className="mr-3" size={20} /> Proactive Calls
          </button>
          <button onClick={() => setActiveTab('kb')} className={`w-full flex items-center p-3 rounded transition ${activeTab === 'kb' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'}`}>
            <BookOpen className="mr-3" size={20} /> Knowledge Base
          </button>
        </nav>
      </aside>
      
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize">{activeTab.replace('_', ' ')}</h2>
        
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'proactive' && renderProactive()}
        {activeTab === 'kb' && (
          <div className="bg-white p-6 rounded shadow text-slate-500">
            Knowledge base management interface. Requires Qdrant connection to load vectors.
          </div>
        )}
      </main>
    </div>
  );
}
