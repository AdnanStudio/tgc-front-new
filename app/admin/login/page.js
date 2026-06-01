'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authAPI } from '../../../lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('সব তথ্য পূরণ করুন');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      // JWT is 365 days — save token + admin info
      localStorage.setItem('adminToken', res.token);
      localStorage.setItem('adminData',  JSON.stringify(res.admin));
      // Save login timestamp
      localStorage.setItem('loginTime',  new Date().toISOString());
      toast.success('লগইন সফল হয়েছে ✅');
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'লগইন ব্যর্থ হয়েছে');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background:'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 50%, #000) 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-xl">
            <FaShieldAlt size={28} style={{ color:'var(--color-primary)' }}/>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-green-200 text-sm mt-1">অ্যাডমিন প্যানেল</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">ইমেইল</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input pl-10" placeholder="admin@college.edu.bd" autoComplete="email"/>
              </div>
            </div>
            <div>
              <label className="label">পাসওয়ার্ড</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                <input type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10" placeholder="••••••••" autoComplete="current-password"/>
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <FaEyeSlash size={14}/> : <FaEye size={14}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              style={{ background:'var(--color-btn-primary)' }}>
              {loading
                ? <><div className="spinner !w-5 !h-5 border-white/30 border-t-white"/> লগইন হচ্ছে...</>
                : 'লগইন করুন'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← মূল ওয়েবসাইটে ফিরুন
            </a>
          </div>
        </div>
        <p className="text-center text-white/40 text-xs mt-5">
          © {new Date().getFullYear()} Malkhanagar College
        </p>
      </div>
    </div>
  );
}
