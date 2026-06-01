'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaTimes, FaChevronLeft, FaChevronRight, FaImages } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryAPI } from '../../lib/api';

const CATEGORIES = [
  { value:'',         label:'সকল' },
  { value:'campus',   label:'ক্যাম্পাস' },
  { value:'event',    label:'ইভেন্ট' },
  { value:'sports',   label:'খেলাধুলা' },
  { value:'cultural', label:'সাংস্কৃতিক' },
  { value:'academic', label:'একাডেমিক' },
  { value:'other',    label:'অন্যান্য' },
];

export default function GalleryPage() {
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [lightbox,  setLightbox]  = useState(null);
  const [category,  setCategory]  = useState('');
  const [page,      setPage]      = useState(1);
  const [pagination,setPagination]= useState({});

  const fetchImages = async () => {
    setLoading(true);
    try {
      // category '' means no filter — pass only if non-empty
      const params = { page, limit: 18 };
      if (category) params.category = category;
      const res = await galleryAPI.getAll(params);
      setImages(res.data || []);
      setPagination(res.pagination || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, [category, page]);

  const navigate = dir => setLightbox(l => {
    const n = l + dir;
    if (n < 0) return images.length - 1;
    if (n >= images.length) return 0;
    return n;
  });

  return (
    <>
      <Navbar/>
      <div className="page-header">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FaImages className="text-yellow-300" size={28}/>
          <h1 className="text-3xl font-bold">ফটো গ্যালারি</h1>
        </div>
        <p className="text-green-200">কলেজের স্মরণীয় মুহূর্তসমূহ</p>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Category filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c.value}
              onClick={() => { setCategory(c.value); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${category === c.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border hover:bg-primary/10 hover:border-primary/30'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[...Array(12)].map((_,i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg" style={{aspectRatio:'4/3'}}/>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FaImages size={48} className="mx-auto mb-3 text-gray-200"/>
            <p>কোনো ছবি পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {images.map((img, i) => (
              <motion.div key={img._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="relative overflow-hidden rounded-lg cursor-pointer bg-gray-100 group"
                style={{ aspectRatio:'4/3' }}
                onClick={() => setLightbox(i)}>
                <Image
                  src={img.image.url}
                  alt={img.titleBn || img.title || ''}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs font-medium text-center px-2 truncate w-full">
                    {img.titleBn || img.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
              className="px-3 py-2 rounded border text-sm disabled:opacity-40 hover:bg-primary/10 transition-colors">
              ← আগের
            </button>
            {Array.from({length:pagination.pages}).map((_,i)=>(
              <button key={i} onClick={()=>setPage(i+1)}
                className={`w-9 h-9 rounded text-sm transition-colors ${page===i+1?'bg-primary text-white':'bg-white border hover:bg-primary/10'}`}>
                {i+1}
              </button>
            ))}
            <button disabled={page===pagination.pages} onClick={()=>setPage(p=>p+1)}
              className="px-3 py-2 rounded border text-sm disabled:opacity-40 hover:bg-primary/10 transition-colors">
              পরের →
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white hover:text-red-400 z-10 bg-black/40 p-2 rounded-full"
              onClick={() => setLightbox(null)}>
              <FaTimes size={20}/>
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-primary p-3 rounded-full z-10 transition-colors"
              onClick={e=>{e.stopPropagation(); navigate(-1);}}>
              <FaChevronLeft size={18}/>
            </button>
            <motion.div
              initial={{ scale:0.85 }} animate={{ scale:1 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={e=>e.stopPropagation()}>
              <Image
                src={images[lightbox].image.url}
                alt={images[lightbox].titleBn || images[lightbox].title || ''}
                width={1200} height={800}
                className="object-contain max-h-[85vh] mx-auto rounded-lg"
              />
              <p className="text-white text-center mt-3 text-sm">
                {images[lightbox].titleBn || images[lightbox].title}
              </p>
              <p className="text-gray-400 text-center text-xs mt-1">
                {lightbox+1} / {images.length}
              </p>
            </motion.div>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-primary p-3 rounded-full z-10 transition-colors"
              onClick={e=>{e.stopPropagation(); navigate(1);}}>
              <FaChevronRight size={18}/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer/>
    </>
  );
}
