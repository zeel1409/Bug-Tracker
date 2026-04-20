import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import './layout.css';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change / resize
  useEffect(() => {
    const close = () => setSidebarOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <div className="app-layout">
      {/* Hamburger (mobile only) */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar — pass open state so it can apply class */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
