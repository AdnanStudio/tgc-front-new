'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaBell, FaChalkboardTeacher, FaImages, FaUsers, FaUserGraduate,
  FaCog, FaArrowRight, FaGlobe, FaClipboardList, FaAward,
  FaUserShield, FaAddressCard, FaPalette, FaLink, FaBullhorn, FaCompass
} from 'react-icons/fa';
import { noticesAPI, teachersAPI, galleryAPI, studentsAPI } from '../../../lib/api';

function StatCard({ icon:Icon, label, value, href, color }) {
  return (
    <Link href={href} className="card p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform group">
      <div className="p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform flex-shrink-0"
        style={{ background: color }}>
        <Icon size={20}/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xl font-bold text-gray-800">{value ?? '...'}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
      </div>
      <FaArrowRight className="text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" size={12}/>
    </Link>
  );
}

const manageLinks = [
  { title:'নোটিশ',          href:'/admin/dashboard/notices',    icon:FaBell,           desc:'নোটিশ যোগ ও মুছুন' },
  { title:'শিক্ষক',         href:'/admin/dashboard/teachers',   icon:FaChalkboardTeacher,desc:'শিক্ষকের তথ্য' },
  { title:'গ্যালারি',       href:'/admin/dashboard/gallery',    icon:FaImages,         desc:'ছবি আপলোড ও মুছুন' },
  { title:'কমিটি',          href:'/admin/dashboard/committee',  icon:FaUsers,          desc:'পরিচালনা কমিটি' },
  { title:'শিক্ষার্থী',    href:'/admin/dashboard/students',   icon:FaUserGraduate,   desc:'পরিসংখ্যান আপডেট' },
  { title:'রুটিন',          href:'/admin/dashboard/routines',   icon:FaClipboardList,  desc:'ক্লাস ও পরীক্ষার রুটিন' },
  { title:'অনুমোদন',        href:'/admin/dashboard/approvals',  icon:FaAward,          desc:'সরকারি অনুমোদন' },
  { title:'MPO',            href:'/admin/dashboard/mpo',        icon:FaAddressCard,    desc:'MPO তথ্য' },
  { title:'থিম ও ডিজাইন',  href:'/admin/dashboard/themes',     icon:FaPalette,        desc:'রং ও ডিজাইন' },
  { title:'নেভিগেশন',      href:'/admin/dashboard/navmenus',   icon:FaCompass,        desc:'মেনু পরিবর্তন' },
  { title:'লিংক সমূহ',     href:'/admin/dashboard/quicklinks', icon:FaLink,           desc:'Important & Footer Links' },
  { title:'স্ক্রলিং',      href:'/admin/dashboard/scrolling',  icon:FaBullhorn,       desc:'মার্কি টেক্সট' },
  { title:'সেটিংস',        href:'/admin/dashboard/settings',   icon:FaCog,            desc:'ওয়েবসাইট তথ্য' },
  { title:'Admin',          href:'/admin/dashboard/admins',     icon:FaUserShield,     desc:'Admin যোগ ও পাসওয়ার্ড' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ notices:0, teachers:0, gallery:0, students:0 });
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const d = localStorage.getItem('adminData');
    if (d) setAdmin(JSON.parse(d));
    Promise.allSettled([
      noticesAPI.getAll({ limit:1 }),
      teachersAPI.getAll(),
      galleryAPI.getAll({ limit:1 }),
      studentsAPI.get(),
    ]).then(([n,t,g,s]) => {
      setStats({
        notices:  n.status==='fulfilled' ? (n.value.pagination?.total||0) : 0,
        teachers: t.status==='fulfilled' ? (t.value.data?.length||0) : 0,
        gallery:  g.status==='fulfilled' ? (g.value.pagination?.total||0) : 0,
        students: s.status==='fulfilled' ? (s.value.data?.totalStudents||0) : 0,
      });
    });
  }, []);

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="text-white rounded-2xl p-5 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 70%, #000) 100%)' }}>
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-1">স্বাগতম, {admin?.name||'Admin'}! 👋</h2>
          <p className="text-sm opacity-80">অ্যাডমিন প্যানেল</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <a href="/" target="_blank" className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs transition-colors">
              <FaGlobe size={11}/> ওয়েবসাইট দেখুন
            </a>
            <Link href="/admin/dashboard/settings" className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs transition-colors">
              <FaCog size={11}/> সেটিংস
            </Link>
            <Link href="/admin/dashboard/themes" className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs transition-colors">
              <FaPalette size={11}/> থিম পরিবর্তন
            </Link>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/5 rounded-full"/>
        <div className="absolute -right-2 bottom-0 w-20 h-20 bg-white/5 rounded-full"/>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={FaBell}             label="মোট নোটিশ"    value={stats.notices}  href="/admin/dashboard/notices"  color="var(--color-btn-primary)"/>
        <StatCard icon={FaChalkboardTeacher} label="মোট শিক্ষক"  value={stats.teachers} href="/admin/dashboard/teachers" color="#2563eb"/>
        <StatCard icon={FaImages}           label="মোট ছবি"      value={stats.gallery}  href="/admin/dashboard/gallery"  color="#7c3aed"/>
        <StatCard icon={FaUserGraduate}     label="শিক্ষার্থী"   value={stats.students} href="/admin/dashboard/students" color="#d97706"/>
      </div>

      {/* All manage links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {manageLinks.map(({ title, href, icon:Icon, desc }) => (
          <Link key={href} href={href}
            className="card p-3.5 flex flex-col items-start gap-2 hover:shadow-md transition-all group hover:-translate-y-0.5">
            <div className="p-2 rounded-lg text-white group-hover:scale-110 transition-transform"
              style={{ background:'var(--color-primary)' }}>
              <Icon size={15}/>
            </div>
            <div className="min-w-0 w-full">
              <h4 className="font-semibold text-sm text-gray-700 group-hover:text-primary truncate">{title}</h4>
              <p className="text-xs text-gray-400 truncate">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
