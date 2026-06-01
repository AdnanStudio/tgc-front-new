'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaFilePdf, FaGoogleDrive, FaDownload, FaCheckCircle, FaAward } from 'react-icons/fa';
import { format } from 'date-fns';
import { approvalsAPI } from '../../lib/api';

const typeLabels = { recognition:'স্বীকৃতি', approval:'অনুমোদন', affiliation:'অধিভুক্তি', other:'অন্যান্য' };
const typeColors = { recognition:'bg-green-100 text-green-700', approval:'bg-blue-100 text-blue-700', affiliation:'bg-purple-100 text-purple-700', other:'bg-gray-100 text-gray-600' };

function getDriveDownloadUrl(url) {
  if (!url) return url;
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  return url;
}

export default function ApprovalsPage() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    approvalsAPI.getAll()
      .then(r => setItems(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar/>
      <div className="page-header">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FaAward className="text-yellow-300" size={28}/>
          <h1 className="text-3xl font-bold">পাঠদানের অনুমতি ও স্বীকৃতি</h1>
        </div>
        <p className="text-green-200">কলেজের সরকারি অনুমোদন ও স্বীকৃতির তথ্য</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-start gap-4">
          <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
            <FaCheckCircle className="text-green-600" size={24}/>
          </div>
          <div>
            <h3 className="font-bold text-green-800 mb-1">সরকারি স্বীকৃতিপ্রাপ্ত প্রতিষ্ঠান</h3>
            <p className="text-sm text-green-700">মাদরাসাতু দারিল কুরআন একটি উচ্চ মাধ্যমিক শিক্ষা প্রতিষ্ঠান।</p>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_,i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"/>
                <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2"/>
                <div className="h-8 bg-gray-100 animate-pulse rounded"/>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card p-10 text-center text-gray-400">
            <FaAward size={48} className="mx-auto mb-3 text-gray-200"/>
            <p className="text-sm">কোনো অনুমোদন তথ্য পাওয়া যায়নি</p>
            <p className="text-xs text-gray-300 mt-1">Admin panel থেকে অনুমোদন যোগ করুন</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item._id} className="card p-5 hover:-translate-y-1 transition-transform">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaAward className="text-primary" size={18}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{item.titleBn || item.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded ${typeColors[item.type] || typeColors.other}`}>
                        {typeLabels[item.type] || item.type}
                      </span>
                      {item.issueDate && (
                        <span className="text-xs text-gray-400">{format(new Date(item.issueDate), 'dd/MM/yyyy')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {item.issuedBy && (
                  <p className="text-xs text-gray-500 mb-2">
                    <span className="font-medium">প্রদানকারী:</span> {item.issuedBy}
                  </p>
                )}
                {item.description && (
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{item.description}</p>
                )}

                <div className="flex gap-2 flex-wrap">
                  {item.googleDriveLink && (
                    <>
                      <a href={item.googleDriveLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700 transition-colors">
                        <FaGoogleDrive size={11}/> দেখুন
                      </a>
                      <a href={getDriveDownloadUrl(item.googleDriveLink)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 border border-blue-300 text-blue-600 px-3 py-1.5 rounded-lg text-xs hover:bg-blue-50 transition-colors">
                        <FaDownload size={11}/> ডাউনলোড
                      </a>
                    </>
                  )}
                  {item.pdfFile?.url && !item.googleDriveLink && (
                    <a href={item.pdfFile.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600 transition-colors">
                      <FaFilePdf size={11}/> PDF দেখুন
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
