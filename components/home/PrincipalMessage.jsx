'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaQuoteLeft, FaUserTie } from 'react-icons/fa';
import { settingsAPI } from '../../lib/api';

export default function PrincipalMessage({ type = 'principal' }) {
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    settingsAPI.get()
      .then(r => setSettings(r.data))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const isPrincipal  = type === 'principal';
  const name         = isPrincipal ? (settings?.principalNameBn  || settings?.principalName)  : (settings?.chairmanNameBn  || settings?.chairmanName);
  const designation  = isPrincipal ?  settings?.principalDesignation  :  settings?.chairmanDesignation;
  const message      = isPrincipal ?  settings?.principalMessage      :  settings?.chairmanMessage;
  const photo        = isPrincipal ?  settings?.principalPhoto?.url   :  settings?.chairmanPhoto?.url;
  const sectionTitle = isPrincipal ? 'সভাপতির বাণী' : 'অধ্যক্ষের বাণী';
  const bgColor      = isPrincipal ? 'bg-primary'   : 'bg-secondary';

  if (loading) {
    return (
      <div className="card overflow-hidden animate-pulse">
        <div className={`${bgColor} h-10`}/>
        <div className="p-4 flex flex-col items-center gap-3">
          <div className="w-28 h-32 bg-gray-200 rounded"/>
          <div className="h-4 bg-gray-200 rounded w-2/3"/>
          <div className="h-3 bg-gray-100 rounded w-1/2"/>
        </div>
      </div>
    );
  }

  if (!name && !photo) return null;

  return (
    <div className="card overflow-hidden">
      <div className={`section-title ${bgColor}`}>{sectionTitle}</div>
      <div className="p-4 flex flex-col items-center text-center">
        <div className="relative w-28 h-32 mb-3 rounded overflow-hidden border-2 border-gray-200 bg-gray-100">
          {photo ? (
            <Image src={photo} alt={name||'Photo'} fill className="object-cover" sizes="112px"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaUserTie className="text-gray-300" size={40}/>
            </div>
          )}
        </div>

        {name && <h3 className="font-bold text-gray-800 text-sm leading-tight">{name}</h3>}
        {designation && <p className="text-xs text-gray-500 mt-0.5 mb-3">{designation}</p>}

        {message && (
          <div className="relative text-left bg-gray-50 rounded-lg p-3 w-full">
            <FaQuoteLeft className="text-gray-200 absolute -top-1 -left-1" size={20}/>
            <p className="text-xs text-gray-600 leading-relaxed pl-4 line-clamp-5">{message}</p>
          </div>
        )}

        <Link href={`/about#${type}`}
          className="mt-3 text-xs text-primary hover:underline font-medium inline-flex items-center gap-1">
          View Details →
        </Link>
      </div>
    </div>
  );
}
