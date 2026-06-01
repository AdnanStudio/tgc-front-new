'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Link from 'next/link';
import { FaFilePdf, FaGoogleDrive, FaSearch, FaFilter, FaBell } from 'react-icons/fa';
import { format } from 'date-fns';
import { noticesAPI } from '../../lib/api';

const CATEGORIES = [
  { value:'',          label:'সকল বিভাগ' },
  { value:'academic',  label:'একাডেমিক' },
  { value:'admission', label:'ভর্তি' },
  { value:'exam',      label:'পরীক্ষা' },
  { value:'result',    label:'ফলাফল' },
  { value:'urgent',    label:'জরুরি' },
  { value:'general',   label:'সাধারণ' },
];

const catColors = {
  academic:'bg-blue-100 text-blue-700', admission:'bg-green-100 text-green-700',
  exam:'bg-orange-100 text-orange-700', urgent:'bg-red-100 text-red-700',
  result:'bg-purple-100 text-purple-700', general:'bg-gray-100 text-gray-600',
};

export default function NoticePage() {
  const [notices,    setNotices]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [pagination, setPagination] = useState({});
  const [category,   setCategory]   = useState('');
  const [search,     setSearch]     = useState('');

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticesAPI.getAll({ page, limit:15, category });
      setNotices(res.data || []);
      setPagination(res.pagination || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, [page, category]);

  const filtered = search
    ? notices.filter(n => (n.titleBn||n.title||'').toLowerCase().includes(search.toLowerCase()))
    : notices;

  return (
    <>
      <Navbar/>
      <div className="page-header">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FaBell className="text-yellow-300" size={28}/>
          <h1 className="text-3xl font-bold">নোটিশ বোর্ড</h1>
        </div>
        <p className="text-green-200">সকল সর্বশেষ নোটিশ ও বিজ্ঞপ্তি</p>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13}/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="নোটিশ খুঁজুন..."
              className="input pl-9 text-sm"/>
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" size={13}/>
            <select value={category} onChange={e=>{ setCategory(e.target.value); setPage(1); }}
              className="input text-sm w-auto">
              {CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="card overflow-hidden">
            {[...Array(8)].map((_,i)=>(
              <div key={i} className="flex items-center gap-4 px-4 py-3 border-b">
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"/>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 animate-pulse rounded w-3/4"/>
                  <div className="h-2.5 bg-gray-100 animate-pulse rounded w-1/4"/>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-10">#</th>
                  <th>নোটিশের শিরোনাম</th>
                  <th className="hidden md:table-cell w-28">বিভাগ</th>
                  <th className="hidden md:table-cell w-32">তারিখ</th>
                  <th className="w-20 text-center">ফাইল</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">কোনো নোটিশ পাওয়া যায়নি</td></tr>
                ) : filtered.map((notice, i) => (
                  <tr key={notice._id} className="hover:bg-green-50 transition-colors">
                    <td className="text-gray-500 text-sm">{(page-1)*15+i+1}</td>
                    <td>
                      <div className="flex items-start gap-2 flex-wrap">
                        <Link href={`/notice/${notice._id}`}
                          className="text-sm font-medium text-gray-800 hover:text-primary transition-colors">
                          {notice.titleBn || notice.title}
                        </Link>
                        <div className="flex gap-1 flex-wrap">
                          {notice.isNewNotice && <span className="badge-new">নতুন</span>}
                          {notice.isImportant && <span className="badge-important">জরুরি</span>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded ${catColors[notice.category]||catColors.general}`}>
                        {CATEGORIES.find(c=>c.value===notice.category)?.label||notice.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell text-xs text-gray-500">
                      {format(new Date(notice.publishDate),'dd MMM yyyy')}
                    </td>
                    <td className="text-center">
                      {notice.googleDriveLink ? (
                        <a href={notice.googleDriveLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium">
                          <FaGoogleDrive size={14}/>
                        </a>
                      ) : notice.pdfFile?.url ? (
                        <a href={notice.pdfFile.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-medium">
                          <FaFilePdf size={14}/>
                        </a>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
              className="px-3 py-2 rounded border text-sm disabled:opacity-40 hover:bg-primary/10">
              ← আগের
            </button>
            {Array.from({length:pagination.pages}).map((_,i)=>(
              <button key={i} onClick={()=>setPage(i+1)}
                className={`w-9 h-9 rounded text-sm transition-colors ${page===i+1?'bg-primary text-white':'bg-white border hover:bg-primary/10'}`}>
                {i+1}
              </button>
            ))}
            <button disabled={page===pagination.pages} onClick={()=>setPage(p=>p+1)}
              className="px-3 py-2 rounded border text-sm disabled:opacity-40 hover:bg-primary/10">
              পরের →
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
