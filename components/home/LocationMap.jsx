'use client';
import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import { settingsAPI } from '../../lib/api';

export default function LocationMap() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsAPI.get().then(r=>setSettings(r.data)).catch(()=>{});
  }, []);

  const defaultEmbed = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.3!2d90.5!3d23.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDM2JzAwLjAiTiA5MMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890`;

  return (
    <section className="my-6">
      <div className="card overflow-hidden">
        <div className="section-title bg-primary">
          <FaMapMarkerAlt className="text-yellow-300" size={16}/>
          <span>আমাদের অবস্থান — Our Location</span>
        </div>
        <div className="relative">
          <iframe
            src={settings?.googleMapEmbed || defaultEmbed}
            width="100%" height="300"
            style={{ border:0, display:'block' }}
            allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="College Location"
          />
        </div>
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-between items-start">
            <div className="space-y-1.5">
              {settings?.address && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary flex-shrink-0" size={13}/>
                  <span>{settings.address}</span>
                </div>
              )}
              {settings?.phone?.[0] && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-primary flex-shrink-0" size={12}/>
                  <a href={`tel:${settings.phone[0]}`} className="hover:text-primary transition-colors">
                    {settings.phone[0]}
                  </a>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-primary flex-shrink-0" size={12}/>
                  <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>
            {settings?.googleMapEmbed && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Malkhanagar College')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline text-xs font-medium">
                <FaExternalLinkAlt size={10}/> Google Maps-এ দেখুন
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
