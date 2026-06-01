'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaYoutube } from 'react-icons/fa';
import { settingsAPI, quickLinkAPI } from '../../lib/api';

function SkeletonBlock({ w='w-full', h='h-4' }) {
  return <div className={`skeleton ${w} ${h} rounded`}/>;
}

export default function Footer() {
  const [settings,  setSettings]  = useState(null);
  const [quickLinks,setQuickLinks]= useState([]);
  const [footerLinks,setFooterLinks]= useState([]);
  const [loaded,    setLoaded]    = useState(false);

  useEffect(() => {
    Promise.allSettled([
      settingsAPI.get(),
      quickLinkAPI.getAll({ section:'important' }),
      quickLinkAPI.getAll({ section:'footer' }),
    ]).then(([s, q, f]) => {
      if (s.status === 'fulfilled') setSettings(s.value.data);
      if (q.status === 'fulfilled') setQuickLinks(q.value.data || []);
      if (f.status === 'fulfilled') setFooterLinks(f.value.data || []);
      setLoaded(true);
    });
  }, []);

  return (
    <footer style={{ background:'var(--color-footer-bg)' }} className="text-gray-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* College Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {!loaded ? (
                <>
                  <div className="w-12 h-12 skeleton rounded-full flex-shrink-0"/>
                  <div className="space-y-1.5"><SkeletonBlock w="w-32" h="h-4"/><SkeletonBlock w="w-24" h="h-3"/></div>
                </>
              ) : (
                <>
                  {settings?.logo?.url ? (
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image src={settings.logo.url} alt="Logo" fill className="object-contain" sizes="48px"/>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background:'var(--color-primary)' }}>মক</div>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-sm">{settings?.collegeNameEn || 'MALKHANAGAR COLLEGE'}</h3>
                    {settings?.tagline && <p className="text-xs text-gray-400">{settings.tagline}</p>}
                  </div>
                </>
              )}
            </div>
            {!loaded ? (
              <div className="space-y-2"><SkeletonBlock/><SkeletonBlock w="w-3/4"/><SkeletonBlock w="w-2/3"/></div>
            ) : (
              <div className="space-y-2 text-xs">
                {settings?.addressEn && (
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="mt-0.5 flex-shrink-0" style={{ color:'var(--color-primary)' }} size={11}/>
                    <span>{settings.addressEn}</span>
                  </div>
                )}
                {settings?.phone?.map((ph,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FaPhone className="flex-shrink-0" style={{ color:'var(--color-primary)' }} size={10}/>
                    <a href={`tel:${ph}`} className="hover:text-white transition-colors">{ph}</a>
                  </div>
                ))}
                {settings?.email && (
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="flex-shrink-0" style={{ color:'var(--color-primary)' }} size={10}/>
                    <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors break-all">{settings.email}</a>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              {settings?.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">
                  <FaFacebook size={12}/>
                </a>
              )}
              {settings?.socialLinks?.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors">
                  <FaYoutube size={12}/>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links — dynamic from DB */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-gray-700">দ্রুত লিংক</h4>
            {!loaded ? (
              <div className="space-y-2">{[...Array(6)].map((_,i)=><SkeletonBlock key={i} w="w-3/4"/>)}</div>
            ) : (
              <ul className="space-y-2 text-xs">
                {footerLinks.slice(0,8).map(l => (
                  <li key={l._id}>
                    {l.isExternal ? (
                      <a href={l.url} target="_blank" rel="noopener noreferrer"
                        className="hover:text-white transition-colors flex items-center gap-1">
                        <span style={{ color:'var(--color-primary)' }}>›</span> {l.labelBn || l.label}
                      </a>
                    ) : (
                      <Link href={l.url} className="hover:text-white transition-colors flex items-center gap-1">
                        <span style={{ color:'var(--color-primary)' }}>›</span> {l.labelBn || l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Important Links — dynamic */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-gray-700">গুরুত্বপূর্ণ লিংক</h4>
            {!loaded ? (
              <div className="space-y-2">{[...Array(6)].map((_,i)=><SkeletonBlock key={i} w="w-3/4"/>)}</div>
            ) : (
              <ul className="space-y-2 text-xs">
                {quickLinks.slice(0,8).map(l => (
                  <li key={l._id}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer"
                      className="hover:text-white transition-colors flex items-center gap-1">
                      <span style={{ color:'var(--color-primary)' }}>›</span> {l.labelBn || l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* College Stats */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-gray-700">কলেজের তথ্য</h4>
            {!loaded ? (
              <div className="space-y-2">{[...Array(4)].map((_,i)=><SkeletonBlock key={i}/>)}</div>
            ) : (
              <div className="space-y-2 text-xs">
                {[
                  ['প্রতিষ্ঠা', settings?.establishedYear || ''],
                  ['EIIN',      settings?.eiinNumber       || ''],
                  ...(settings?.mpoNumber ? [['MPO', settings.mpoNumber]] : []),
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between border-b border-gray-700/40 pb-1">
                    <span className="text-gray-400">{k}:</span>
                    <span className="text-yellow-400 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {settings?.playStoreLink && (
              <a href={settings.playStoreLink} target="_blank" rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 hover:bg-gray-700 transition-colors">
                <span className="text-2xl">▶</span>
                <div><p className="text-xs text-gray-400">GET IT ON</p><p className="text-sm font-semibold text-white">Google Play</p></div>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-3">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-1">
          {!loaded
            ? <SkeletonBlock w="w-72" h="h-3"/>
            : <p>{settings?.footerText || `All rights reserved © ${new Date().getFullYear()}, MALKHANAGAR COLLEGE`}</p>
          }
          <p>Design by <a href="https://amaderwebsite.com.bd" target="_blank" rel="noopener noreferrer"
            className="hover:text-white transition-colors" style={{ color:'var(--color-primary)' }}>
            আমাদের ওয়েবসাইট
          </a></p>
        </div>
      </div>
    </footer>
  );
}
