'use client';
import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFilePdf, FaTimes, FaSave, FaGoogleDrive, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { noticesAPI } from '../../../../lib/api';

const INIT = {
  titleBn: '', title: '', content: '', category: 'general',
  isScrolling: false, isImportant: false, isNew: true, isActive: true,
  googleDriveLink: '', googleDriveFileName: '',
};
const CATEGORIES = ['general','academic','admission','exam','result','urgent'];

export default function AdminNotices() {
  const [notices,    setNotices]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(INIT);
  const [pdfFile,    setPdfFile]    = useState(null);
  const [fileMode,   setFileMode]   = useState('drive'); // 'drive' | 'upload'
  const [saving,     setSaving]     = useState(false);
  const [page,       setPage]       = useState(1);
  const [pagination, setPagination] = useState({});
  const fileRef = useRef();

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticesAPI.getAll({ page, limit: 15 });
      setNotices(res.data || []);
      setPagination(res.pagination || {});
    } catch { toast.error('নোটিশ লোড হয়নি'); }
    setLoading(false);
  };
  useEffect(() => { fetchNotices(); }, [page]);

  const openCreate = () => {
    setEditing(null); setForm(INIT); setPdfFile(null); setFileMode('drive'); setModal(true);
  };
  const openEdit = (n) => {
    setEditing(n._id);
    setForm({
      titleBn: n.titleBn || '', title: n.title || '', content: n.content || '',
      category: n.category, isScrolling: n.isScrolling, isImportant: n.isImportant,
      isNew: n.isNewNotice, isActive: n.isActive,
      googleDriveLink: n.googleDriveLink || '',
      googleDriveFileName: n.googleDriveFileName || '',
    });
    setPdfFile(null);
    setFileMode(n.googleDriveLink ? 'drive' : 'upload');
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.titleBn && !form.title) return toast.error('নোটিশের শিরোনাম দিন');
    if (fileMode === 'drive' && form.googleDriveLink) {
      // Google Drive link validation
      const validDrive = form.googleDriveLink.includes('drive.google.com') ||
                         form.googleDriveLink.startsWith('http');
      if (!validDrive) return toast.error('সঠিক Google Drive লিংক দিন');
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (fileMode === 'upload' && pdfFile) fd.append('pdfFile', pdfFile);
      // Drive mode হলে pdfFile পাঠাবো না
      if (fileMode === 'drive') { fd.set('googleDriveLink', form.googleDriveLink); fd.set('googleDriveFileName', form.googleDriveFileName); }
      if (editing) { await noticesAPI.update(editing, fd); toast.success('নোটিশ আপডেট হয়েছে ✅'); }
      else         { await noticesAPI.create(fd);          toast.success('নোটিশ যোগ হয়েছে ✅'); }
      setModal(false);
      fetchNotices();
    } catch (e) { toast.error(e.message || 'সংরক্ষণ ব্যর্থ'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('এই নোটিশটি মুছে ফেলতে চান?')) return;
    try { await noticesAPI.delete(id); toast.success('মুছে গেছে'); fetchNotices(); }
    catch { toast.error('মুছতে ব্যর্থ'); }
  };

  const catColors = { academic:'bg-blue-100 text-blue-700', admission:'bg-green-100 text-green-700', exam:'bg-orange-100 text-orange-700', urgent:'bg-red-100 text-red-700', result:'bg-purple-100 text-purple-700', general:'bg-gray-100 text-gray-700' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-700">নোটিশ ব্যবস্থাপনা</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus size={12}/> নতুন নোটিশ
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><div className="spinner"/></div> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr>
                <th>#</th><th>শিরোনাম</th>
                <th className="hidden md:table-cell">বিভাগ</th>
                <th className="hidden md:table-cell">তারিখ</th>
                <th className="hidden md:table-cell">ফাইল</th>
                <th className="w-24 text-center">কার্যক্রম</th>
              </tr></thead>
              <tbody>
                {notices.length === 0
                  ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">কোনো নোটিশ নেই</td></tr>
                  : notices.map((n, i) => (
                  <tr key={n._id}>
                    <td className="text-gray-500">{(page-1)*15+i+1}</td>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm">{n.titleBn || n.title}</span>
                        <div className="flex gap-1 flex-wrap">
                          {n.isNewNotice  && <span className="badge-new text-xs">নতুন</span>}
                          {n.isImportant  && <span className="badge-important text-xs">জরুরি</span>}
                          {n.isScrolling  && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 rounded">স্ক্রল</span>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell"><span className={`text-xs px-2 py-0.5 rounded ${catColors[n.category]||catColors.general}`}>{n.category}</span></td>
                    <td className="hidden md:table-cell text-xs text-gray-500">{format(new Date(n.publishDate),'dd/MM/yyyy')}</td>
                    <td className="hidden md:table-cell">
                      {n.googleDriveLink
                        ? <span className="flex items-center gap-1 text-blue-600 text-xs"><FaGoogleDrive size={12}/> Drive</span>
                        : n.pdfFile?.url
                          ? <span className="flex items-center gap-1 text-red-500 text-xs"><FaFilePdf size={12}/> PDF</span>
                          : <span className="text-gray-300 text-xs">—</span>
                      }
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEdit(n)} className="text-blue-600 hover:text-blue-700 p-1"><FaEdit size={14}/></button>
                        <button onClick={() => handleDelete(n._id)} className="text-red-500 hover:text-red-600 p-1"><FaTrash size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({length:pagination.pages}).map((_,i)=>(
            <button key={i} onClick={()=>setPage(i+1)}
              className={`w-9 h-9 rounded text-sm ${page===i+1?'bg-primary text-white':'bg-white border hover:bg-primary/10'}`}>{i+1}</button>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-700">{editing?'নোটিশ সম্পাদনা':'নতুন নোটিশ'}</h3>
              <button onClick={()=>setModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">বাংলা শিরোনাম *</label>
                <input value={form.titleBn} onChange={e=>setForm({...form,titleBn:e.target.value})} className="input" placeholder="নোটিশের বাংলা শিরোনাম লিখুন"/>
              </div>
              <div>
                <label className="label">English Title (ঐচ্ছিক)</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="input" placeholder="Notice title in English"/>
              </div>
              <div>
                <label className="label">বিবরণ (ঐচ্ছিক)</label>
                <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} className="input resize-none" rows={3} placeholder="নোটিশের বিস্তারিত..."/>
              </div>
              <div>
                <label className="label">বিভাগ</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input">
                  {CATEGORIES.map(c=><option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div className="flex gap-4 flex-wrap">
                {[{key:'isNew',label:'নতুন ট্যাগ'},{key:'isImportant',label:'জরুরি'},{key:'isScrolling',label:'স্ক্রলিং বার'},{key:'isActive',label:'সক্রিয়'}].map(({key,label})=>(
                  <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={!!form[key]} onChange={e=>setForm({...form,[key]:e.target.checked})} className="rounded text-primary"/>
                    {label}
                  </label>
                ))}
              </div>

              {/* ── File Section ── */}
              <div className="border rounded-xl overflow-hidden">
                {/* Tab buttons */}
                <div className="flex border-b">
                  <button type="button" onClick={()=>setFileMode('drive')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${fileMode==='drive'?'bg-blue-50 text-blue-600 border-b-2 border-blue-500':'text-gray-500 hover:bg-gray-50'}`}>
                    <FaGoogleDrive size={14}/> Google Drive লিংক
                  </button>
                  <button type="button" onClick={()=>setFileMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${fileMode==='upload'?'bg-red-50 text-red-600 border-b-2 border-red-500':'text-gray-500 hover:bg-gray-50'}`}>
                    <FaFilePdf size={14}/> PDF Upload
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {fileMode === 'drive' ? (
                    <>
                      <div>
                        <label className="label">Google Drive ফাইলের লিংক</label>
                        <div className="relative">
                          <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13}/>
                          <input value={form.googleDriveLink} onChange={e=>setForm({...form,googleDriveLink:e.target.value})}
                            className="input pl-9" placeholder="https://drive.google.com/file/d/xxxxx/view"/>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          💡 Google Drive → ফাইল → Share → Copy link → এখানে paste করুন
                        </p>
                      </div>
                      <div>
                        <label className="label">ফাইলের নাম (ঐচ্ছিক)</label>
                        <input value={form.googleDriveFileName} onChange={e=>setForm({...form,googleDriveFileName:e.target.value})}
                          className="input" placeholder="যেমন: ভর্তি বিজ্ঞপ্তি ২০২৬.pdf"/>
                      </div>
                      {form.googleDriveLink && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                          <FaGoogleDrive className="text-blue-600" size={16}/>
                          <a href={form.googleDriveLink} target="_blank" rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline truncate">
                            {form.googleDriveFileName || 'লিংক preview করুন'}
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="label">PDF ফাইল আপলোড</label>
                        <input type="file" accept=".pdf" ref={fileRef} onChange={e=>setPdfFile(e.target.files[0])}
                          className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"/>
                        {pdfFile && <p className="text-xs text-green-600 mt-1">✅ {pdfFile.name}</p>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end p-5 border-t">
              <button onClick={()=>setModal(false)} className="btn-outline text-sm">বাতিল</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> সংরক্ষণ...</> : <><FaSave size={13}/> সংরক্ষণ</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
