'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBullhorn } from 'react-icons/fa';
import { scrollingAPI, settingsAPI } from '../../lib/api';

export default function ScrollingNotice() {
  const [text,   setText]   = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    Promise.allSettled([scrollingAPI.getAll(), settingsAPI.get()])
      .then(([scRes, sRes]) => {
        const setting = sRes.status === 'fulfilled' ? sRes.value.data : null;
        if (setting?.isScrollingActive === false) { setActive(false); return; }
        setActive(true);
        if (scRes.status === 'fulfilled' && scRes.value.data?.length > 0) {
          setText(scRes.value.data.map(t => t.text).join('   ✦   '));
        } else if (setting?.scrollingNotice) {
          setText(setting.scrollingNotice);
        }
      });
  }, []);

  if (!text || !active) return null;

  return (
    <></>
  );
}
