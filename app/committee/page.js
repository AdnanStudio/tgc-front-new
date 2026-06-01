'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaUsers, FaUserTie } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { committeeAPI } from '../../lib/api';

export default function CommitteePage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    committeeAPI.getAll().then(r => setMembers(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const chairman = members.filter(m => m.type === 'chairman');
  const others = members.filter(m => m.type !== 'chairman');

  return (
    <>
      <Navbar />
      <div className="page-header">
        <h1 className="text-3xl font-bold mb-2">ব্যবস্থাপনা কমিটি</h1>
        <p className="text-green-200">কলেজ পরিচালনা কমিটির সদস্যবৃন্দ</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <>
            {/* Chairman */}
            {chairman.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <FaUserTie /> সভাপতি
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {chairman.map((m, i) => (
                    <motion.div key={m._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="card p-5 text-center w-56 border-t-4 border-primary">
                      <div className="relative w-24 h-28 mx-auto mb-3">
                        {m.photo?.url ? (
                          <Image src={m.photo.url} alt={m.name} fill className="object-cover rounded" sizes="96px" />
                        ) : (
                          <div className="w-24 h-28 bg-primary/10 rounded flex items-center justify-center">
                            <FaUserTie className="text-primary/40" size={36} />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm">{m.nameBn || m.name}</h3>
                      <p className="text-xs text-primary font-medium mt-0.5">{m.designationBn || m.designation}</p>
                      {m.phone && <p className="text-xs text-gray-500 mt-1">{m.phone}</p>}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Other members */}
            {others.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <FaUsers /> কমিটির সদস্যবৃন্দ
                </h2>
                <div className="card overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="w-12">ক্রমিক</th>
                        <th>নাম</th>
                        <th>পদবী</th>
                        <th className="hidden md:table-cell">মোবাইল</th>
                        <th className="hidden md:table-cell">ইমেইল</th>
                      </tr>
                    </thead>
                    <tbody>
                      {others.map((m, i) => (
                        <tr key={m._id}>
                          <td className="text-center">{i + 1}</td>
                          <td>
                            <div className="flex items-center gap-3">
                              {m.photo?.url ? (
                                <div className="relative w-8 h-8 flex-shrink-0">
                                  <Image src={m.photo.url} alt={m.name} fill className="object-cover rounded-full" sizes="32px" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <FaUserTie className="text-primary/50" size={12} />
                                </div>
                              )}
                              <span className="font-medium text-sm">{m.nameBn || m.name}</span>
                            </div>
                          </td>
                          <td className="text-sm text-gray-600">{m.designationBn || m.designation}</td>
                          <td className="hidden md:table-cell text-sm text-gray-500">{m.phone || '—'}</td>
                          <td className="hidden md:table-cell text-sm text-gray-500">{m.email || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {members.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <FaUsers className="mx-auto mb-3 text-gray-300" size={48} />
                <p>কমিটির তথ্য পাওয়া যায়নি</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
