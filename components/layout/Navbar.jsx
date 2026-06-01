'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaFacebook, FaYoutube, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { settingsAPI, navMenuAPI, scrollingAPI } from '../../lib/api';

export default function Navbar() {
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled,       setScrolled]       = useState(false);
  const [settings,       setSettings]       = useState(null);
  const [navMenus,       setNavMenus]       = useState([]);
  const [scrollTexts,    setScrollTexts]    = useState([]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const pathname  = usePathname();
  const timeoutRef = useRef(null);

  useEffect(() => {
    Promise.allSettled([
      settingsAPI.get(),
      navMenuAPI.getAll(),
      scrollingAPI.getAll(),
    ]).then(([s, n, sc]) => {
      if (s.status  === 'fulfilled') setSettings(s.value.data);
      if (n.status  === 'fulfilled') setNavMenus(n.value.data || []);
      if (sc.status === 'fulfilled') setScrollTexts(sc.value.data || []);
      setSettingsLoaded(true);
    });
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setActiveDropdown(null); }, [pathname]);

  const handleEnter = label => { clearTimeout(timeoutRef.current); setActiveDropdown(label); };
  const handleLeave = ()    => { timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150); };

  const isActive = href => href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Scrolling text string
  const scrollStr = scrollTexts.length > 0
    ? scrollTexts.map(t => t.text).join('   ✦   ')
    : (settings?.scrollingNotice || '');

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Top Bar ── */}
      <div className="theme-topbar hidden md:block py-1.5 px-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          {/* Left: phone + email */}
          <div className="flex items-center gap-4 text-white/90">
            {settings?.phone?.[0] && (
              <span className="flex items-center gap-1.5 text-xs">
                <FaPhone className="text-yellow-400" size={10}/>
                {settings.phone[0]}
              </span>
            )}
            {settings?.email && (
              <span className="flex items-center gap-1.5 text-xs">
                <FaEnvelope className="text-yellow-400" size={10}/>
                {settings.email}
              </span>
            )}
          </div>
          {/* Center: scrolling text on PC */}
          {scrollStr && settings?.isScrollingActive !== false && (
            <div className="flex-1 mx-4 overflow-hidden hidden lg:block">
              <div className="notice-scroll-wrapper">
                <span className="notice-scroll-content text-xs text-yellow-200 font-medium">
                  {scrollStr}&nbsp;&nbsp;✦&nbsp;&nbsp;{scrollStr}
                </span>
              </div>
            </div>
          )}
          {/* Right: social + login */}
          <div className="flex items-center gap-3 text-white/90">
            {settings?.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors"><FaFacebook size={14}/></a>
            )}
            {settings?.socialLinks?.youtube && (
              <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors"><FaYoutube size={14}/></a>
            )}
            <Link href="/admin/login"
              className="bg-yellow-500 text-black px-3 py-0.5 rounded text-xs font-bold hover:bg-yellow-400 transition-colors">
              লগইন
            </Link>
          </div>
        </div>
      </div>

      {/* ── Logo Bar ── */}
      <div className={`bg-white border-b-2 transition-all duration-300 ${scrolled ? 'py-1' : 'py-2'}`}
        style={{ borderBottomColor:'var(--color-primary)33' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-3 min-w-0">
              {/* Logo skeleton → image */}
              <div className="w-12 h-12 flex-shrink-0 relative">
                {settingsLoaded ? (
                  settings?.logo?.url ? (
                    <Image src={settings.logo.url} alt="Logo" fill className="object-contain" sizes="48px"/>
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg theme-primary">
                      ম
                    </div>
                  )
                ) : (
                  <div className="w-12 h-12 rounded-full skeleton"/>
                )}
              </div>
              <div className="min-w-0">
                {settingsLoaded ? (
                  <>
                    <h1 className="text-lg md:text-2xl font-bold leading-tight truncate"
                      style={{ color:'var(--color-primary)' }}>
                      {settings?.collegeName || 'মাদরাসাতু দারিল কুরআন'}
                    </h1>
                    <p className="text-xs text-gray-500 hidden md:block truncate">
                      {settings?.addressEn || 'Chandani Mohol, Khulna'}
                    </p>
                    <p className="text-xs text-gray-400 hidden md:block">
                      EIIN: {settings?.eiinNumber || ''}
                      {settings?.establishedYear ? ` | প্রতিষ্ঠিত: ${settings.establishedYear}` : ''}
                    </p>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <div className="skeleton-text w-40 h-5"/>
                    <div className="skeleton-text w-56 h-3 hidden md:block"/>
                  </div>
                )}
              </div>
            </Link>
            {/* Mobile toggle */}
            <button className="md:hidden p-2 theme-text-primary flex-shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FaTimes size={22}/> : <FaBars size={22}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile scrolling bar */}
      {scrollStr && settings?.isScrollingActive !== false && (
        <div className="bg-yellow-400 py-1.5 md:hidden overflow-hidden">
          <div className="notice-scroll-wrapper">
            <span className="notice-scroll-content text-xs text-gray-900 font-medium">
              {scrollStr}&nbsp;&nbsp;✦&nbsp;&nbsp;{scrollStr}
            </span>
          </div>
        </div>
      )}

      {/* ── Nav Bar Desktop ── */}
      <nav className="theme-nav hidden md:block shadow-md">
        <div className="container mx-auto px-4">
          {navMenus.length === 0 ? (
            /* Skeleton nav */
            <div className="flex gap-1 py-2">
              {[...Array(7)].map((_,i) => (
                <div key={i} className="w-20 h-8 rounded bg-white/10 animate-pulse"/>
              ))}
            </div>
          ) : (
            <ul className="flex items-center flex-wrap">
              {navMenus.map(item => (
                <li key={item._id} className="relative"
                  onMouseEnter={() => item.children?.length && handleEnter(item._id)}
                  onMouseLeave={() => item.children?.length && handleLeave()}>
                  <Link href={item.href || '#'}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className={`flex items-center gap-1 px-3 py-3 text-sm font-medium whitespace-nowrap transition-all
                      ${isActive(item.href)
                        ? 'bg-black/20 text-yellow-300'
                        : 'text-white hover:bg-black/15 hover:text-yellow-300'}`}>
                    {item.labelBn || item.label}
                    {item.children?.filter(c=>c.isActive!==false).length > 0 && (
                      <FaChevronDown size={9} className="mt-0.5"/>
                    )}
                  </Link>
                  {item.children?.filter(c=>c.isActive!==false).length > 0 && (
                    <AnimatePresence>
                      {activeDropdown === item._id && (
                        <motion.ul
                          initial={{ opacity:0, y:-8 }}
                          animate={{ opacity:1, y:0 }}
                          exit={{ opacity:0, y:-8 }}
                          transition={{ duration:0.15 }}
                          className="absolute top-full left-0 bg-white shadow-xl min-w-[210px] z-50 py-1 border-t-2 overflow-hidden"
                          style={{ borderColor:'var(--color-primary)', borderRadius:`0 0 var(--border-radius) var(--border-radius)` }}>
                          {item.children.filter(c=>c.isActive!==false).sort((a,b)=>a.order-b.order).map(child => (
                            <li key={child._id || child.labelBn}>
                              <Link href={child.href || '#'}
                                target={child.isExternal ? '_blank' : undefined}
                                rel={child.isExternal ? 'noopener noreferrer' : undefined}
                                className="dropdown-item flex items-center gap-2 text-sm">
                                <span style={{ color:'var(--color-primary)' }}>›</span>
                                {child.labelBn || child.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            className="md:hidden bg-white border-b shadow-lg overflow-hidden max-h-[80vh] overflow-y-auto">
            <ul className="py-1">
              {navMenus.map(item => (
                <li key={item._id}>
                  <Link href={item.href || '#'}
                    className={`block px-5 py-3 text-sm font-medium border-b border-gray-100 transition-colors
                      ${isActive(item.href) ? 'text-white theme-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                    style={isActive(item.href) ? { background:'var(--color-primary)', color:'white' } : {}}>
                    {item.labelBn || item.label}
                  </Link>
                  {item.children?.filter(c=>c.isActive!==false).length > 0 && (
                    <ul className="bg-gray-50 border-b">
                      {item.children.filter(c=>c.isActive!==false).sort((a,b)=>a.order-b.order).map(child => (
                        <li key={child._id || child.labelBn}>
                          <Link href={child.href || '#'}
                            className="block pl-8 pr-4 py-2.5 text-sm text-gray-600 hover:text-primary border-b border-gray-100 transition-colors">
                            › {child.labelBn || child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="px-4 py-3">
                <Link href="/admin/login" className="block w-full text-center btn-primary py-2 rounded-md text-sm">
                  অ্যাডমিন লগইন
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
