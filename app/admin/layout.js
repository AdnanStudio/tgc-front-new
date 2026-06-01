'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FaTachometerAlt, FaBell, FaChalkboardTeacher, FaImages, FaUsers,
  FaUserGraduate, FaCog, FaSignOutAlt, FaBars, FaTimes, FaUserShield,
  FaShieldAlt, FaClipboardList, FaAward, FaAddressCard, FaChevronDown,
  FaChevronRight, FaPalette, FaLink, FaBullhorn, FaCompass
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const navGroups = [
  {
    group:'প্রধান',
    items:[{ label:'ড্যাশবোর্ড', href:'/admin/dashboard', icon:FaTachometerAlt }]
  },
  {
    group:'কন্টেন্ট',
    items:[
      { label:'নোটিশ',            href:'/admin/dashboard/notices',   icon:FaBell },
      { label:'শিক্ষক',           href:'/admin/dashboard/teachers',  icon:FaChalkboardTeacher },
      { label:'গ্যালারি',         href:'/admin/dashboard/gallery',   icon:FaImages },
      { label:'কমিটি',            href:'/admin/dashboard/committee', icon:FaUsers },
      { label:'শিক্ষার্থী',      href:'/admin/dashboard/students',  icon:FaUserGraduate },
    ]
  },
  {
    group:'একাডেমিক',
    items:[
      { label:'রুটিন',            href:'/admin/dashboard/routines',  icon:FaClipboardList },
      { label:'অনুমোদন',          href:'/admin/dashboard/approvals', icon:FaAward },
      { label:'MPO',              href:'/admin/dashboard/mpo',       icon:FaAddressCard },
    ]
  },
  {
    group:'ওয়েবসাইট',
    items:[
      { label:'থিম ও ডিজাইন',    href:'/admin/dashboard/themes',    icon:FaPalette },
      { label:'নেভিগেশন মেনু',   href:'/admin/dashboard/navmenus',  icon:FaCompass },
      { label:'লিংক সমূহ',        href:'/admin/dashboard/quicklinks',icon:FaLink },
      { label:'স্ক্রলিং টেক্সট', href:'/admin/dashboard/scrolling', icon:FaBullhorn },
    ]
  },
  {
    group:'সেটিংস',
    items:[
      { label:'ওয়েবসাইট সেটিংস', href:'/admin/dashboard/settings',  icon:FaCog },
      { label:'Admin ব্যবস্থাপনা', href:'/admin/dashboard/admins',   icon:FaUserShield },
    ]
  },
];

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin,       setAdmin]       = useState(null);
  const [collapsed,   setCollapsed]   = useState({});

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token = localStorage.getItem('adminToken');
    const data  = localStorage.getItem('adminData');
    if (!token) { router.push('/admin/login'); return; }
    if (data)   setAdmin(JSON.parse(data));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    toast.success('লগআউট হয়েছে');
    router.push('/admin/login');
  };

  const isActive = href =>
    href === '/admin/dashboard' ? pathname === href : pathname.startsWith(href);

  const toggleGroup = g => setCollapsed(c => ({ ...c, [g]: !c[g] }));

  if (pathname === '/admin/login') return children;

  const currentLabel = navGroups.flatMap(g=>g.items).find(n=>isActive(n.href))?.label || 'Admin Panel';

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={()=>setSidebarOpen(false)}/>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-60 bg-gray-900 text-white flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-700/60 bg-black/20 flex-shrink-0">
          <div className="p-2 rounded-lg flex-shrink-0" style={{ background:'var(--color-primary)' }}>
            <FaShieldAlt size={15}/>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm leading-tight">Admin Panel</h2>
            
          </div>
          <button className="ml-auto md:hidden text-gray-400 hover:text-white flex-shrink-0"
            onClick={()=>setSidebarOpen(false)}>
            <FaTimes size={14}/>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navGroups.map(({ group, items }) => (
            <div key={group} className="mb-1">
              <button onClick={()=>toggleGroup(group)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors rounded">
                <span>{group}</span>
                {collapsed[group] ? <FaChevronRight size={8}/> : <FaChevronDown size={8}/>}
              </button>
              {!collapsed[group] && items.map(({ label, href, icon:Icon }) => (
                <Link key={href} href={href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all mb-0.5
                    ${isActive(href) ? 'text-white shadow-sm' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                  style={isActive(href) ? { background:'var(--color-primary)' } : {}}
                  onClick={()=>setSidebarOpen(false)}>
                  <Icon size={13} className="flex-shrink-0"/>
                  <span className="truncate text-sm">{label}</span>
                  {isActive(href) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0"/>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-700/60 p-2 space-y-1 flex-shrink-0">
          {admin && (
            <div className="px-3 py-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background:'var(--color-primary)' }}>
                {admin.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{admin.name}</p>
                <p className="text-xs text-gray-500">{admin.role==='superadmin'?'⭐ Super Admin':'Admin'}</p>
              </div>
            </div>
          )}
          <a href="/" target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            🌐 <span>মূল ওয়েবসাইট</span>
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-all">
            <FaSignOutAlt size={12}/><span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b shadow-sm px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button className="md:hidden text-gray-600 hover:text-primary p-1" onClick={()=>setSidebarOpen(true)}>
            <FaBars size={20}/>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-gray-400 text-xs hidden md:block">Admin /</span>
            <h1 className="font-semibold text-gray-700 text-sm truncate">{currentLabel}</h1>
          </div>
          <div className="ml-auto">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium
              ${admin?.role==='superadmin'?'bg-yellow-100 text-yellow-700':'bg-primary/10 text-primary'}`}>
              {admin?.role==='superadmin'?'⭐ Super Admin':'Admin'}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
