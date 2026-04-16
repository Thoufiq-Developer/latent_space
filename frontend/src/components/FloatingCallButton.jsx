import { Phone } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FloatingCallButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/call') return null;

  return (
    <button
      onClick={() => navigate('/call')}
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center"
      aria-label="Need help? Call VAANI"
    >
      <Phone size={24} />
      <span className="ml-2 font-medium">Need help?</span>
    </button>
  );
}
