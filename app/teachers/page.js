'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaPhone, FaEnvelope, FaUserTie } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { teachersAPI } from '../../lib/api';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    teachersAPI.getAll().then(r => setTeachers(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? teachers : teachers.filter(t => t.employeeType === filter);

  return (
    <>
      <Navbar />
      <div className="page-header">
        <h1 className="text-3xl font-bold mb-2">শিক্ষক-কর্মচারী তথ্য</h1>
        <p className="text-green-200">আমাদের অভিজ্ঞ শিক্ষকমণ্ডলী</p>
      </div>
      <div className="container mx-auto px-4 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { value: 'all', label: 'সকল শিক্ষক' },
            { value: 'mpo', label: 'MPO শিক্ষক' },
            { value: 'non-mpo', label: 'Non-MPO' },
          ].map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${filter === f.value ? 'bg-primary text-white' : 'bg-white border hover:bg-primary/10'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((teacher, i) => (
              <motion.div key={teacher._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card overflow-hidden text-center hover:-translate-y-1 transition-transform">
                <div className="relative bg-gray-100" style={{ paddingTop: '120%' }}>
                  {teacher.photo?.url ? (
                    <Image src={teacher.photo.url} alt={teacher.name} fill className="object-cover" sizes="200px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                      <FaUserTie className="text-primary/40" size={48} />
                    </div>
                  )}
                  {teacher.isPrincipal && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded">অধ্যক্ষ</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm text-gray-800 line-clamp-1">
                    {teacher.nameBn || teacher.name}
                  </h3>
                  <p className="text-xs text-primary font-medium mt-0.5 line-clamp-1">
                    {teacher.designationBn || teacher.designation}
                  </p>
                  {teacher.subject && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{teacher.subject}</p>
                  )}
                  {teacher.qualification && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{teacher.qualification}</p>
                  )}
                  <div className="mt-2 flex justify-center gap-3">
                    {teacher.phone && (
                      <a href={`tel:${teacher.phone}`} className="text-green-600 hover:text-green-700 transition-colors">
                        <FaPhone size={12} />
                      </a>
                    )}
                    {teacher.email && (
                      <a href={`mailto:${teacher.email}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                        <FaEnvelope size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
