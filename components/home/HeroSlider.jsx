'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryAPI, settingsAPI } from '../../lib/api';

export default function HeroSlider() {
  const [slides,        setSlides]        = useState([]);
  const [settings,      setSettings]      = useState(null);
  const [current,       setCurrent]       = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.allSettled([
      galleryAPI.getAll({ isSlider: true, limit: 8 }),
      settingsAPI.get(),
    ]).then(([galleryRes, settingsRes]) => {
      if (galleryRes.status === 'fulfilled' && galleryRes.value.data?.length > 0) {
        setSlides(galleryRes.value.data);
      }
      if (settingsRes.status === 'fulfilled') {
        setSettings(settingsRes.value.data);
      }
      setLoading(false);
    });
  }, []);

  const next = useCallback(() => setCurrent(c => (c+1) % Math.max(slides.length,1)), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c-1+Math.max(slides.length,1)) % Math.max(slides.length,1)), [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [isAutoPlaying, next, slides.length]);

  // কোনো slider image না থাকলে college logo/banner দেখাও
  if (!loading && slides.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-primary-900 via-primary to-green-700 flex items-center justify-center overflow-hidden"
        style={{ height: '380px' }}>
        <div className="text-center text-white px-4 z-10">
          {settings?.logo?.url && (
            <div className="mb-4 flex justify-center">
              <Image src={settings.logo.url} alt="Logo" width={90} height={90} className="object-contain drop-shadow-xl rounded-full bg-white/10 p-2"/>
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg mb-3">
            {settings?.collegeName || 'মাদরাসাতু দারিল কুরআন'}
          </h1>
          <p className="text-lg md:text-xl text-green-200 mb-2">{settings?.tagline || 'জ্ঞানই শক্তি'}</p>
          <p className="text-sm text-green-300">{settings?.address || ''}</p>
          <p className="text-xs text-green-400 mt-2">EIIN: {settings?.eiinNumber || ''}</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3"/>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"/>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gray-900 w-full"
      style={{ height: '400px' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}>
      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity:0, scale:1.04 }}
          animate={{ opacity:1, scale:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.7 }}
          className="absolute inset-0">
          {slides[current]?.image?.url ? (
            <Image
              src={slides[current].image.url}
              alt={slides[current].title || 'College Banner'}
              fill priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-900 to-primary"/>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>

          {/* Overlay text */}
          <div className="absolute bottom-14 left-0 right-0 text-center px-4">
            {settings?.logo?.url && (
              <div className="flex justify-center mb-3">
                <Image src={settings.logo.url} alt="Logo" width={60} height={60}
                  className="object-contain drop-shadow-xl rounded-full bg-white/20 p-1"/>
              </div>
            )}
            <motion.h2
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.3 }}
              className="text-white text-2xl md:text-4xl font-bold drop-shadow-xl">
              {settings?.collegeName || ''}
            </motion.h2>
            {slides[current]?.titleBn && (
              <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
                className="text-green-200 text-sm mt-2">{slides[current].titleBn}</motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-primary text-white p-2.5 rounded-full transition-all z-10">
            <FaChevronLeft size={16}/>
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-primary text-white p-2.5 rounded-full transition-all z-10">
            <FaChevronRight size={16}/>
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_,i)=>(
              <button key={i} onClick={()=>setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${i===current?'bg-white w-7 h-2.5':'bg-white/50 w-2.5 h-2.5'}`}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
