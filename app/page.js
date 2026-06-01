'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar      from '../components/layout/Navbar';
import Footer      from '../components/layout/Footer';
import ScrollingNotice from '../components/home/ScrollingNotice';
import NoticeBoard from '../components/home/NoticeBoard';
import PrincipalMessage from '../components/home/PrincipalMessage';
import QuickLinks  from '../components/home/QuickLinks';
import CalendarWidget from '../components/home/CalendarWidget';
import StatsSection from '../components/home/StatsSection';
import HomeMenuGrid from '../components/home/HomeMenuGrid';
import LocationMap from '../components/home/LocationMap';
import { settingsAPI } from '../lib/api';

// Images load after text — lazy loaded
const HeroSlider    = dynamic(() => import('../components/home/HeroSlider'),    { ssr: false, loading: () => <div className="bg-gray-200 animate-pulse" style={{ height:'380px' }}/> });
const GalleryPreview= dynamic(() => import('../components/home/GalleryPreview'),{ ssr: false, loading: () => <div className="skeleton rounded-xl h-40"/> });

export default function HomePage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsAPI.get().then(r => {
      setSettings(r.data);
      if (r.data?.collegeName) {
        document.title = `${r.data.collegeName} - অফিসিয়াল ওয়েবসাইট`;
      }
    }).catch(() => {});
  }, []);

  return (
    <>
      <Navbar/>
      <main>
        {/* 1. Images (lazy) */}
        <HeroSlider/>
        {/* 2. Text content loads immediately */}
        <ScrollingNotice/>
        <div className="container mx-auto px-3 md:px-4 py-4">
          {/* Stats — text only, numbers from API */}
          <StatsSection/>
          {/* Menu grid — static text, loads instantly */}
          <HomeMenuGrid/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Notice board — text content */}
              <NoticeBoard/>
              {/* Gallery — lazy loaded images */}
              <GalleryPreview/>
            </div>
            {/* Right sidebar — text content */}
            <div className="space-y-4">
              <PrincipalMessage type="principal"/>
              <PrincipalMessage type="chairman"/>
              <QuickLinks/>
              <CalendarWidget/>
            </div>
          </div>
          {/* Map — iframe loads lazily */}
          <LocationMap/>
        </div>
      </main>
      <Footer/>
    </>
  );
}
