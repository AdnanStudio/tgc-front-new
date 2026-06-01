'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaLink } from 'react-icons/fa';
import { quickLinkAPI } from '../../lib/api';

export default function QuickLinks() {
  const [links,  setLinks]  = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    quickLinkAPI.getAll({ section:'important' })
      .then(r => setLinks(r.data || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div className="card overflow-hidden">
      <div className="section-title">
        <FaLink size={13}/>
        <span>Important Links</span>
      </div>
      <ul className="divide-y divide-gray-100">
        {!loaded ? (
          [...Array(6)].map((_,i) => (
            <li key={i} className="px-4 py-2.5 flex items-center gap-3">
              <div className="w-3 h-3 skeleton rounded-full flex-shrink-0"/>
              <div className="skeleton-text w-36 h-3 flex-1"/>
            </li>
          ))
        ) : links.length === 0 ? (
          <li className="px-4 py-3 text-xs text-gray-400">কোনো লিংক নেই</li>
        ) : (
          links.map(l => (
            <li key={l._id}>
              {l.isExternal ? (
                <a href={l.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group">
                  <span className="flex-shrink-0 text-xs" style={{ color:'var(--color-primary)' }}>›</span>
                  <span className="text-sm text-gray-700 group-hover:text-inherit truncate"
                    style={{ '--hover-color':'var(--color-primary)' }}>{l.labelBn || l.label}</span>
                </a>
              ) : (
                <Link href={l.url}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group">
                  <span className="flex-shrink-0 text-xs" style={{ color:'var(--color-primary)' }}>›</span>
                  <span className="text-sm text-gray-700 group-hover:text-inherit truncate">{l.labelBn || l.label}</span>
                </Link>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
