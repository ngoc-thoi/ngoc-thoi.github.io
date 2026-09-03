import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import CoupleStory from './components/CoupleStory';
import EventsAndMap from './components/EventsAndMap';
import PhotoGallery from './components/PhotoGallery';
import AudioPlayer from './components/AudioPlayer';
import PetalEffects from './components/PetalEffects';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { useGuest } from './hooks/useGuest';

export default function App() {
  const { guest, allGuests, config, loading, refreshAll } = useGuest();
  const [showAdmin, setShowAdmin] = useState(false);

  // Check if user visited with #admin in URL
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setShowAdmin(true);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const closeAdmin = () => {
    setShowAdmin(false);
    if (window.location.hash === '#admin') {
      history.replaceState(null, null, ' ');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-stone-800 font-sans relative selection:bg-wedding-red-800 selection:text-amber-200">
      {/* Background Wedding Music Player */}
      <AudioPlayer config={config} />

      {/* Falling Flower Confetti / Petals */}
      <PetalEffects />

      {/* Main Wedding Invitation Sections */}
      <Hero guest={guest} config={config} />
      <Countdown config={config} />
      <CoupleStory config={config} />
      <EventsAndMap config={config} />
      <PhotoGallery />
      <Footer onOpenAdmin={() => setShowAdmin(true)} config={config} />

      {/* Secret / Built-in Admin Manager Modal */}
      {showAdmin && (
        <AdminDashboard
          onClose={closeAdmin}
          config={config}
          onRefreshData={refreshAll}
        />
      )}
    </div>
  );
}
