'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Link from 'next/link';
import { FaFilePdf, FaArrowLeft, FaCalendarAlt, FaTag, FaGoogleDrive, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { noticesAPI } from '../../../lib/api';

// Google Drive link → direct download link বানাও
function getDriveDownloadUrl(url) {
  if (!url) return url;
  // https://drive.google.com/file/d/FILE_ID/view → https://drive.google.com/uc?export=download&id=FILE_ID
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  // https://drive.google.com/open?id=FILE_ID
  const match2 = url.match(/[?&]id=([^&]+)/);
  if (match2) return `https://drive.google.com/uc?export=download&id=${match2[1]}`;
  return url;
}

function getDriveViewUrl(url) {
  if (!url) return url;
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
}

export default function NoticeDetail() {
  const { id } = useParams();
  const router  = useRouter();
  const [notice,  setNotice]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    noticesAPI.getById(id)
      .then(r => setNotice(r.data))
      .catch(()=>router.push('/notice'))
      .finally(()=>setLoading(false));
  }, [id]);

  const hasDrive = notice?.googleDriveLink;
  const hasPdf   = notice?.pdfFile?.url;

  return (
    <>
      <Navbar/>
      <div className="page-header py-8">
        <h1 className="text-2xl font-bold">নোটিশ বিবরণ</h1>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/notice" className="inline-flex items-center gap-2 text-primary hover:underline text-sm mb-6">
          <FaArrowLeft size={12}/> সকল নোটিশে ফিরুন
        </Link>

        {loading
          ? <div className="flex justify-center py-16"><div className="spinner"/></div>
          : notice ? (
          <div className="card p-6 md:p-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {notice.isNewNotice && <span className="badge-new">নতুন</span>}
              {notice.isImportant && <span className="badge-important">জরুরি</span>}
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize flex items-center gap-1">
                <FaTag size={9}/> {notice.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 leading-snug mb-2">
              {notice.titleBn || notice.title}
            </h1>
            {notice.titleBn && notice.title && (
              <h2 className="text-lg text-gray-500 mb-4">{notice.title}</h2>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b pb-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-primary" size={13}/>
                {format(new Date(notice.publishDate),'dd MMMM yyyy')}
              </span>
              <span className="text-gray-300">|</span>
              <span>{notice.views||0} বার দেখা হয়েছে</span>
            </div>

            {/* Content */}
            {notice.content && (
              <div className="mb-6">
                {notice.content.split('\n').map((line,i)=>(
                  <p key={i} className="text-gray-700 text-sm leading-relaxed mb-2">{line}</p>
                ))}
              </div>
            )}

            {/* ── Google Drive Section ── */}
            {hasDrive && (
              <div className="mt-6 rounded-xl overflow-hidden border border-blue-200">
                <div className="bg-blue-600 text-white px-5 py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <FaGoogleDrive size={18}/>
                    <div>
                      <p className="font-semibold text-sm">সংযুক্ত ফাইল (Google Drive)</p>
                      {notice.googleDriveFileName && (
                        <p className="text-xs text-blue-200">{notice.googleDriveFileName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={()=>setShowPreview(!showPreview)}
                      className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors">
                      <FaExternalLinkAlt size={11}/> {showPreview?'Preview বন্ধ':'Preview দেখুন'}
                    </button>
                    <a href={getDriveDownloadUrl(notice.googleDriveLink)}
                      target="_blank" rel="noopener noreferrer"
                      className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <FaDownload size={11}/> ডাউনলোড করুন
                    </a>
                    <a href={notice.googleDriveLink}
                      target="_blank" rel="noopener noreferrer"
                      className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors">
                      <FaGoogleDrive size={11}/> Drive-এ খুলুন
                    </a>
                  </div>
                </div>

                {/* PDF Preview iframe */}
                {showPreview && (
                  <div className="bg-gray-50 border-t border-blue-200">
                    <iframe
                      src={getDriveViewUrl(notice.googleDriveLink)}
                      width="100%"
                      height="500"
                      className="block"
                      title="Document Preview"
                      allow="autoplay"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── PDF Upload Section ── */}
            {hasPdf && !hasDrive && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 text-white p-3 rounded-lg"><FaFilePdf size={22}/></div>
                  <div>
                    <p className="font-medium text-sm text-gray-700">সংযুক্ত PDF ফাইল</p>
                    <p className="text-xs text-gray-500">{notice.pdfFile.originalName||'notice.pdf'}</p>
                  </div>
                </div>
                <a href={notice.pdfFile.url} target="_blank" rel="noopener noreferrer"
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-2">
                  <FaDownload size={13}/> PDF দেখুন / ডাউনলোড
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">নোটিশটি পাওয়া যায়নি।</p>
            <Link href="/notice" className="btn-primary mt-4 inline-block text-sm">নোটিশ বোর্ডে যান</Link>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
