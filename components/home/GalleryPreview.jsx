'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaImages, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryAPI } from '../../lib/api';

export default function GalleryPreview() {
  const [images,   setImages]   = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    galleryAPI.getAll({ isFeatured: true, limit: 6 })
      .then(r => setImages(r.data || []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const navigate = dir => setLightbox(l => {
    const n = l + dir;
    if (n < 0) return images.length - 1;
    if (n >= images.length) return 0;
    return n;
  });

  if (!loading && images.length === 0) return null;

  return (
    <section>
      <div className="card overflow-hidden">
        <div className="section-title bg-primary">
          <FaImages className="text-yellow-300" size={16}/>
          <span>Photo Gallery</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-1 p-1">
            {[...Array(6)].map((_,i)=>(
              <div key={i} className="bg-gray-200 animate-pulse rounded" style={{aspectRatio:'4/3'}}/>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 p-1">
            {images.map((img, i) => (
              <motion.button key={img._id}
                whileHover={{ scale:1.02 }}
                onClick={() => setLightbox(i)}
                className="relative overflow-hidden bg-gray-200 rounded"
                style={{ aspectRatio:'4/3' }}>
                <Image
                  src={img.image.url}
                  alt={img.titleBn || img.title || 'Gallery'}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  sizes="200px"
                />
              </motion.button>
            ))}
          </div>
        )}

        <div className="p-3 bg-gray-50 border-t text-center">
          <Link href="/gallery" className="btn-primary text-sm inline-flex items-center gap-2 py-1.5">
            সব ছবি দেখুন »
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white hover:text-red-400 z-10" onClick={() => setLightbox(null)}>
              <FaTimes size={24}/>
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-primary p-3 rounded-full z-10"
              onClick={e=>{ e.stopPropagation(); navigate(-1); }}>
              <FaChevronLeft size={18}/>
            </button>
            <motion.div initial={{ scale:0.8 }} animate={{ scale:1 }}
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={e=>e.stopPropagation()}>
              <Image src={images[lightbox].image.url}
                alt={images[lightbox].titleBn || images[lightbox].title || ''}
                width={1200} height={800}
                className="object-contain max-h-[85vh] mx-auto rounded"/>
              <p className="text-white text-center mt-2 text-sm">{images[lightbox].titleBn || images[lightbox].title}</p>
              <p className="text-gray-400 text-center text-xs mt-1">{lightbox+1} / {images.length}</p>
            </motion.div>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-primary p-3 rounded-full z-10"
              onClick={e=>{ e.stopPropagation(); navigate(1); }}>
              <FaChevronRight size={18}/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
