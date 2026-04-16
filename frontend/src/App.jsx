import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Call from './pages/Call';
import Admin from './pages/Admin';
import Domain from './pages/Domain';
import FloatingCallButton from './components/FloatingCallButton';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/call" element={<Call />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/healthcare" element={<Domain domain="healthcare" />} />
          <Route path="/finance" element={<Domain domain="finance" />} />
          <Route path="/government" element={<Domain domain="government" />} />
          <Route path="/education" element={<Domain domain="education" />} />
        </Routes>
        <FloatingCallButton />
      </div>
    </Router>
  );
}

export default App;
