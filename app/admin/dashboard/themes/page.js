'use client';
import { useState, useEffect } from 'react';
import { FaCheck, FaPalette, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { themeAPI } from '../../../../lib/api';
import { useTheme } from '../../../../lib/ThemeContext';

const BORDER_RADIUS = ['none','sm','md','lg','xl','full'];
const NAV_STYLES    = ['solid','gradient','glassmorphism'];
const CARD_STYLES   = ['flat','shadow','border','elevated'];

function ColorPicker({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value || '#1a6b3c'} onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0.5 flex-shrink-0"/>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-600 truncate">{label}</p>
        <p className="text-xs text-gray-400 font-mono">{value}</p>
      </div>
    </div>
  );
}

export default function AdminThemes() {
  const [themes,  setThemes]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);
  const { refreshTheme } = useTheme();

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const r = await themeAPI.getAll();
      if (!r.data?.length) {
        await themeAPI.seed();
        const r2 = await themeAPI.getAll();
        setThemes(r2.data || []);
      } else {
        setThemes(r.data);
      }
    } catch { toast.error('থিম লোড ব্যর্থ'); }
    setLoading(false);
  };
  useEffect(() => { fetchThemes(); }, []);

  const handleActivate = async (id) => {
    try {
      await themeAPI.activate(id);
      toast.success('থিম সক্রিয় করা হয়েছে ✅');
      fetchThemes();
      refreshTheme();
    } catch { toast.error('থিম পরিবর্তন ব্যর্থ'); }
  };

  const openEdit = (theme) => {
    setEditing(theme._id);
    setForm({ ...theme });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await themeAPI.update(editing, form);
      toast.success('থিম আপডেট হয়েছে ✅');
      setEditing(null);
      fetchThemes();
      // If this theme is active, refresh
      const active = themes.find(t => t.isActive);
      if (active?._id === editing) refreshTheme();
    } catch { toast.error('সংরক্ষণ ব্যর্থ'); }
    setSaving(false);
  };

  const c = (key) => (
    <ColorPicker label={key} value={form[key] || '#000000'} onChange={v => setForm({...form,[key]:v})}/>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <FaPalette className="text-primary" size={18}/> থিম ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">পছন্দের থিম বেছে নিন বা কাস্টমাইজ করুন</p>
        </div>
      </div>

      {/* Active theme banner */}
      {themes.find(t => t.isActive) && (
        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-green-200 bg-green-50">
          <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: themes.find(t=>t.isActive)?.primary }}/>
          <div>
            <p className="font-bold text-sm text-green-800">সক্রিয় থিম: {themes.find(t=>t.isActive)?.nameBn}</p>
            <p className="text-xs text-green-600">এই থিমটি এখন ওয়েবসাইটে দেখা যাচ্ছে</p>
          </div>
          <span className="ml-auto bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">সক্রিয়</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_,i) => (
            <div key={i} className="skeleton rounded-xl h-32"/>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {themes.map(theme => (
            <div key={theme._id}
              className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group
                ${theme.isActive ? 'border-green-500 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-400 hover:shadow-md'}`}>
              {/* Theme preview */}
              <div className="h-20 relative" style={{ background: theme.bodyBg }}>
                {/* Nav bar preview */}
                <div className="h-5 flex items-center px-2 gap-1" style={{ background: theme.navBg }}>
                  <div className="w-3 h-1.5 rounded-full bg-white/40"/>
                  <div className="w-4 h-1.5 rounded-full bg-white/40"/>
                  <div className="w-3 h-1.5 rounded-full bg-white/40"/>
                </div>
                {/* Card preview */}
                <div className="mx-2 mt-2 rounded p-1.5 shadow-sm" style={{ background: theme.cardBg }}>
                  <div className="h-1.5 rounded w-3/4 mb-1" style={{ background: theme.primary }}/>
                  <div className="h-1 rounded w-full bg-gray-200"/>
                  <div className="h-1 rounded w-2/3 bg-gray-200 mt-0.5"/>
                </div>
                {/* Color dots */}
                <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                  <div className="w-3 h-3 rounded-full border border-white/50" style={{ background: theme.primary }}/>
                  <div className="w-3 h-3 rounded-full border border-white/50" style={{ background: theme.secondary }}/>
                  <div className="w-3 h-3 rounded-full border border-white/50" style={{ background: theme.accent }}/>
                </div>
              </div>

              {/* Info */}
              <div className="p-2.5 bg-white">
                <p className="font-semibold text-xs text-gray-800 truncate">{theme.nameBn}</p>
                <p className="text-xs text-gray-400 truncate">{theme.name}</p>
                <div className="flex gap-1.5 mt-2">
                  <button onClick={() => handleActivate(theme._id)}
                    className={`flex-1 text-xs py-1 rounded font-medium transition-colors flex items-center justify-center gap-1
                      ${theme.isActive ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-500 hover:text-white text-gray-600'}`}>
                    <FaCheck size={9}/> {theme.isActive ? 'সক্রিয়' : 'ব্যবহার করুন'}
                  </button>
                  <button onClick={() => openEdit(theme)}
                    className="bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-500 text-xs py-1 px-2 rounded transition-colors">
                    <FaEdit size={10}/>
                  </button>
                </div>
              </div>

              {theme.isActive && (
                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <FaCheck size={8}/> সক্রিয়
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <FaPalette className="text-primary" size={16}/> থিম কাস্টমাইজ: {form.nameBn}
              </h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={18}/>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Theme names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">থিমের নাম (বাংলা)</label>
                  <input value={form.nameBn||''} onChange={e=>setForm({...form,nameBn:e.target.value})} className="input"/>
                </div>
                <div>
                  <label className="label">Theme Name (English)</label>
                  <input value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} className="input"/>
                </div>
              </div>

              {/* Colors */}
              <div>
                <p className="font-semibold text-sm text-gray-700 mb-3 border-b pb-2">🎨 রং নির্বাচন</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {c('primary')}{c('secondary')}{c('accent')}
                  {c('navBg')}{c('topBarBg')}{c('sectionTitleBg')}
                  {c('footerBg')}{c('bodyBg')}{c('cardBg')}
                  {c('btnPrimary')}{c('btnSecondary')}{c('linkColor')}
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="font-semibold text-sm text-gray-700 mb-3 border-b pb-2">✨ ডিজাইন স্টাইল</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">কর্নার রাউন্ড</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {BORDER_RADIUS.map(r => (
                        <button key={r} onClick={() => setForm({...form,borderRadius:r})}
                          className={`px-2.5 py-1.5 text-xs border rounded transition-colors ${form.borderRadius===r?'border-primary bg-primary/10 text-primary font-semibold':'border-gray-200 hover:border-gray-400'}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">নেভিগেশন স্টাইল</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {NAV_STYLES.map(s => (
                        <button key={s} onClick={() => setForm({...form,navStyle:s})}
                          className={`px-2.5 py-1.5 text-xs border rounded transition-colors ${form.navStyle===s?'border-primary bg-primary/10 text-primary font-semibold':'border-gray-200 hover:border-gray-400'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">কার্ড স্টাইল</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {CARD_STYLES.map(s => (
                        <button key={s} onClick={() => setForm({...form,cardStyle:s})}
                          className={`px-2.5 py-1.5 text-xs border rounded transition-colors ${form.cardStyle===s?'border-primary bg-primary/10 text-primary font-semibold':'border-gray-200 hover:border-gray-400'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <p className="font-semibold text-sm text-gray-700 mb-3 border-b pb-2">👁️ প্রিভিউ</p>
                <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                  <div className="h-6 flex items-center px-3 gap-2" style={{ background: form.navBg }}>
                    <div className="w-4 h-2 rounded bg-white/30"/>
                    <div className="w-5 h-2 rounded bg-white/30"/>
                    <div className="w-4 h-2 rounded bg-white/30"/>
                  </div>
                  <div className="p-3" style={{ background: form.bodyBg }}>
                    <div className="rounded-lg overflow-hidden" style={{ background: form.cardBg, boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>
                      <div className="px-3 py-2 flex items-center gap-2" style={{ background: form.sectionTitleBg }}>
                        <div className="w-3 h-3 bg-white/50 rounded"/>
                        <div className="w-16 h-2 bg-white/60 rounded"/>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="h-2 rounded w-full bg-gray-200"/>
                        <div className="h-2 rounded w-3/4 bg-gray-200"/>
                        <div className="mt-2 flex gap-2">
                          <div className="px-3 py-1 rounded text-xs text-white font-medium" style={{ background: form.btnPrimary }}>বাটন</div>
                          <div className="px-3 py-1 rounded text-xs text-white font-medium" style={{ background: form.btnSecondary }}>বাটন ২</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-8 flex items-center px-3" style={{ background: form.footerBg }}>
                    <div className="w-20 h-2 bg-white/20 rounded"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end p-5 border-t">
              <button onClick={() => setEditing(null)} className="btn-outline text-sm">বাতিল</button>
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
