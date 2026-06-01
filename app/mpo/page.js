'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaAddressCard, FaFilePdf, FaGoogleDrive, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { settingsAPI, mpoAPI } from '../../lib/api';
import { format } from 'date-fns';

export default function MpoPage() {
  const [mpoInfo,  setMpoInfo]  = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.allSettled([mpoAPI.get(), settingsAPI.get()])
      .then(([m, s]) => {
        if (m.status === 'fulfilled') setMpoInfo(m.value.data);
        if (s.status === 'fulfilled') setSettings(s.value.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    active:   { label:'সক্রিয়',        color:'bg-green-100 text-green-700',  icon:'✅' },
    inactive: { label:'নিষ্ক্রিয়',     color:'bg-red-100 text-red-700',      icon:'❌' },
    pending:  { label:'প্রক্রিয়াধীন', color:'bg-yellow-100 text-yellow-700', icon:'⏳' },
  };

  function getDriveDownloadUrl(url) {
    if (!url) return url;
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    return url;
  }

  return (
    <>
      <Navbar/>
      <div className="page-header">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FaAddressCard className="text-yellow-300" size={28}/>
          <h1 className="text-3xl font-bold">MPO তথ্য</h1>
        </div>
        <p className="text-green-200">মাসিক পে-অর্ডার (MPO) সংক্রান্ত তথ্য</p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {loading ? (
          <div className="card p-8 space-y-4">
            {[...Array(4)].map((_,i) => (
              <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-lg"/>
            ))}
          </div>
        ) : (
          <>
            <div className="card overflow-hidden mb-6">
              <div className="section-title bg-primary">
                <FaAddressCard size={14}/> MPO তথ্য
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                      <span className="text-sm font-medium text-gray-600">MPO নম্বর</span>
                      <span className="font-bold text-primary text-lg">
                        {mpoInfo?.mpoNumber || settings?.mpoNumber || 'N/A'}
                      </span>
                    </div>
                    {mpoInfo?.mpoDate && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                        <span className="text-sm font-medium text-gray-600">MPO তারিখ</span>
                        <span className="font-semibold text-gray-700">
                          {format(new Date(mpoInfo.mpoDate), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                      <span className="text-sm font-medium text-gray-600">MPO স্ট্যাটাস</span>
                      {(() => {
                        const st  = mpoInfo?.mpoStatus || 'active';
                        const cfg = statusConfig[st] || statusConfig.active;
                        return (
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${cfg.color}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                    <h3 className="font-bold text-primary mb-3 text-sm flex items-center gap-2">
                      <FaCheckCircle size={14}/> MPO সুবিধাসমূহ
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {['সরকারি বেতন ভাতা','উৎসব বোনাস','চিকিৎসা ভাতা','পেনশন সুবিধা','বৈশাখী ভাতা'].map(item => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="text-green-500 flex-shrink-0">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {mpoInfo?.description && (
                  <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-gray-700 leading-relaxed">{mpoInfo.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* MPO Documents */}
            {mpoInfo?.documents?.length > 0 && (
              <div className="card overflow-hidden">
                <div className="section-title bg-secondary">
                  <FaFilePdf size={14}/> MPO ডকুমেন্টসমূহ
                </div>
                <div className="divide-y">
                  {mpoInfo.documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaFilePdf className="text-red-500" size={18}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800">{doc.title || 'MPO Document'}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {doc.googleDriveLink && (
                          <>
                            <a href={doc.googleDriveLink} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700 transition-colors">
                              <FaGoogleDrive size={11}/> দেখুন
                            </a>
                            <a href={getDriveDownloadUrl(doc.googleDriveLink)} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 border border-blue-300 text-blue-600 px-3 py-1.5 rounded-lg text-xs hover:bg-blue-50 transition-colors">
                              <FaDownload size={11}/> ডাউনলোড
                            </a>
                          </>
                        )}
                        {doc.pdfFile?.url && !doc.googleDriveLink && (
                          <a href={doc.pdfFile.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600 transition-colors">
                            <FaDownload size={11}/> ডাউনলোড
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!mpoInfo && (
              <div className="card p-10 text-center text-gray-400">
                <FaAddressCard size={48} className="mx-auto mb-3 text-gray-200"/>
                <p className="text-sm">MPO তথ্য পাওয়া যায়নি</p>
                <p className="text-xs text-gray-300 mt-1">Admin panel থেকে MPO তথ্য যোগ করুন</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer/>
    </>
  );
}
