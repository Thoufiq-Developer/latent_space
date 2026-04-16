import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneOff } from 'lucide-react';
import Vapi from '@vapi-ai/web';

export default function Call() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState('Detecting...');
  const [emotion, setEmotion] = useState('calm'); // calm, anxious, distressed
  
  const vapiRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const initVapi = async () => {
      // Mocking VAPI if key is absent or for simple dev
      const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || "mock-key";
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID || "mock-assistant";
      
      const vapi = new Vapi(vapiKey);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setIsActive(true);
        setDetectedLanguage('Hindi detected');
      });

      vapi.on('message', (message) => {
        if (message.type === 'transcript') {
           if(message.transcriptType === 'final') {
               setMessages(prev => [...prev, { id: Date.now(), role: message.role === 'user' ? 'user' : 'vaani', content: message.transcript }]);
           }
        }
      });

      vapi.on('call-end', () => {
        setIsActive(false);
        navigate('/');
      });

      try {
        if(vapiKey !== "mock-key") {
            await vapi.start(assistantId);
        } else {
            // Mock Call simulation
            setIsActive(true);
            setDetectedLanguage('Hindi detected');
            setMessages([{ id: 1, role: 'vaani', content: 'Namaste! Main VAANI hoon. Aaj main aapki kaise madad kar sakta hoon?' }]);
            
            setTimeout(() => {
                setMessages(prev => [...prev, { id: 2, role: 'user', content: 'Mujhe aaj se teen din pehle se bukhar aa raha hai.' }]);
                setEmotion('anxious');
            }, 3000);
            
            setTimeout(() => {
                setMessages(prev => [...prev, { id: 3, role: 'vaani', content: 'Mujhe sunkar dukh hua. Kya bukhar ke saath sir dard ya jodon mein dard bhi hai? Main aapke sabse kareebi sarakari aspatal (PHC) ka pata bhi dhoondh sakti hoon.' }]);
            }, 6000);
        }
      } catch (error) {
        console.error('VAPI start error', error);
        // Fallback for demo
        setIsActive(true);
        setMessages([{ id: 1, role: 'vaani', content: 'Mock demo started (VAPI keys not set or error occurred).' }]);
      }
    };

    initVapi();

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [navigate]);

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    navigate('/');
  };

  const getEmotionColor = () => {
    switch(emotion) {
      case 'anxious': return 'bg-amber-500';
      case 'distressed': return 'bg-red-500';
      case 'calm': 
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      <header className="p-4 flex justify-between items-center border-b border-slate-800">
        <div className="text-xl font-bold">VAANI Live Call</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-800 rounded-full px-3 py-1 text-sm text-slate-300">
            {detectedLanguage}
          </div>
          <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-3 py-1 text-sm">
            <span className="text-slate-300">Emotion:</span>
            <div className={`w-3 h-3 rounded-full ${getEmotionColor()}`}></div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-20">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 rounded-br-sm' : 'bg-slate-700 rounded-bl-sm'}`}>
                <p className="text-lg">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute inset-x-0 bottom-24 flex justify-center h-20 opacity-50 pointer-events-none overflow-hidden">
          {isActive && (
            <div className="flex items-end space-x-1 w-full justify-center text-green-400">
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-2 bg-current rounded-t animate-waveform"
                        style={{ height: `${Math.max(10, Math.random() * 60)}px`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-6 inset-x-0 flex justify-center">
          <button 
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-full shadow-lg transform transition hover:scale-105"
          >
            <PhoneOff size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}
