'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaUserTie } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { teachersAPI } from '../../../../lib/api';

const INIT = { name: '', nameBn: '', designation: '', designationBn: '', department: '', subject: '', qualification: '', experience: '', phone: '', email: '', isPrincipal: false, isVicePrincipal: false, employeeType: 'mpo', order: 0, isActive: true };

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
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
    try { const r = await teachersAPI.getAll(); setTeachers(r.data || []); }
    catch (e) { toast.error('শিক্ষকদের তথ্য লোড হয়নি'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(INIT); setPhoto(null); setPhotoPreview(''); setModal(true); };
  const openEdit = (t) => {
    setEditing(t._id);
    setForm({ name: t.name, nameBn: t.nameBn || '', designation: t.designation, designationBn: t.designationBn || '', department: t.department || '', subject: t.subject || '', qualification: t.qualification || '', experience: t.experience || '', phone: t.phone || '', email: t.email || '', isPrincipal: t.isPrincipal, isVicePrincipal: t.isVicePrincipal, employeeType: t.employeeType, order: t.order, isActive: t.isActive });
    setPhoto(null);
    setPhotoPreview(t.photo?.url || '');
    setModal(true);
  };

  const handlePhotoChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPhoto(f);
    const url = URL.createObjectURL(f);
    setPhotoPreview(url);
  };

  const handleSave = async () => {
    if (!form.nameBn && !form.name) return toast.error('শিক্ষকের নাম দিন');
    if (!form.designation) return toast.error('পদবী দিন');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);
      if (editing) {
        await teachersAPI.update(editing, fd);
        toast.success('শিক্ষকের তথ্য আপডেট হয়েছে');
      } else {
        await teachersAPI.create(fd);
        toast.success('শিক্ষক যোগ হয়েছে');
      }
      setModal(false);
      fetch();
    } catch (e) { toast.error(e.message || 'সংরক্ষণ ব্যর্থ হয়েছে'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('এই শিক্ষকের তথ্য মুছে ফেলতে চান?')) return;
    try { await teachersAPI.delete(id); toast.success('মুছে গেছে'); fetch(); }
    catch (e) { toast.error('মুছতে ব্যর্থ হয়েছে'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-700">শিক্ষক ব্যবস্থাপনা</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus size={12} /> নতুন শিক্ষক
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><div className="spinner" /></div> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ছবি</th>
                  <th>নাম</th>
                  <th className="hidden md:table-cell">পদবী</th>
                  <th className="hidden md:table-cell">বিষয়</th>
                  <th className="hidden md:table-cell">ধরন</th>
                  <th className="w-24 text-center">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">কোনো শিক্ষক নেই</td></tr>
                ) : teachers.map((t, i) => (
                  <tr key={t._id}>
                    <td>{i + 1}</td>
                    <td>
                      {t.photo?.url ? (
                        <div className="relative w-9 h-10">
                          <Image src={t.photo.url} alt={t.name} fill className="object-cover rounded" sizes="36px" />
                        </div>
                      ) : (
                        <div className="w-9 h-10 bg-primary/10 rounded flex items-center justify-center">
                          <FaUserTie className="text-primary/40" size={16} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-sm">{t.nameBn || t.name}</p>
                        {t.isPrincipal && <span className="text-xs bg-primary/10 text-primary px-1.5 rounded">অধ্যক্ষ</span>}
                      </div>
                    </td>
                    <td className="hidden md:table-cell text-sm text-gray-600">{t.designationBn || t.designation}</td>
                    <td className="hidden md:table-cell text-sm text-gray-600">{t.subject || '—'}</td>
                    <td className="hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded ${t.employeeType === 'mpo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {t.employeeType?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEdit(t)} className="text-blue-600 hover:text-blue-700 p-1"><FaEdit size={14} /></button>
                        <button onClick={() => handleDelete(t._id)} className="text-red-500 hover:text-red-600 p-1"><FaTrash size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-700">{editing ? 'শিক্ষক সম্পাদনা' : 'নতুন শিক্ষক'}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Photo */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {photoPreview ? (
                    <Image src={photoPreview} alt="Preview" fill className="object-cover" sizes="80px" />
                  ) : <div className="w-full h-full flex items-center justify-center"><FaUserTie className="text-gray-300" size={24} /></div>}
                </div>
                <div>
                  <label className="label">ছবি আপলোড</label>
                  <input type="file" accept="image/*" ref={photoRef} onChange={handlePhotoChange}
                    className="block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG - সর্বোচ্চ 3MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">বাংলা নাম *</label>
                  <input value={form.nameBn} onChange={e => setForm({ ...form, nameBn: e.target.value })} className="input" placeholder="মো. আব্দুল করিম" />
                </div>
                <div>
                  <label className="label">English Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="Md. Abdul Karim" />
                </div>
                <div>
                  <label className="label">পদবী (বাংলা) *</label>
                  <input value={form.designationBn} onChange={e => setForm({ ...form, designationBn: e.target.value })} className="input" placeholder="প্রভাষক" />
                </div>
                <div>
                  <label className="label">Designation</label>
                  <input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="input" placeholder="Lecturer" />
                </div>
                <div>
                  <label className="label">বিষয়</label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input" placeholder="বাংলা" />
                </div>
                <div>
                  <label className="label">বিভাগ</label>
                  <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input" placeholder="মানবিক" />
                </div>
                <div>
                  <label className="label">শিক্ষাগত যোগ্যতা</label>
                  <input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} className="input" placeholder="M.A, B.Ed" />
                </div>
                <div>
                  <label className="label">অভিজ্ঞতা</label>
                  <input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="input" placeholder="১০ বছর" />
                </div>
                <div>
                  <label className="label">মোবাইল</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" placeholder="01XXXXXXXXX" />
                </div>
                <div>
                  <label className="label">ইমেইল</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" type="email" placeholder="teacher@email.com" />
                </div>
                <div>
                  <label className="label">শিক্ষকের ধরন</label>
                  <select value={form.employeeType} onChange={e => setForm({ ...form, employeeType: e.target.value })} className="input">
                    <option value="mpo">MPO</option>
                    <option value="non-mpo">Non-MPO</option>
                    <option value="part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="label">ক্রম নম্বর</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })} className="input" />
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                {[
                  { key: 'isPrincipal', label: 'অধ্যক্ষ' },
                  { key: 'isVicePrincipal', label: 'উপ-অধ্যক্ষ' },
                  { key: 'isActive', label: 'সক্রিয়' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })}
                      className="rounded border-gray-300 text-primary" />
                    {label}
                  </label>
                ))}
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
