'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave, FaEdit, FaTimes, FaBullhorn, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { scrollingAPI } from '../../../../lib/api';

export default function AdminScrollingTexts() {
  const [texts,   setTexts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({ text:'', order:0, isActive:true });
  const [saving,  setSaving]  = useState(false);

  const fetch = async () => {
    setLoading(true);
    try { const r = await scrollingAPI.getAllAdmin(); setTexts(r.data || []); }
    catch { toast.error('লোড ব্যর্থ'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm({ text:'', order: texts.length + 1, isActive:true }); setModal(true); };
  const openEdit   = t  => { setEditing(t._id); setForm({ text:t.text, order:t.order, isActive:t.isActive!==false }); setModal(true); };

  const handleSave = async () => {
    if (!form.text.trim()) return toast.error('টেক্সট লিখুন');
    if (texts.length >= 100 && !editing) return toast.error('সর্বোচ্চ ১০০টি স্ক্রলিং টেক্সট রাখা যাবে');
    setSaving(true);
    try {
      if (editing) { await scrollingAPI.update(editing, form); toast.success('আপডেট হয়েছে ✅'); }
      else         { await scrollingAPI.create(form);          toast.success('টেক্সট যোগ হয়েছে ✅'); }
      setModal(false); fetch();
    } catch (e) { toast.error(e.message || 'সংরক্ষণ ব্যর্থ'); }
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!confirm('মুছে ফেলতে চান?')) return;
    try { await scrollingAPI.delete(id); toast.success('মুছে গেছে'); fetch(); }
    catch { toast.error('মুছতে ব্যর্থ'); }
  };

  const handleToggle = async t => {
    try { await scrollingAPI.update(t._id, { ...t, isActive:!t.isActive }); fetch(); }
    catch { toast.error('পরিবর্তন ব্যর্থ'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <FaBullhorn className="text-primary" size={16}/> স্ক্রলিং নোটিশ বার
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">ওয়েবসাইটের মার্কি বারে যে টেক্সটগুলো দেখাবে ({texts.length}/100)</p>
        </div>
        <button onClick={openCreate} disabled={texts.length >= 100}
          className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50">
          <FaPlus size={12}/> নতুন টেক্সট
        </button>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600 font-medium">ব্যবহার: {texts.length}/100</span>
          <span className="text-xs text-gray-400">{100 - texts.length}টি আর যোগ করা যাবে</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full transition-all" style={{ width:`${texts.length}%`, background:'var(--color-primary)' }}/>
        </div>
      </div>

      {/* Live preview */}
      {texts.filter(t=>t.isActive).length > 0 && (
        <div className="card overflow-hidden">
          <div className="section-title">
            <FaBullhorn size={12}/> লাইভ প্রিভিউ
          </div>
          <div className="bg-yellow-400 py-2 px-3 flex items-center gap-2 overflow-hidden">
            <div className="flex-shrink-0 text-white text-xs px-2 py-0.5 rounded font-medium"
              style={{ background:'var(--color-primary)' }}>
              সর্বশেষ
            </div>
            <div className="notice-scroll-wrapper flex-1">
              <span className="notice-scroll-content text-sm font-medium text-gray-900">
                {texts.filter(t=>t.isActive).map(t=>t.text).join('   ✦   ')}
                &nbsp;&nbsp;✦&nbsp;&nbsp;
                {texts.filter(t=>t.isActive).map(t=>t.text).join('   ✦   ')}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><div className="spinner"/></div> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>টেক্সট</th><th className="hidden md:table-cell w-20">ক্রম</th><th className="w-24 text-center">কার্যক্রম</th></tr>
              </thead>
              <tbody>
                {texts.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400">কোনো টেক্সট নেই</td></tr>
                ) : texts.map((t,i) => (
                  <tr key={t._id} className={!t.isActive ? 'opacity-50' : ''}>
                    <td className="text-gray-400">{i+1}</td>
                    <td>
                      <p className="text-sm font-medium">{t.text}</p>
                    </td>
                    <td className="hidden md:table-cell text-gray-500 text-sm">{t.order}</td>
                    <td>
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => handleToggle(t)}
                          className={`p-1.5 rounded transition-colors ${t.isActive?'text-green-600 hover:bg-green-50':'text-red-400 hover:bg-red-50'}`}
                          title={t.isActive?'নিষ্ক্রিয় করুন':'সক্রিয় করুন'}>
                          {t.isActive ? <FaToggleOn size={16}/> : <FaToggleOff size={16}/>}
                        </button>
                        <button onClick={() => openEdit(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                          <FaEdit size={13}/>
                        </button>
                        <button onClick={() => handleDelete(t._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-700">{editing ? 'টেক্সট সম্পাদনা' : 'নতুন স্ক্রলিং টেক্সট'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">স্ক্রলিং টেক্সট *</label>
                <textarea value={form.text} onChange={e=>setForm({...form,text:e.target.value})}
                  className="input resize-none" rows={3}
                  placeholder="এইচএসসি পরীক্ষা-২০২৬ এর ভর্তি চলছে..."/>
                <p className="text-xs text-gray-400 mt-1">{form.text.length} অক্ষর</p>
              </div>
              <div>
                <label className="label">ক্রম নম্বর</label>
                <input type="number" value={form.order} onChange={e=>setForm({...form,order:+e.target.value})} className="input"/>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="rounded"/>
                সক্রিয় রাখুন
              </label>
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
