import { useNavigate } from 'react-router-dom';
import { Phone, Users, Globe, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-indigo-900 text-white p-4 shadow-md flex justify-between items-center">
        <div className="text-2xl font-bold tracking-wider">VAANI</div>
        <select className="bg-indigo-800 border bg-transparent border-indigo-700 text-white rounded p-1 px-2">
          <option>Hindi</option>
          <option>Tamil</option>
          <option>Telugu</option>
          <option>Marathi</option>
          <option>Bengali</option>
          <option>Odia</option>
          <option>Gujarati</option>
          <option>English</option>
        </select>
      </header>

      <main className="flex-grow flex flex-col items-center p-6 mt-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">
          Your AI life companion
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl px-4">
          A proactive, multilingual voice AI that calls YOU before you know you need help. No apps, no typing, just a caring voice.
        </p>

        <button 
          onClick={() => navigate('/call')}
          className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-xl transform transition hover:scale-105 flex items-center mb-16"
        >
          <Phone className="mr-3" size={32} />
          Call VAANI Now
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
          <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col items-center">
            <Users className="text-indigo-500 mb-3" size={32} />
            <h3 className="text-3xl font-bold text-slate-800">12,400</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Users served</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col items-center">
            <Globe className="text-indigo-500 mb-3" size={32} />
            <h3 className="text-3xl font-bold text-slate-800">8</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Languages supported</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col items-center">
            <CheckCircle2 className="text-indigo-500 mb-3" size={32} />
            <h3 className="text-3xl font-bold text-slate-800">94%</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Issue resolved on 1st call</p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl px-4">
          <button onClick={() => navigate('/healthcare')} className="p-4 bg-white rounded-lg shadow text-indigo-900 font-semibold hover:bg-indigo-50 transition border border-indigo-100">Healthcare</button>
          <button onClick={() => navigate('/finance')} className="p-4 bg-white rounded-lg shadow text-indigo-900 font-semibold hover:bg-indigo-50 transition border border-indigo-100">Finance</button>
          <button onClick={() => navigate('/government')} className="p-4 bg-white rounded-lg shadow text-indigo-900 font-semibold hover:bg-indigo-50 transition border border-indigo-100">Government</button>
          <button onClick={() => navigate('/education')} className="p-4 bg-white rounded-lg shadow text-indigo-900 font-semibold hover:bg-indigo-50 transition border border-indigo-100">Education</button>
        </div>
      </main>

      <footer className="bg-slate-800 text-slate-300 py-6 text-center text-sm font-medium">
        Powered by VAPI + Qdrant
      </footer>
    </div>
  );
}
