'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Link from 'next/link';
import { FaFilePdf, FaGoogleDrive, FaDownload, FaClipboardList, FaTrophy } from 'react-icons/fa';
import { format } from 'date-fns';
import { routinesAPI } from '../../lib/api';

const typeLabels = { exam:'পরীক্ষার রুটিন', hsc:'HSC রুটিন', ssc:'SSC রুটিন', class:'ক্লাস রুটিন', other:'অন্যান্য' };

export default function ExamPage() {
  const [routines, setRoutines] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('all');

  useEffect(() => {
    routinesAPI.getAll()
      .then(r => setRoutines(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? routines : routines.filter(r => r.type === tab);

  return (
    <>
      <Navbar/>
      <div className="page-header">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FaClipboardList className="text-yellow-300" size={28}/>
          <h1 className="text-3xl font-bold">পরীক্ষা ও ফলাফল</h1>
        </div>
        <p className="text-green-200">পরীক্ষার রুটিন, সময়সূচী ও ফলাফল</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label:'পরীক্ষার রুটিন', icon:FaClipboardList, color:'bg-blue-600',   link:'#routine' },
            { label:'ফলাফল',          icon:FaTrophy,         color:'bg-green-600',  link:'#results' },
            { label:'পাশের হার',      icon:FaTrophy,         color:'bg-orange-600', link:'#passrate' },
            { label:'ডাউনলোড',        icon:FaDownload,       color:'bg-purple-600', link:'#download' },
          ].map(({ label, icon:Icon, color, link }) => (
            <a key={label} href={link}
              className={`${color} text-white rounded-xl p-4 text-center hover:opacity-90 transition-opacity cursor-pointer`}>
              <Icon className="mx-auto mb-2" size={24}/>
              <p className="text-sm font-medium">{label}</p>
            </a>
          ))}
        </div>

        {/* Routines section */}
        <div id="routine" className="card overflow-hidden mb-6">
          <div className="section-title bg-primary">
            <FaClipboardList size={14}/>
            <span>রুটিন ও সময়সূচী</span>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 p-3 bg-gray-50 border-b flex-wrap">
            {[{ value:'all', label:'সকল' }, { value:'exam', label:'পরীক্ষার রুটিন' }, { value:'hsc', label:'HSC' }, { value:'class', label:'ক্লাস রুটিন' }].map(t => (
              <button key={t.value} onClick={() => setTab(t.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${tab === t.value ? 'bg-primary text-white' : 'bg-white border hover:bg-primary/10'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_,i) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-lg"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 animate-pulse rounded w-2/3"/>
                    <div className="h-2.5 bg-gray-100 animate-pulse rounded w-1/3"/>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FaClipboardList size={36} className="mx-auto mb-3 text-gray-200"/>
              <p className="text-sm">কোনো রুটিন পাওয়া যায়নি</p>
              <p className="text-xs mt-1 text-gray-300">Admin panel থেকে রুটিন যোগ করুন</p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map(routine => (
                <div key={routine._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaClipboardList className="text-primary" size={16}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800">{routine.titleBn || routine.title}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {typeLabels[routine.type] || routine.type}
                      </span>
                      {routine.session && <span className="text-xs text-gray-400">{routine.session}</span>}
                      <span className="text-xs text-gray-400">
                        {format(new Date(routine.publishDate), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {routine.googleDriveLink && (
                      <a href={routine.googleDriveLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700 transition-colors">
                        <FaGoogleDrive size={12}/> দেখুন
                      </a>
                    )}
                    {routine.pdfFile?.url && (
                      <a href={routine.pdfFile.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600 transition-colors">
                        <FaFilePdf size={12}/> PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results info */}
        <div id="results" className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-primary mb-4 border-b pb-2 flex items-center gap-2">
            <FaTrophy size={18}/> পরীক্ষার ফলাফল
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="http://www.educationboardresults.gov.bd" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 border-2 border-primary/20 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FaTrophy className="text-primary" size={20}/>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-700">SSC / HSC ফলাফল</p>
                <p className="text-xs text-gray-500 mt-0.5">educationboardresults.gov.bd</p>
              </div>
            </a>
            <a href="http://www.nu.ac.bd/results" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FaTrophy className="text-blue-600" size={20}/>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-700">জাতীয় বিশ্ববিদ্যালয় ফলাফল</p>
                <p className="text-xs text-gray-500 mt-0.5">nu.ac.bd/results</p>
              </div>
            </a>
          </div>
        </div>

        {/* Pass rate stats */}
        <div id="passrate" className="card overflow-hidden">
          <div className="section-title bg-secondary">
            <FaTrophy size={14}/>
            <span>পাশের হার পরিসংখ্যান</span>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>সাল</th>
                  <th>পরীক্ষার্থী</th>
                  <th>উত্তীর্ণ</th>
                  <th>পাশের হার</th>
                  <th>A+ প্রাপ্ত</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { year:'২০২৫', total:'৩৫০', passed:'৩২০', rate:'৯১.৪%', aplus:'২৫' },
                  { year:'২০২৪', total:'৩২০', passed:'২৯৫', rate:'৯২.২%', aplus:'২২' },
                  { year:'২০২৩', total:'৩০০', passed:'২৭০', rate:'৯০.০%', aplus:'১৮' },
                ].map(row => (
                  <tr key={row.year}>
                    <td className="font-semibold text-primary">{row.year}</td>
                    <td className="text-center">{row.total}</td>
                    <td className="text-center text-green-600 font-medium">{row.passed}</td>
                    <td className="text-center font-bold text-primary">{row.rate}</td>
                    <td className="text-center text-yellow-600 font-medium">{row.aplus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-2">* তথ্য admin প্যানেল থেকে আপডেট করা যাবে</p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
