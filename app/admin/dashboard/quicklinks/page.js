'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaToggleOn, FaToggleOff, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { quickLinkAPI } from '../../../../lib/api';

const SECTIONS = [
  { value:'important', label:'গুরুত্বপূর্ণ লিংক (হোমপেজ সাইডবার)' },
  { value:'footer',    label:'ফুটার লিংক' },
  { value:'home',      label:'হোমপেজ মেনু গ্রিড' },
];
const INIT = { label:'', labelBn:'', url:'', section:'important', isExternal:true, isActive:true, order:0 };

export default function AdminQuickLinks() {
  const [links,   setLinks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(INIT);
  const [saving,  setSaving]  = useState(false);
  const [filter,  setFilter]  = useState('important');

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await quickLinkAPI.getAllAdmin();
      if (!r.data?.length) { await quickLinkAPI.seed(); const r2 = await quickLinkAPI.getAllAdmin(); setLinks(r2.data||[]); }
      else setLinks(r.data||[]);
    } catch { toast.error('লোড ব্যর্থ'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...INIT, section: filter }); setModal(true); };
  const openEdit   = l  => { setEditing(l._id); setForm({ label:l.label||'', labelBn:l.labelBn||'', url:l.url, section:l.section, isExternal:l.isExternal!==false, isActive:l.isActive!==false, order:l.order||0 }); setModal(true); };

  const handleSave = async () => {
    if (!form.labelBn && !form.label) return toast.error('লিংকের নাম দিন');
    if (!form.url) return toast.error('URL দিন');
    setSaving(true);
    try {
      if (editing) { await quickLinkAPI.update(editing, form); toast.success('আপডেট হয়েছে ✅'); }
      else         { await quickLinkAPI.create(form);          toast.success('লিংক যোগ হয়েছে ✅'); }
      setModal(false); fetch();
    } catch (e) { toast.error(e.message || 'সংরক্ষণ ব্যর্থ'); }
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!confirm('এই লিংকটি মুছে ফেলতে চান?')) return;
    try { await quickLinkAPI.delete(id); toast.success('মুছে গেছে'); fetch(); }
    catch { toast.error('মুছতে ব্যর্থ'); }
  };

  const handleToggle = async l => {
    try { await quickLinkAPI.update(l._id, { ...l, isActive:!l.isActive }); fetch(); }
    catch { toast.error('পরিবর্তন ব্যর্থ'); }
  };

  const filtered = links.filter(l => l.section === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <FaLink className="text-primary" size={16}/> লিংক ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Important Links, Footer Links ও Menu Grid পরিচালনা করুন</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus size={12}/> নতুন লিংক
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap">
        {SECTIONS.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-lg text-xs font-medium transition-colors
              ${filter === s.value ? 'bg-white shadow text-primary' : 'text-gray-600 hover:text-primary'}`}>
            {s.label} ({links.filter(l=>l.section===s.value).length})
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><div className="spinner"/></div> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>নাম (বাংলা)</th><th className="hidden md:table-cell">URL</th><th className="hidden md:table-cell">ধরন</th><th className="hidden md:table-cell">ক্রম</th><th className="text-center w-28">কার্যক্রম</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">কোনো লিংক নেই</td></tr>
                ) : filtered.map((l,i) => (
                  <tr key={l._id} className={!l.isActive ? 'opacity-50' : ''}>
                    <td className="text-gray-400">{i+1}</td>
                    <td>
                      <p className="font-medium text-sm">{l.labelBn || l.label}</p>
                      {l.labelBn && l.label && <p className="text-xs text-gray-400">{l.label}</p>}
                    </td>
                    <td className="hidden md:table-cell">
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-mono truncate max-w-[200px] block">{l.url}</a>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded ${l.isExternal?'bg-orange-100 text-orange-700':'bg-green-100 text-green-700'}`}>
                        {l.isExternal ? 'বাইরের' : 'ভেতরের'}
                      </span>
                    </td>
                    <td className="hidden md:table-cell text-gray-500 text-sm">{l.order}</td>
                    <td>
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => handleToggle(l)}
                          className={`p-1.5 rounded transition-colors ${l.isActive?'text-green-600 hover:bg-green-50':'text-red-400 hover:bg-red-50'}`}>
                          {l.isActive ? <FaToggleOn size={16}/> : <FaToggleOff size={16}/>}
                        </button>
                        <button onClick={() => openEdit(l)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <FaEdit size={13}/>
                        </button>
                        <button onClick={() => handleDelete(l._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
                          <FaTrash size={13}/>
                        </button>
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
              <h3 className="font-bold text-gray-700">{editing ? 'লিংক সম্পাদনা' : 'নতুন লিংক'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">বাংলা নাম *</label>
                <input value={form.labelBn} onChange={e=>setForm({...form,labelBn:e.target.value})} className="input" placeholder="শিক্ষা মন্ত্রণালয়"/>
              </div>
              <div>
                <label className="label">English Label (ঐচ্ছিক)</label>
                <input value={form.label} onChange={e=>setForm({...form,label:e.target.value})} className="input" placeholder="Ministry of Education"/>
              </div>
              <div>
                <label className="label">URL / লিংক *</label>
                <input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} className="input" placeholder="https://example.com বা /about"/>
              </div>
              <div>
                <label className="label">বিভাগ</label>
                <select value={form.section} onChange={e=>setForm({...form,section:e.target.value})} className="input">
                  {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">ক্রম নম্বর</label>
                <input type="number" value={form.order} onChange={e=>setForm({...form,order:+e.target.value})} className="input"/>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isExternal} onChange={e=>setForm({...form,isExternal:e.target.checked})} className="rounded"/>
                  নতুন ট্যাবে খুলুন
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="rounded"/>
                  সক্রিয়
                </label>
              </div>
            </div>
            <div className="flex gap-3 justify-end p-5 border-t">
              <button onClick={() => setModal(false)} className="btn-outline text-sm">বাতিল</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> সংরক্ষণ...</> : <><FaSave size={12}/> সংরক্ষণ</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
