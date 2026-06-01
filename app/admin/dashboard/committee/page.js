'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaUserTie } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { committeeAPI } from '../../../../lib/api';

const INIT = { name: '', nameBn: '', designation: '', designationBn: '', type: 'member', phone: '', email: '', order: 0, isActive: true };

export default function AdminCommittee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INIT);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const photoRef = useRef();

  const fetch = async () => {
    setLoading(true);
    try { const r = await committeeAPI.getAll(); setMembers(r.data || []); }
    catch (e) { toast.error('তথ্য লোড হয়নি'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(INIT); setPhoto(null); setPhotoPreview(''); setModal(true); };
  const openEdit = (m) => {
    setEditing(m._id);
    setForm({ name: m.name, nameBn: m.nameBn || '', designation: m.designation, designationBn: m.designationBn || '', type: m.type, phone: m.phone || '', email: m.email || '', order: m.order, isActive: m.isActive });
    setPhoto(null);
    setPhotoPreview(m.photo?.url || '');
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.nameBn && !form.name) return toast.error('নাম দিন');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);
      if (editing) { await committeeAPI.update(editing, fd); toast.success('আপডেট হয়েছে'); }
      else { await committeeAPI.create(fd); toast.success('যোগ হয়েছে'); }
      setModal(false);
      fetch();
    } catch (e) { toast.error('সংরক্ষণ ব্যর্থ'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('মুছে ফেলতে চান?')) return;
    try { await committeeAPI.delete(id); toast.success('মুছে গেছে'); fetch(); }
    catch { toast.error('মুছতে ব্যর্থ'); }
  };

  const typeLabel = { chairman: 'সভাপতি', secretary: 'সচিব', treasurer: 'কোষাধ্যক্ষ', member: 'সদস্য' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-700">ব্যবস্থাপনা কমিটি</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FaPlus size={12} /> নতুন সদস্য</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><div className="spinner" /></div> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>ছবি</th><th>নাম</th><th className="hidden md:table-cell">পদবী</th><th className="hidden md:table-cell">ধরন</th><th className="hidden md:table-cell">মোবাইল</th><th className="text-center w-24">কার্যক্রম</th></tr>
              </thead>
              <tbody>
                {members.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">কোনো সদস্য নেই</td></tr> : members.map((m, i) => (
                  <tr key={m._id}>
                    <td>{i + 1}</td>
                    <td>
                      {m.photo?.url ? <div className="relative w-9 h-10"><Image src={m.photo.url} alt={m.name} fill className="object-cover rounded" sizes="36px" /></div>
                        : <div className="w-9 h-10 bg-primary/10 rounded flex items-center justify-center"><FaUserTie className="text-primary/40" size={14} /></div>}
                    </td>
                    <td className="font-medium text-sm">{m.nameBn || m.name}</td>
                    <td className="hidden md:table-cell text-sm text-gray-600">{m.designationBn || m.designation}</td>
                    <td className="hidden md:table-cell"><span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{typeLabel[m.type]}</span></td>
                    <td className="hidden md:table-cell text-sm text-gray-500">{m.phone || '—'}</td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEdit(m)} className="text-blue-600 hover:text-blue-700 p-1"><FaEdit size={14} /></button>
                        <button onClick={() => handleDelete(m._id)} className="text-red-500 hover:text-red-600 p-1"><FaTrash size={14} /></button>
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
              <h3 className="font-bold text-gray-700">{editing ? 'সদস্য সম্পাদনা' : 'নতুন সদস্য'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {photoPreview ? <Image src={photoPreview} alt="Preview" fill className="object-cover" sizes="80px" />
                    : <div className="w-full h-full flex items-center justify-center"><FaUserTie className="text-gray-300" size={24} /></div>}
                </div>
                <div>
                  <label className="label">ছবি আপলোড</label>
                  <input type="file" accept="image/*" ref={photoRef} onChange={e => { const f = e.target.files[0]; if (f) { setPhoto(f); setPhotoPreview(URL.createObjectURL(f)); } }} className="hidden" />
                  <button onClick={() => photoRef.current?.click()} className="btn-outline text-sm">ছবি বেছে নিন</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">নাম (বাংলা) *</label><input value={form.nameBn} onChange={e => setForm({ ...form, nameBn: e.target.value })} className="input" /></div>
                <div><label className="label">Name (English)</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" /></div>
                <div><label className="label">পদবী (বাংলা) *</label><input value={form.designationBn} onChange={e => setForm({ ...form, designationBn: e.target.value })} className="input" /></div>
                <div><label className="label">Designation</label><input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="input" /></div>
                <div>
                  <label className="label">ধরন</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input">
                    {Object.entries(typeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div><label className="label">ক্রম</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })} className="input" /></div>
                <div><label className="label">মোবাইল</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" /></div>
                <div><label className="label">ইমেইল</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" /></div>
              </div>
            </div>
            <div className="flex gap-3 justify-end p-5 border-t">
              <button onClick={() => setModal(false)} className="btn-outline text-sm">বাতিল</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <><div className="spinner !w-4 !h-4 border-white/30 border-t-white" /> সংরক্ষণ...</> : <><FaSave size={13} /> সংরক্ষণ</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
