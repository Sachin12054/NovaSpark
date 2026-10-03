import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SimulatedBanner } from './components/SimulatedBanner';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { ProjectPage } from './pages/ProjectPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { GrowthAdminPage } from './pages/GrowthAdminPage';
import { Student } from './types';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [referralCodeFromUrl, setReferralCodeFromUrl] = useState<string | undefined>(undefined);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string | undefined>(undefined);
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Parse hash and search params on mount & popstate
  useEffect(() => {
    const handleLocationChange = () => {
      // Parse query params for ?ref=...
      const urlParams = new URLSearchParams(window.location.search);
      let ref = urlParams.get('ref') || undefined;

      // Also check hash-based routes e.g. #/register?ref=SACHIN27
      const hash = window.location.hash || '#/';
      const cleanHash = hash.replace(/^#/, '');
      const [path, queryString] = cleanHash.split('?');

      if (!ref && queryString) {
        const hashParams = new URLSearchParams(queryString);
        ref = hashParams.get('ref') || undefined;
      }

      if (ref) {
        setReferralCodeFromUrl(ref);
      }

      setCurrentPath(path || '/');
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Check cached student
    const cached = localStorage.getItem('nxtwave_current_student');
    if (cached) {
      try {
        setRegisteredStudent(JSON.parse(cached));
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Simulation Banner */}
      <SimulatedBanner />

      {/* Main Navbar */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        registeredStudent={registeredStudent}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            navigate={navigate}
            referralCodeFromUrl={referralCodeFromUrl}
          />
        )}

        {currentPath === '/chat' && (
          <ChatPage
            navigate={navigate}
            registeredStudent={registeredStudent}
          />
        )}

        {currentPath === '/project' && (
          <ProjectPage
            navigate={navigate}
            onSelectProjectForRegistration={(title) => {
              setSelectedProjectTitle(title);
            }}
          />
        )}

        {currentPath === '/register' && (
          <RegisterPage
            navigate={navigate}
            referralCodeFromUrl={referralCodeFromUrl}
            selectedProjectTitle={selectedProjectTitle}
            registeredStudent={registeredStudent}
            setRegisteredStudent={(student) => {
              setRegisteredStudent(student);
              localStorage.setItem('nxtwave_current_student', JSON.stringify(student));
            }}
            addToast={addToast}
          />
        )}

        {currentPath === '/dashboard' && (
          <DashboardPage
            navigate={navigate}
            registeredStudent={registeredStudent}
            addToast={addToast}
          />
        )}

        {currentPath === '/leaderboard' && (
          <LeaderboardPage
            navigate={navigate}
            registeredStudent={registeredStudent}
          />
        )}

        {(currentPath === '/growth' || currentPath === '/admin' || currentPath === '/dashboard-admin') && (
          <GrowthAdminPage addToast={addToast} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
