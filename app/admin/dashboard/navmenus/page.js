'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaGripVertical, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { navMenuAPI } from '../../../../lib/api';

const INIT = { label:'', labelBn:'', href:'/', isExternal:false, isActive:true, order:0 };
const CHILD_INIT = { label:'', labelBn:'', href:'/', isExternal:false, isActive:true, order:0 };

export default function AdminNavMenus() {
  const [menus,   setMenus]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(INIT);
  const [children,setChildren]= useState([]);
  const [saving,  setSaving]  = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await navMenuAPI.getAllAdmin();
      if (!r.data?.length) { await navMenuAPI.seed(); const r2 = await navMenuAPI.getAllAdmin(); setMenus(r2.data||[]); }
      else setMenus(r.data||[]);
    } catch { toast.error('লোড ব্যর্থ'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(INIT); setChildren([]); setModal(true); };
  const openEdit   = m  => { setEditing(m._id); setForm({ label:m.label, labelBn:m.labelBn, href:m.href||'/', isExternal:m.isExternal||false, isActive:m.isActive!==false, order:m.order||0 }); setChildren(m.children||[]); setModal(true); };

  const handleSave = async () => {
    if (!form.labelBn) return toast.error('বাংলা নাম দিন');
    setSaving(true);
    try {
      const payload = { ...form, children };
      if (editing) { await navMenuAPI.update(editing, payload); toast.success('আপডেট হয়েছে ✅'); }
      else         { await navMenuAPI.create(payload);           toast.success('মেনু যোগ হয়েছে ✅'); }
      setModal(false); fetch();
    } catch (e) { toast.error(e.message || 'সংরক্ষণ ব্যর্থ'); }
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!confirm('এই মেনুটি মুছে ফেলতে চান?')) return;
    try { await navMenuAPI.delete(id); toast.success('মুছে গেছে'); fetch(); }
    catch { toast.error('মুছতে ব্যর্থ'); }
  };

  const handleToggle = async (m) => {
    try { await navMenuAPI.update(m._id, { ...m, isActive:!m.isActive }); fetch(); }
    catch { toast.error('পরিবর্তন ব্যর্থ'); }
  };

  const addChild    = ()      => setChildren([...children, { ...CHILD_INIT, _id: Date.now().toString() }]);
  const updateChild = (i,k,v) => { const c=[...children]; c[i]={...c[i],[k]:v}; setChildren(c); };
  const removeChild = i       => setChildren(children.filter((_,idx)=>idx!==i));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-700">নেভিগেশন মেনু</h2>
          <p className="text-xs text-gray-500 mt-0.5">ওয়েবসাইটের মেনু যোগ, পরিবর্তন ও সরান</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus size={12}/> নতুন মেনু
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-12"><div className="spinner"/></div> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>বাংলা নাম</th><th>English</th><th className="hidden md:table-cell">লিংক</th><th className="hidden md:table-cell">সাব-মেনু</th><th className="hidden md:table-cell">ক্রম</th><th className="text-center w-28">কার্যক্রম</th></tr>
              </thead>
              <tbody>
                {menus.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">কোনো মেনু নেই</td></tr>
                ) : menus.map((m,i) => (
                  <tr key={m._id} className={!m.isActive ? 'opacity-50' : ''}>
                    <td className="text-gray-400">{i+1}</td>
                    <td className="font-medium">{m.labelBn}</td>
                    <td className="text-gray-500">{m.label}</td>
                    <td className="hidden md:table-cell text-xs text-blue-600 font-mono">{m.href}</td>
                    <td className="hidden md:table-cell">
                      {m.children?.length > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{m.children.length}টি</span>
                      )}
                    </td>
                    <td className="hidden md:table-cell text-gray-500">{m.order}</td>
                    <td>
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => handleToggle(m)}
                          className={`p-1.5 rounded transition-colors ${m.isActive?'text-green-600 hover:bg-green-50':'text-red-400 hover:bg-red-50'}`}
                          title={m.isActive?'নিষ্ক্রিয় করুন':'সক্রিয় করুন'}>
                          {m.isActive ? <FaToggleOn size={16}/> : <FaToggleOff size={16}/>}
                        </button>
                        <button onClick={() => openEdit(m)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <FaEdit size={13}/>
                        </button>
                        <button onClick={() => handleDelete(m._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-700">{editing?'মেনু সম্পাদনা':'নতুন মেনু যোগ'}</h3>
              <button onClick={()=>setModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">বাংলা নাম *</label>
                  <input value={form.labelBn} onChange={e=>setForm({...form,labelBn:e.target.value})} className="input" placeholder="হোম"/>
                </div>
                <div>
                  <label className="label">English Label</label>
                  <input value={form.label} onChange={e=>setForm({...form,label:e.target.value})} className="input" placeholder="Home"/>
                </div>
                <div>
                  <label className="label">লিংক (URL)</label>
                  <input value={form.href} onChange={e=>setForm({...form,href:e.target.value})} className="input" placeholder="/about"/>
                </div>
                <div>
                  <label className="label">ক্রম নম্বর</label>
                  <input type="number" value={form.order} onChange={e=>setForm({...form,order:+e.target.value})} className="input"/>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isExternal} onChange={e=>setForm({...form,isExternal:e.target.checked})} className="rounded"/>
                  বাইরের লিংক (নতুন ট্যাব)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="rounded"/>
                  সক্রিয়
                </label>
              </div>

              {/* Sub-menus */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm text-gray-700">সাব-মেনু (ড্রপডাউন)</p>
                  <button onClick={addChild} className="flex items-center gap-1.5 text-primary text-sm hover:underline">
                    <FaPlus size={11}/> সাব-মেনু যোগ
                  </button>
                </div>
                {children.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-3 bg-gray-50 rounded-lg">কোনো সাব-মেনু নেই</p>
                ) : (
                  <div className="space-y-2">
                    {children.map((child, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg border items-end">
                        <div>
                          <label className="label text-xs">বাংলা নাম</label>
                          <input value={child.labelBn||''} onChange={e=>updateChild(i,'labelBn',e.target.value)} className="input text-sm" placeholder="ইতিহাস"/>
                        </div>
                        <div>
                          <label className="label text-xs">লিংক</label>
                          <input value={child.href||''} onChange={e=>updateChild(i,'href',e.target.value)} className="input text-sm" placeholder="/about"/>
                        </div>
                        <button onClick={()=>removeChild(i)} className="text-red-400 hover:text-red-600 p-2 flex-shrink-0 self-end">
                          <FaTimes size={13}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end p-5 border-t">
              <button onClick={()=>setModal(false)} className="btn-outline text-sm">বাতিল</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving?<><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> সংরক্ষণ...</>:<><FaSave size={12}/> সংরক্ষণ</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
