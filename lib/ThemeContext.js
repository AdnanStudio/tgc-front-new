'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { themeAPI } from './api';

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

const DEFAULT_THEME = {
  primary:'#1a6b3c', secondary:'#c41e3a', accent:'#f5a623',
  navBg:'#1a6b3c', navText:'#ffffff', topBarBg:'#0f3420',
  heroOverlay:'rgba(0,0,0,0.45)', cardBg:'#ffffff', bodyBg:'#f8f9fa',
  footerBg:'#111827', sectionTitleBg:'#1a6b3c', btnPrimary:'#1a6b3c',
  btnSecondary:'#c41e3a', linkColor:'#1a6b3c',
  borderRadius:'md', fontFamily:'hind', navStyle:'solid', cardStyle:'shadow', sectionStyle:'flat',
};

const RADIUS_MAP = { none:'0px', sm:'4px', md:'8px', lg:'12px', xl:'16px', full:'9999px' };

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    themeAPI.getActive()
      .then(r => { if (r.data) setTheme({ ...DEFAULT_THEME, ...r.data }); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--color-primary',       theme.primary);
    r.style.setProperty('--color-secondary',      theme.secondary);
    r.style.setProperty('--color-accent',         theme.accent);
    r.style.setProperty('--color-nav-bg',         theme.navBg);
    r.style.setProperty('--color-nav-text',       theme.navText || '#ffffff');
    r.style.setProperty('--color-topbar-bg',      theme.topBarBg);
    r.style.setProperty('--color-hero-overlay',   theme.heroOverlay);
    r.style.setProperty('--color-card-bg',        theme.cardBg);
    r.style.setProperty('--color-body-bg',        theme.bodyBg);
    r.style.setProperty('--color-footer-bg',      theme.footerBg);
    r.style.setProperty('--color-section-title',  theme.sectionTitleBg);
    r.style.setProperty('--color-btn-primary',    theme.btnPrimary);
    r.style.setProperty('--color-btn-secondary',  theme.btnSecondary);
    r.style.setProperty('--color-link',           theme.linkColor);
    r.style.setProperty('--border-radius',        RADIUS_MAP[theme.borderRadius] || '8px');
    if (theme.bodyBg) document.body.style.background = theme.bodyBg;
  }, [theme]);

  const refreshTheme = () => {
    themeAPI.getActive()
      .then(r => { if (r.data) setTheme({ ...DEFAULT_THEME, ...r.data }); })
      .catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
