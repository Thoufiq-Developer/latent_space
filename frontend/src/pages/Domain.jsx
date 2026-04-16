import { useNavigate } from 'react-router-dom';
import { HeartPulse, Coins, Landmark, BookOpen, ArrowLeft } from 'lucide-react';

export default function Domain({ domain }) {
  const navigate = useNavigate();

  const getDomainDetails = () => {
    switch(domain) {
      case 'healthcare':
        return {
          icon: <HeartPulse className="text-red-500 mb-4" size={64} />,
          title: 'Healthcare Navigator',
          desc: 'Get help with medical symptoms, find nearest hospitals, and check your eligibility for PMJAY and other health insurance schemes.',
          color: 'bg-red-50 text-red-900 border-red-200'
        };
      case 'finance':
        return {
          icon: <Coins className="text-amber-500 mb-4" size={64} />,
          title: 'Financial Guidance',
          desc: 'Get updates on PM-KISAN installments, learn about Mudra loans, and track your agricultural subsidies.',
          color: 'bg-amber-50 text-amber-900 border-amber-200'
        };
      case 'government':
        return {
          icon: <Landmark className="text-blue-500 mb-4" size={64} />,
          title: 'Scheme Enrollment Assistant',
          desc: 'Link your Aadhaar, update your ration card, and discover which government entitlements your family qualifies for.',
          color: 'bg-blue-50 text-blue-900 border-blue-200'
        };
      case 'education':
        return {
          icon: <BookOpen className="text-green-500 mb-4" size={64} />,
          title: 'Learning Companion',
          desc: 'Find educational content on the Diksha platform, track school enrollment, and discover scholarships.',
          color: 'bg-green-50 text-green-900 border-green-200'
        };
      default:
        return { icon: null, title: 'Domain', desc: '', color: '' };
    }
  };

  const details = getDomainDetails();

  return (
    <div className="flex flex-col min-h-screen">
       <header className="bg-indigo-900 text-white p-4 shadow-md flex items-center">
        <button onClick={() => navigate('/')} className="mr-4 hover:bg-indigo-800 p-2 rounded transition">
          <ArrowLeft size={24} />
        </button>
        <div className="text-2xl font-bold tracking-wider">VAANI</div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className={`p-10 rounded-2xl border-2 shadow-xl max-w-lg flex flex-col items-center ${details.color}`}>
          {details.icon}
          <h1 className="text-3xl font-extrabold mb-4">{details.title}</h1>
          <p className="text-lg opacity-90 mb-8 max-w-md">
            {details.desc}
          </p>
          <button 
            onClick={() => navigate('/call')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105"
          >
            Start voice consultation
          </button>
        </div>
      </main>
    </div>
  );
}
