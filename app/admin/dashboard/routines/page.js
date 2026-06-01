'use client';
import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaFilePdf, FaGoogleDrive, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { routinesAPI } from '../../../../lib/api';

const TYPES = [
  { value:'class', label:'ক্লাস রুটিন' },
  { value:'exam',  label:'পরীক্ষার রুটিন' },
  { value:'hsc',   label:'HSC রুটিন' },
  { value:'ssc',   label:'SSC রুটিন' },
  { value:'other', label:'অন্যান্য' },
];

const INIT = { title:'', titleBn:'', type:'class', session:'', googleDriveLink:'', googleDriveFileName:'' };

export default function AdminRoutines() {
  const [routines,   setRoutines]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(INIT);
  const [fileMode,   setFileMode]   = useState('drive');
  const [pdfFile,    setPdfFile]    = useState(null);
  const [saving,     setSaving]     = useState(false);
  const fileRef = useRef();

  const fetch = async () => {
    setLoading(true);
    try { const r = await routinesAPI.getAll(); setRoutines(r.data || []); }
    catch { toast.error('লোড ব্যর্থ'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(INIT); setPdfFile(null); setFileMode('drive'); setModal(true); };
  const openEdit = r => {
    setEditing(r._id);
    setForm({ title:r.title||'', titleBn:r.titleBn||'', type:r.type, session:r.session||'', googleDriveLink:r.googleDriveLink||'', googleDriveFileName:r.googleDriveFileName||'' });
    setFileMode(r.googleDriveLink ? 'drive' : 'upload');
    setPdfFile(null);
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.titleBn && !form.title) return toast.error('রুটিনের শিরোনাম দিন');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (fileMode === 'upload' && pdfFile) fd.append('pdfFile', pdfFile);
      if (editing) { await routinesAPI.update(editing, fd); toast.success('আপডেট হয়েছে ✅'); }
      else         { await routinesAPI.create(fd);          toast.success('যোগ হয়েছে ✅'); }
      setModal(false); fetch();
    } catch (e) { toast.error(e.message || 'সংরক্ষণ ব্যর্থ'); }
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!confirm('মুছে ফেলতে চান?')) return;
    try { await routinesAPI.delete(id); toast.success('মুছে গেছে'); fetch(); }
    catch { toast.error('মুছতে ব্যর্থ'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-700">রুটিন ব্যবস্থাপনা</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus size={12}/> নতুন রুটিন
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><div className="spinner"/></div> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr>
                <th>#</th><th>শিরোনাম</th>
                <th className="hidden md:table-cell">ধরন</th>
                <th className="hidden md:table-cell">সেশন</th>
                <th className="hidden md:table-cell">ফাইল</th>
                <th className="w-20 text-center">কার্যক্রম</th>
              </tr></thead>
              <tbody>
                {routines.length === 0
                  ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">কোনো রুটিন নেই</td></tr>
                  : routines.map((r,i) => (
                  <tr key={r._id}>
                    <td className="text-gray-500">{i+1}</td>
                    <td className="font-medium text-sm">{r.titleBn || r.title}</td>
                    <td className="hidden md:table-cell">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {TYPES.find(t=>t.value===r.type)?.label||r.type}
                      </span>
                    </td>
                    <td className="hidden md:table-cell text-sm text-gray-500">{r.session||'—'}</td>
                    <td className="hidden md:table-cell">
                      {r.googleDriveLink
                        ? <span className="text-blue-500 flex items-center gap-1 text-xs"><FaGoogleDrive size={12}/> Drive</span>
                        : r.pdfFile?.url
                          ? <span className="text-red-500 flex items-center gap-1 text-xs"><FaFilePdf size={12}/> PDF</span>
                          : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button onClick={()=>openEdit(r)} className="text-blue-600 p-1"><FaEdit size={13}/></button>
                        <button onClick={()=>handleDelete(r._id)} className="text-red-500 p-1"><FaTrash size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
              <h3 className="font-bold text-gray-700">{editing?'রুটিন সম্পাদনা':'নতুন রুটিন'}</h3>
              <button onClick={()=>setModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">বাংলা শিরোনাম *</label>
                <input value={form.titleBn} onChange={e=>setForm({...form,titleBn:e.target.value})} className="input" placeholder="রুটিনের বাংলা শিরোনাম"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">ধরন</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="input">
                    {TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">সেশন</label>
                  <input value={form.session} onChange={e=>setForm({...form,session:e.target.value})} className="input" placeholder="২০২৫-২৬"/>
                </div>
              </div>

              {/* File tabs */}
              <div className="border rounded-xl overflow-hidden">
                <div className="flex border-b">
                  <button type="button" onClick={()=>setFileMode('drive')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${fileMode==='drive'?'bg-blue-50 text-blue-600 border-b-2 border-blue-500':'text-gray-500 hover:bg-gray-50'}`}>
                    <FaGoogleDrive size={13}/> Google Drive
                  </button>
                  <button type="button" onClick={()=>setFileMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${fileMode==='upload'?'bg-red-50 text-red-600 border-b-2 border-red-500':'text-gray-500 hover:bg-gray-50'}`}>
                    <FaFilePdf size={13}/> PDF Upload
                  </button>
                </div>
                <div className="p-4">
                  {fileMode === 'drive' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="label">Google Drive লিংক</label>
                        <div className="relative">
                          <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12}/>
                          <input value={form.googleDriveLink} onChange={e=>setForm({...form,googleDriveLink:e.target.value})}
                            className="input pl-9" placeholder="https://drive.google.com/file/d/..."/>
                        </div>
                      </div>
                      <div>
                        <label className="label">ফাইলের নাম (ঐচ্ছিক)</label>
                        <input value={form.googleDriveFileName} onChange={e=>setForm({...form,googleDriveFileName:e.target.value})}
                          className="input" placeholder="HSC রুটিন ২০২৬.pdf"/>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="label">PDF ফাইল আপলোড</label>
                      <input type="file" accept=".pdf" ref={fileRef} onChange={e=>setPdfFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"/>
                      {pdfFile && <p className="text-xs text-green-600 mt-1">✅ {pdfFile.name}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end p-5 border-t">
              <button onClick={()=>setModal(false)} className="btn-outline text-sm">বাতিল</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving?<><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> সংরক্ষণ...</>:<><FaSave size={12}/> সংরক্ষণ</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
