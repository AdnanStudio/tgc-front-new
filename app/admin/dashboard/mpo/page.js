'use client';
import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaAddressCard } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { mpoAPI } from '../../../../lib/api';

const INIT = { mpoNumber:'', mpoDate:'', mpoStatus:'active', description:'' };

export default function AdminMpo() {
  const [mpoInfo, setMpoInfo] = useState(null);
  const [form,    setForm]    = useState(INIT);
  const [docs,    setDocs]    = useState([]);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mpoAPI.get()
      .then(r => {
        if (r.data) {
          setMpoInfo(r.data);
          setForm({
            mpoNumber:  r.data.mpoNumber  || '',
            mpoDate:    r.data.mpoDate ? r.data.mpoDate.split('T')[0] : '',
            mpoStatus:  r.data.mpoStatus  || 'active',
            description:r.data.description|| '',
          });
          setDocs(r.data.documents || []);
        }
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, documents: docs };
      if (mpoInfo?._id) {
        await mpoAPI.update(mpoInfo._id, payload);
        toast.success('MPO তথ্য আপডেট হয়েছে ✅');
      } else {
        const res = await mpoAPI.create(payload);
        setMpoInfo(res.data);
        toast.success('MPO তথ্য সংরক্ষিত হয়েছে ✅');
      }
    } catch { toast.error('সংরক্ষণ ব্যর্থ হয়েছে'); }
    setSaving(false);
  };

  const addDoc = () => setDocs([...docs, { title:'', googleDriveLink:'' }]);
  const updateDoc = (i, field, val) => {
    const updated = [...docs];
    updated[i] = { ...updated[i], [field]: val };
    setDocs(updated);
  };
  const removeDoc = i => setDocs(docs.filter((_,idx)=>idx!==i));

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"/></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <FaAddressCard className="text-primary" size={18}/> MPO তথ্য ব্যবস্থাপনা
        </h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
          {saving ? <><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> সংরক্ষণ...</> : <><FaSave size={13}/> সংরক্ষণ করুন</>}
        </button>
      </div>

      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-gray-700 border-b pb-2">মূল MPO তথ্য</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">MPO নম্বর</label>
            <input value={form.mpoNumber} onChange={e=>setForm({...form,mpoNumber:e.target.value})}
              className="input" placeholder="MPO নম্বর লিখুন"/>
          </div>
          <div>
            <label className="label">MPO তারিখ</label>
            <input type="date" value={form.mpoDate} onChange={e=>setForm({...form,mpoDate:e.target.value})}
              className="input"/>
          </div>
          <div>
            <label className="label">MPO স্ট্যাটাস</label>
            <select value={form.mpoStatus} onChange={e=>setForm({...form,mpoStatus:e.target.value})} className="input">
              <option value="active">✅ সক্রিয়</option>
              <option value="inactive">❌ নিষ্ক্রিয়</option>
              <option value="pending">⏳ প্রক্রিয়াধীন</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">বিবরণ</label>
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
            className="input resize-none" rows={4} placeholder="MPO সংক্রান্ত অতিরিক্ত তথ্য..."/>
        </div>
      </div>

      {/* Documents */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-semibold text-gray-700">MPO ডকুমেন্টসমূহ</h3>
          <button onClick={addDoc}
            className="flex items-center gap-1.5 text-primary text-sm hover:underline font-medium">
            <FaPlus size={11}/> নতুন ডকুমেন্ট যোগ করুন
          </button>
        </div>

        {docs.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">কোনো ডকুমেন্ট নেই — উপরের বাটন দিয়ে যোগ করুন</p>
        ) : (
          <div className="space-y-3">
            {docs.map((doc, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border">
                <div>
                  <label className="label">ডকুমেন্টের নাম</label>
                  <input value={doc.title} onChange={e=>updateDoc(i,'title',e.target.value)}
                    className="input" placeholder="যেমন: MPO প্রজ্ঞাপন"/>
                </div>
                <div>
                  <label className="label">Google Drive লিংক</label>
                  <input value={doc.googleDriveLink||''} onChange={e=>updateDoc(i,'googleDriveLink',e.target.value)}
                    className="input" placeholder="https://drive.google.com/file/d/..."/>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button onClick={()=>removeDoc(i)}
                    className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-xs font-medium">
                    <FaTrash size={11}/> এই ডকুমেন্ট সরিয়ে দিন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
