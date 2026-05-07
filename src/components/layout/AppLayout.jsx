import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen t-bg theme-transition">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header
        onMenuToggle={() => setSidebarOpen(o => !o)}
        menuOpen={sidebarOpen}
      />
      <main
        className="md:ml-64 pt-16 min-h-screen"
        id="main-content"
        tabIndex={-1}
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
