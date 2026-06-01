'use client';
import { useState, useEffect } from 'react';
import {
  FaUserShield, FaPlus, FaTrash, FaKey, FaToggleOn,
  FaToggleOff, FaTimes, FaSave, FaEye, FaEyeSlash,
  FaEdit, FaCheckCircle, FaTimesCircle, FaCrown
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { adminMgmtAPI } from '../../../../lib/api';

// ─── Modal Types ───────────────────────────────
const MODAL = {
  NONE: null,
  CREATE: 'create',
  RESET_PW: 'reset_pw',
  CHANGE_MY_PW: 'change_my_pw',
  EDIT: 'edit',
};

// ─── Password Input with show/hide ─────────────
function PasswordInput({ value, onChange, placeholder = 'পাসওয়ার্ড লিখুন' }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="input pr-10"
        placeholder={placeholder}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
      </button>
    </div>
  );
}

// ─── Strength indicator ────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: 'কমপক্ষে ৬ অক্ষর', ok: password.length >= 6 },
    { label: 'বড় হাতের অক্ষর (A-Z)', ok: /[A-Z]/.test(password) },
    { label: 'ছোট হাতের অক্ষর (a-z)', ok: /[a-z]/.test(password) },
    { label: 'সংখ্যা (0-9)', ok: /[0-9]/.test(password) },
    { label: 'বিশেষ চিহ্ন (!@#$)', ok: /[!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const labels = ['', 'খুবই দুর্বল', 'দুর্বল', 'মাঝারি', 'ভালো', 'শক্তিশালী'];
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= score ? colors[score] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${score >= 4 ? 'text-green-600' : score >= 3 ? 'text-yellow-600' : 'text-red-500'}`}>
        {labels[score]}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1 text-xs ${c.ok ? 'text-green-600' : 'text-gray-400'}`}>
            {c.ok ? <FaCheckCircle size={9} /> : <FaTimesCircle size={9} />}
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────
export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(MODAL.NONE);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' });
  const [resetForm, setResetForm] = useState({ newPassword: '', confirmPassword: '' });
  const [changePwForm, setChangePwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'admin' });

  useEffect(() => {
    const d = localStorage.getItem('adminData');
    if (d) setCurrentAdmin(JSON.parse(d));
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminMgmtAPI.getAll();
      setAdmins(res.data || []);
    } catch (e) {
      toast.error('Admin তালিকা লোড হয়নি');
    }
    setLoading(false);
  };

  // ── Create Admin ──────────────────────────────
  const handleCreate = async () => {
    const { name, email, password, confirmPassword, role } = createForm;
    if (!name.trim()) return toast.error('নাম দিন');
    if (!email) return toast.error('ইমেইল দিন');
    if (password.length < 6) return toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
    if (password !== confirmPassword) return toast.error('পাসওয়ার্ড মিলছে না');

    setSaving(true);
    try {
      await adminMgmtAPI.create({ name, email, password, role });
      toast.success(`${name} কে Admin হিসেবে যোগ করা হয়েছে ✅`);
      setModal(MODAL.NONE);
      setCreateForm({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' });
      fetchAdmins();
    } catch (e) {
      toast.error(e.message || 'তৈরি করা যায়নি');
    }
    setSaving(false);
  };

  // ── Reset Password (by superadmin) ────────────
  const handleResetPassword = async () => {
    const { newPassword, confirmPassword } = resetForm;
    if (newPassword.length < 6) return toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
    if (newPassword !== confirmPassword) return toast.error('পাসওয়ার্ড মিলছে না');

    setSaving(true);
    try {
      await adminMgmtAPI.resetPassword(selectedAdmin._id, { newPassword });
      toast.success(`${selectedAdmin.name}-এর পাসওয়ার্ড পরিবর্তন হয়েছে ✅`);
      setModal(MODAL.NONE);
      setResetForm({ newPassword: '', confirmPassword: '' });
    } catch (e) {
      toast.error(e.message || 'পাসওয়ার্ড পরিবর্তন হয়নি');
    }
    setSaving(false);
  };

  // ── Change My Password ────────────────────────
  const handleChangeMyPassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = changePwForm;
    if (!currentPassword) return toast.error('বর্তমান পাসওয়ার্ড দিন');
    if (newPassword.length < 6) return toast.error('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
    if (newPassword !== confirmPassword) return toast.error('নতুন পাসওয়ার্ড মিলছে না');
    if (currentPassword === newPassword) return toast.error('নতুন পাসওয়ার্ড আগেরটার মতো হতে পারবে না');

    setSaving(true);
    try {
      await adminMgmtAPI.changeMyPassword({ currentPassword, newPassword });
      toast.success('আপনার পাসওয়ার্ড পরিবর্তন হয়েছে ✅');
      setModal(MODAL.NONE);
      setChangePwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      toast.error(e.message || 'পাসওয়ার্ড পরিবর্তন হয়নি। বর্তমান পাসওয়ার্ড ঠিক আছে?');
    }
    setSaving(false);
  };

  // ── Edit Admin Info ───────────────────────────
  const handleEdit = async () => {
    const { name, email, role } = editForm;
    if (!name.trim()) return toast.error('নাম দিন');
    if (!email) return toast.error('ইমেইল দিন');

    setSaving(true);
    try {
      await adminMgmtAPI.update(selectedAdmin._id, { name, email, role });
      toast.success('Admin তথ্য আপডেট হয়েছে ✅');
      setModal(MODAL.NONE);
      fetchAdmins();
    } catch (e) {
      toast.error(e.message || 'আপডেট হয়নি');
    }
    setSaving(false);
  };

  // ── Toggle Active/Inactive ─────────────────────
  const handleToggle = async (admin) => {
    if (admin._id === currentAdmin?.id) return toast.error('নিজেকে নিষ্ক্রিয় করা যাবে না');
    try {
      await adminMgmtAPI.toggle(admin._id);
      toast.success(`${admin.name} ${admin.isActive ? 'নিষ্ক্রিয়' : 'সক্রিয়'} করা হয়েছে`);
      fetchAdmins();
    } catch (e) {
      toast.error('পরিবর্তন হয়নি');
    }
  };

  // ── Delete Admin ──────────────────────────────
  const handleDelete = async (admin) => {
    if (admin._id === currentAdmin?.id) return toast.error('নিজেকে ডিলিট করা যাবে না');
    if (!confirm(`"${admin.name}" কে ডিলিট করতে চান? এটি পূর্বাবস্থায় ফেরানো যাবে না।`)) return;
    try {
      await adminMgmtAPI.delete(admin._id);
      toast.success(`${admin.name} ডিলিট হয়েছে`);
      fetchAdmins();
    } catch (e) {
      toast.error('ডিলিট হয়নি');
    }
  };

  const isSuperAdmin = currentAdmin?.role === 'superadmin';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <FaUserShield className="text-primary" size={20} />
            Admin ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">সকল Admin অ্যাকাউন্ট পরিচালনা করুন</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* নিজের পাসওয়ার্ড পরিবর্তন - সবাই করতে পারবে */}
          <button
            onClick={() => setModal(MODAL.CHANGE_MY_PW)}
            className="btn-outline flex items-center gap-2 text-sm"
          >
            <FaKey size={12} /> আমার পাসওয়ার্ড পরিবর্তন
          </button>
          {/* নতুন admin শুধু superadmin বানাতে পারবে */}
          {isSuperAdmin && (
            <button
              onClick={() => setModal(MODAL.CREATE)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <FaPlus size={12} /> নতুন Admin যোগ করুন
            </button>
          )}
        </div>
      </div>

      {/* Info Banner */}
      {!isSuperAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2 text-sm text-yellow-700">
          <FaCrown className="text-yellow-500 flex-shrink-0 mt-0.5" size={14} />
          <span>শুধুমাত্র <strong>Super Admin</strong> নতুন Admin তৈরি করতে এবং অন্যদের পাসওয়ার্ড রিসেট করতে পারবেন। আপনি শুধু নিজের পাসওয়ার্ড পরিবর্তন করতে পারবেন।</span>
        </div>
      )}

      {/* Admin List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>নাম</th>
                  <th className="hidden md:table-cell">ইমেইল</th>
                  <th className="hidden md:table-cell">ভূমিকা</th>
                  <th className="hidden md:table-cell">স্ট্যাটাস</th>
                  <th className="hidden lg:table-cell">শেষ লগইন</th>
                  <th className="text-center">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">কোনো Admin নেই</td>
                  </tr>
                ) : admins.map((admin, i) => {
                  const isMe = admin._id === currentAdmin?.id;
                  return (
                    <tr key={admin._id} className={isMe ? 'bg-primary/5' : ''}>
                      <td className="text-gray-500">{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                            ${admin.role === 'superadmin' ? 'bg-yellow-500' : 'bg-primary'}`}>
                            {admin.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-sm text-gray-800">{admin.name}</span>
                              {isMe && (
                                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">আপনি</span>
                              )}
                            </div>
                            {/* Mobile: show email below name */}
                            <p className="text-xs text-gray-400 md:hidden">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell text-sm text-gray-600">{admin.email}</td>
                      <td className="hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium
                          ${admin.role === 'superadmin'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'}`}>
                          {admin.role === 'superadmin' ? <><FaCrown size={9} /> Super Admin</> : 'Admin'}
                        </span>
                      </td>
                      <td className="hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full
                          ${admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${admin.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          {admin.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell text-xs text-gray-400">
                        {admin.lastLogin
                          ? format(new Date(admin.lastLogin), 'dd/MM/yyyy hh:mm a')
                          : 'কখনো না'}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {/* Edit - superadmin only, not self */}
                          {isSuperAdmin && !isMe && (
                            <button
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setEditForm({ name: admin.name, email: admin.email, role: admin.role });
                                setModal(MODAL.EDIT);
                              }}
                              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              title="তথ্য সম্পাদনা"
                            >
                              <FaEdit size={13} />
                            </button>
                          )}

                          {/* Reset password - superadmin only, not self */}
                          {isSuperAdmin && !isMe && (
                            <button
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setResetForm({ newPassword: '', confirmPassword: '' });
                                setModal(MODAL.RESET_PW);
                              }}
                              className="p-1.5 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors"
                              title="পাসওয়ার্ড রিসেট"
                            >
                              <FaKey size={13} />
                            </button>
                          )}

                          {/* Toggle active - superadmin only, not self */}
                          {isSuperAdmin && !isMe && (
                            <button
                              onClick={() => handleToggle(admin)}
                              className={`p-1.5 rounded transition-colors ${admin.isActive
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-red-500 hover:bg-red-50'}`}
                              title={admin.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                            >
                              {admin.isActive ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                            </button>
                          )}

                          {/* Delete - superadmin only, not self, not other superadmins */}
                          {isSuperAdmin && !isMe && admin.role !== 'superadmin' && (
                            <button
                              onClick={() => handleDelete(admin)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="ডিলিট করুন"
                            >
                              <FaTrash size={13} />
                            </button>
                          )}

                          {isMe && (
                            <span className="text-xs text-gray-400 px-2">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Modals ─────────────────────────────────── */}
      <AnimatePresence>
        {modal !== MODAL.NONE && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setModal(MODAL.NONE)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >

              {/* ── CREATE ADMIN MODAL ── */}
              {modal === MODAL.CREATE && (
                <>
                  <div className="flex items-center gap-3 p-5 border-b bg-primary text-white">
                    <div className="bg-white/20 p-2 rounded-lg"><FaPlus size={16} /></div>
                    <div>
                      <h3 className="font-bold">নতুন Admin যোগ করুন</h3>
                      <p className="text-xs text-green-200">একটি নতুন Admin অ্যাকাউন্ট তৈরি করুন</p>
                    </div>
                    <button onClick={() => setModal(MODAL.NONE)} className="ml-auto text-white/70 hover:text-white">
                      <FaTimes size={18} />
                    </button>
                  </div>
                  <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label className="label">পুরো নাম *</label>
                      <input
                        value={createForm.name}
                        onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                        className="input"
                        placeholder="যেমন: মো. আব্দুল্লাহ"
                      />
                    </div>
                    <div>
                      <label className="label">ইমেইল ঠিকানা *</label>
                      <input
                        type="email"
                        value={createForm.email}
                        onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                        className="input"
                        placeholder="admin@college.edu.bd"
                      />
                    </div>
                    <div>
                      <label className="label">ভূমিকা (Role)</label>
                      <select
                        value={createForm.role}
                        onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                        className="input"
                      >
                        <option value="admin">Admin — সাধারণ অ্যাডমিন</option>
                        <option value="superadmin">Super Admin — সর্বোচ্চ অনুমতি</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        ⚠️ Super Admin অন্য Admin তৈরি, মুছতে ও পাসওয়ার্ড রিসেট করতে পারবে
                      </p>
                    </div>
                    <div>
                      <label className="label">পাসওয়ার্ড *</label>
                      <PasswordInput
                        value={createForm.password}
                        onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                        placeholder="নতুন পাসওয়ার্ড"
                      />
                      <PasswordStrength password={createForm.password} />
                    </div>
                    <div>
                      <label className="label">পাসওয়ার্ড নিশ্চিত করুন *</label>
                      <PasswordInput
                        value={createForm.confirmPassword}
                        onChange={e => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
                        placeholder="আবার পাসওয়ার্ড লিখুন"
                      />
                      {createForm.confirmPassword && createForm.password !== createForm.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <FaTimesCircle size={10} /> পাসওয়ার্ড মিলছে না
                        </p>
                      )}
                      {createForm.confirmPassword && createForm.password === createForm.confirmPassword && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <FaCheckCircle size={10} /> পাসওয়ার্ড মিলেছে
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 p-5 border-t">
                    <button onClick={() => setModal(MODAL.NONE)} className="btn-outline flex-1 text-sm">বাতিল</button>
                    <button onClick={handleCreate} disabled={saving} className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
                      {saving
                        ? <><div className="spinner !w-4 !h-4 border-white/30 border-t-white" /> তৈরি হচ্ছে...</>
                        : <><FaPlus size={12} /> Admin তৈরি করুন</>}
                    </button>
                  </div>
                </>
              )}

              {/* ── EDIT ADMIN MODAL ── */}
              {modal === MODAL.EDIT && selectedAdmin && (
                <>
                  <div className="flex items-center gap-3 p-5 border-b bg-blue-600 text-white">
                    <div className="bg-white/20 p-2 rounded-lg"><FaEdit size={16} /></div>
                    <div>
                      <h3 className="font-bold">Admin তথ্য সম্পাদনা</h3>
                      <p className="text-xs text-blue-200">{selectedAdmin.name}</p>
                    </div>
                    <button onClick={() => setModal(MODAL.NONE)} className="ml-auto text-white/70 hover:text-white">
                      <FaTimes size={18} />
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="label">পুরো নাম *</label>
                      <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input" />
                    </div>
                    <div>
                      <label className="label">ইমেইল *</label>
                      <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="input" />
                    </div>
                    <div>
                      <label className="label">ভূমিকা</label>
                      <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="input">
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 p-5 border-t">
                    <button onClick={() => setModal(MODAL.NONE)} className="btn-outline flex-1 text-sm">বাতিল</button>
                    <button onClick={handleEdit} disabled={saving} className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
                      {saving
                        ? <><div className="spinner !w-4 !h-4 border-white/30 border-t-white" /> আপডেট...</>
                        : <><FaSave size={12} /> আপডেট করুন</>}
                    </button>
                  </div>
                </>
              )}

              {/* ── RESET PASSWORD MODAL (superadmin resets others) ── */}
              {modal === MODAL.RESET_PW && selectedAdmin && (
                <>
                  <div className="flex items-center gap-3 p-5 border-b bg-orange-500 text-white">
                    <div className="bg-white/20 p-2 rounded-lg"><FaKey size={16} /></div>
                    <div>
                      <h3 className="font-bold">পাসওয়ার্ড রিসেট করুন</h3>
                      <p className="text-xs text-orange-100">{selectedAdmin.name} ({selectedAdmin.email})</p>
                    </div>
                    <button onClick={() => setModal(MODAL.NONE)} className="ml-auto text-white/70 hover:text-white">
                      <FaTimes size={18} />
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
                      ⚠️ এই Admin-এর পাসওয়ার্ড পরিবর্তন করলে তাকে নতুন পাসওয়ার্ড জানাতে হবে।
                    </div>
                    <div>
                      <label className="label">নতুন পাসওয়ার্ড *</label>
                      <PasswordInput
                        value={resetForm.newPassword}
                        onChange={e => setResetForm({ ...resetForm, newPassword: e.target.value })}
                        placeholder="নতুন পাসওয়ার্ড"
                      />
                      <PasswordStrength password={resetForm.newPassword} />
                    </div>
                    <div>
                      <label className="label">পাসওয়ার্ড নিশ্চিত করুন *</label>
                      <PasswordInput
                        value={resetForm.confirmPassword}
                        onChange={e => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                        placeholder="আবার পাসওয়ার্ড লিখুন"
                      />
                      {resetForm.confirmPassword && resetForm.newPassword !== resetForm.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><FaTimesCircle size={10} /> মিলছে না</p>
                      )}
                      {resetForm.confirmPassword && resetForm.newPassword === resetForm.confirmPassword && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><FaCheckCircle size={10} /> মিলেছে</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 p-5 border-t">
                    <button onClick={() => setModal(MODAL.NONE)} className="btn-outline flex-1 text-sm">বাতিল</button>
                    <button onClick={handleResetPassword} disabled={saving}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      {saving
                        ? <><div className="spinner !w-4 !h-4 border-white/30 border-t-white" /> রিসেট হচ্ছে...</>
                        : <><FaKey size={12} /> পাসওয়ার্ড রিসেট করুন</>}
                    </button>
                  </div>
                </>
              )}

              {/* ── CHANGE MY PASSWORD MODAL ── */}
              {modal === MODAL.CHANGE_MY_PW && (
                <>
                  <div className="flex items-center gap-3 p-5 border-b bg-primary text-white">
                    <div className="bg-white/20 p-2 rounded-lg"><FaKey size={16} /></div>
                    <div>
                      <h3 className="font-bold">আমার পাসওয়ার্ড পরিবর্তন</h3>
                      <p className="text-xs text-green-200">নিরাপদ রাখতে নিয়মিত পাসওয়ার্ড বদলান</p>
                    </div>
                    <button onClick={() => setModal(MODAL.NONE)} className="ml-auto text-white/70 hover:text-white">
                      <FaTimes size={18} />
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="label">বর্তমান পাসওয়ার্ড *</label>
                      <PasswordInput
                        value={changePwForm.currentPassword}
                        onChange={e => setChangePwForm({ ...changePwForm, currentPassword: e.target.value })}
                        placeholder="আপনার বর্তমান পাসওয়ার্ড"
                      />
                    </div>
                    <div>
                      <label className="label">নতুন পাসওয়ার্ড *</label>
                      <PasswordInput
                        value={changePwForm.newPassword}
                        onChange={e => setChangePwForm({ ...changePwForm, newPassword: e.target.value })}
                        placeholder="নতুন পাসওয়ার্ড"
                      />
                      <PasswordStrength password={changePwForm.newPassword} />
                    </div>
                    <div>
                      <label className="label">নতুন পাসওয়ার্ড নিশ্চিত করুন *</label>
                      <PasswordInput
                        value={changePwForm.confirmPassword}
                        onChange={e => setChangePwForm({ ...changePwForm, confirmPassword: e.target.value })}
                        placeholder="আবার লিখুন"
                      />
                      {changePwForm.confirmPassword && changePwForm.newPassword !== changePwForm.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><FaTimesCircle size={10} /> মিলছে না</p>
                      )}
                      {changePwForm.confirmPassword && changePwForm.newPassword === changePwForm.confirmPassword && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><FaCheckCircle size={10} /> মিলেছে</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 p-5 border-t">
                    <button onClick={() => setModal(MODAL.NONE)} className="btn-outline flex-1 text-sm">বাতিল</button>
                    <button onClick={handleChangeMyPassword} disabled={saving}
                      className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
                      {saving
                        ? <><div className="spinner !w-4 !h-4 border-white/30 border-t-white" /> পরিবর্তন হচ্ছে...</>
                        : <><FaKey size={12} /> পাসওয়ার্ড পরিবর্তন করুন</>}
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
