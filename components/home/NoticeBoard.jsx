'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFilePdf, FaBell, FaExternalLinkAlt, FaGoogleDrive } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { noticesAPI } from '../../lib/api';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    noticesAPI.getAll({ limit: 8 })
      .then(r => setNotices(r.data || []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const catColors = {
    academic:'bg-blue-100 text-blue-700',
    admission:'bg-green-100 text-green-700',
    exam:'bg-orange-100 text-orange-700',
    urgent:'bg-red-100 text-red-700',
    result:'bg-purple-100 text-purple-700',
    general:'bg-gray-100 text-gray-700',
  };

  return (
    <div className="card overflow-hidden">
      <div className="section-title bg-primary">
        <FaBell className="text-yellow-300" size={16}/>
        <span>নোটিশ বোর্ড</span>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          [...Array(6)].map((_,i)=>(
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"/>
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-gray-200 animate-pulse rounded w-4/5"/>
                <div className="h-2.5 bg-gray-100 animate-pulse rounded w-1/3"/>
              </div>
            </div>
          ))
        ) : notices.length === 0 ? (
          <p className="p-6 text-center text-gray-400 text-sm">কোনো নোটিশ নেই</p>
        ) : (
          notices.map((notice, i) => (
            <motion.div key={notice._id}
              initial={{ opacity:0, x:-10 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:i*0.04 }}
              className="flex items-start gap-3 px-4 py-3 hover:bg-green-50 transition-colors group">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"/>
              <div className="flex-1 min-w-0">
                <Link href={`/notice/${notice._id}`}
                  className="text-sm font-medium text-gray-800 hover:text-primary transition-colors line-clamp-2 group-hover:text-primary">
                  {notice.titleBn || notice.title}
                </Link>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-400">
                    {format(new Date(notice.publishDate),'dd/MM/yyyy')}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${catColors[notice.category]||catColors.general}`}>
                    {notice.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {notice.isNewNotice && <span className="badge-new">নতুন</span>}
                {notice.isImportant && <span className="badge-important">জরুরি</span>}
                {notice.googleDriveLink && (
                  <a href={notice.googleDriveLink} target="_blank" rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors" title="Google Drive">
                    <FaGoogleDrive size={14}/>
                  </a>
                )}
                {notice.pdfFile?.url && !notice.googleDriveLink && (
                  <a href={notice.pdfFile.url} target="_blank" rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-600 transition-colors" title="PDF">
                    <FaFilePdf size={14}/>
                  </a>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-3 bg-gray-50 border-t text-center">
        <Link href="/notice" className="btn-primary text-sm inline-flex items-center gap-2 py-1.5">
          আরো দেখুন <FaExternalLinkAlt size={11}/>
        </Link>
      </div>
    </div>
  );
}
