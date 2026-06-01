'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaPlus, FaTrash, FaImage, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { galleryAPI } from '../../../../lib/api';

const CATEGORIES = ['campus','event','sports','cultural','academic','other'];
const catLabels   = { campus:'ক্যাম্পাস', event:'ইভেন্ট', sports:'খেলাধুলা', cultural:'সাংস্কৃতিক', academic:'একাডেমিক', other:'অন্যান্য' };

export default function AdminGallery() {
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState({ titleBn:'', category:'campus', isSlider:false, isFeatured:false });
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState('');
  const [page,      setPage]      = useState(1);
  const [pagination,setPagination]= useState({});
  const fileRef = useRef();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const r = await galleryAPI.getAll({ page, limit:18 });
      setImages(r.data || []);
      setPagination(r.pagination || {});
    } catch { toast.error('লোড ব্যর্থ হয়েছে'); }
    setLoading(false);
  };
  useEffect(()=>{ fetchImages(); }, [page]);

  const handleFileChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return toast.error('একটি ছবি বেছে নিন');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image',   file);
      fd.append('titleBn', form.titleBn || 'ছবি');
      fd.append('title',   form.titleBn || 'ছবি');
      fd.append('category',form.category);
      fd.append('isSlider',  String(form.isSlider));
      fd.append('isFeatured',String(form.isFeatured));
      await galleryAPI.upload(fd);
      toast.success('ছবি আপলোড হয়েছে ✅');
      setModal(false);
      setFile(null);
      setPreview('');
      setForm({ titleBn:'', category:'campus', isSlider:false, isFeatured:false });
      fetchImages();
    } catch (e) { toast.error(e.message || 'আপলোড ব্যর্থ হয়েছে'); }
    setUploading(false);
  };

  const handleDelete = async id => {
    if (!confirm('এই ছবিটি মুছে ফেলতে চান?')) return;
    try { await galleryAPI.delete(id); toast.success('ছবি মুছে গেছে'); fetchImages(); }
    catch { toast.error('মুছতে ব্যর্থ হয়েছে'); }
  };

  const handleToggle = async (id, field, current) => {
    try { await galleryAPI.update(id, { [field]: !current }); fetchImages(); }
    catch { toast.error('আপডেট ব্যর্থ'); }
  };

  const sliderCount   = images.filter(i=>i.isSlider).length;
  const featuredCount = images.filter(i=>i.isFeatured).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-700">গ্যালারি ব্যবস্থাপনা</h2>
        <button onClick={()=>setModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus size={12}/> ছবি আপলোড
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-primary">{pagination.total||images.length}</div>
          <div className="text-xs text-gray-500">মোট ছবি</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{sliderCount}</div>
          <div className="text-xs text-gray-500">স্লাইডারে</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-purple-600">{featuredCount}</div>
          <div className="text-xs text-gray-500">হোমপেজে</div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 flex flex-wrap gap-4">
        <span>🎠 <strong>স্লাইডার</strong> = হিরো ব্যানারে দেখাবে</span>
        <span>⭐ <strong>হোমপেজ</strong> = গ্যালারি প্রিভিউতে দেখাবে</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(12)].map((_,i)=>(
            <div key={i} className="rounded-lg bg-gray-200 animate-pulse" style={{aspectRatio:'4/3'}}/>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map((img, i) => (
            <motion.div key={img._id}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.02 }}
              className="relative group rounded-lg overflow-hidden bg-gray-100 border hover:shadow-md transition-shadow">
              <div style={{ paddingTop:'75%' }} className="relative">
                <Image src={img.image.url} alt={img.titleBn||img.title||''} fill className="object-cover" sizes="160px"/>
              </div>

              {/* Hover overlay — delete */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={()=>handleDelete(img._id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                  <FaTrash size={12}/>
                </button>
              </div>

              {/* Badges top */}
              <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                {img.isSlider   && <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">🎠</span>}
                {img.isFeatured && <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">⭐</span>}
              </div>

              {/* Bottom info + toggles */}
              <div className="p-2 bg-white">
                <p className="text-xs text-gray-600 truncate mb-1.5">{img.titleBn||img.title||'ছবি'}</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={()=>handleToggle(img._id,'isSlider',img.isSlider)}
                    title={img.isSlider?'স্লাইডার থেকে সরাও':'স্লাইডারে যোগ করো'}
                    className={`flex-1 text-xs py-1 rounded font-medium transition-colors ${img.isSlider?'bg-blue-500 text-white':'bg-gray-100 text-gray-500 hover:bg-blue-100'}`}>
                    {img.isSlider ? '🎠 ON' : '🎠'}
                  </button>
                  <button
                    onClick={()=>handleToggle(img._id,'isFeatured',img.isFeatured)}
                    title={img.isFeatured?'হোমপেজ থেকে সরাও':'হোমপেজে দেখাও'}
                    className={`flex-1 text-xs py-1 rounded font-medium transition-colors ${img.isFeatured?'bg-purple-500 text-white':'bg-gray-100 text-gray-500 hover:bg-purple-100'}`}>
                    {img.isFeatured ? '⭐ ON' : '⭐'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({length:pagination.pages}).map((_,i)=>(
            <button key={i} onClick={()=>setPage(i+1)}
              className={`w-9 h-9 rounded text-sm ${page===i+1?'bg-primary text-white':'bg-white border hover:bg-primary/10'}`}>
              {i+1}
            </button>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-700">ছবি আপলোড</h3>
              <button onClick={()=>{ setModal(false); setFile(null); setPreview(''); }}
                className="text-gray-400 hover:text-gray-600"><FaTimes size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Image drop zone */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={()=>fileRef.current?.click()}>
                {preview ? (
                  <div className="relative" style={{ paddingTop:'56%' }}>
                    <Image src={preview} alt="Preview" fill className="object-cover" sizes="400px"/>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <FaImage size={36} className="mb-2"/>
                    <p className="text-sm font-medium">ছবি বেছে নিতে ক্লিক করুন</p>
                    <p className="text-xs mt-1 text-gray-300">JPG, PNG, WebP — সর্বোচ্চ 5MB</p>
                  </div>
                )}
                <input type="file" ref={fileRef} accept="image/*" onChange={handleFileChange} className="hidden"/>
              </div>

              <div>
                <label className="label">ছবির শিরোনাম (ঐচ্ছিক)</label>
                <input value={form.titleBn} onChange={e=>setForm({...form,titleBn:e.target.value})}
                  className="input" placeholder="ছবির বিবরণ বা শিরোনাম..."/>
              </div>

              <div>
                <label className="label">বিভাগ</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input">
                  {CATEGORIES.map(c=><option key={c} value={c}>{catLabels[c]}</option>)}
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.isSlider} onChange={e=>setForm({...form,isSlider:e.target.checked})}
                    className="rounded text-primary w-4 h-4"/>
                  <span>🎠 হিরো স্লাইডারে যোগ করুন</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})}
                    className="rounded text-primary w-4 h-4"/>
                  <span>⭐ হোমপেজে দেখান</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 justify-end p-5 border-t">
              <button onClick={()=>{ setModal(false); setFile(null); setPreview(''); }} className="btn-outline text-sm">বাতিল</button>
              <button onClick={handleUpload} disabled={uploading||!file} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
                {uploading?<><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> আপলোড...</>:'✅ আপলোড করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
