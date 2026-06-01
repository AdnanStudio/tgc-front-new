'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaUserGraduate, FaMale, FaFemale } from 'react-icons/fa';
import { studentsAPI } from '../../lib/api';

export default function StudentsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentsAPI.get().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-header">
        <h1 className="text-3xl font-bold mb-2">শ্রেণি ও লিঙ্গভিত্তিক শিক্ষার্থীর তথ্য</h1>
        <p className="text-green-200">বর্তমান শিক্ষার্থীদের পরিসংখ্যান</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : stats ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="card p-5 text-center border-t-4 border-primary">
                <FaUserGraduate className="mx-auto text-primary mb-2" size={32} />
                <div className="text-3xl font-bold text-primary">{stats.totalStudents?.toLocaleString('bn-BD')}</div>
                <div className="text-sm text-gray-600 mt-1">মোট শিক্ষার্থী</div>
              </div>
              <div className="card p-5 text-center border-t-4 border-blue-500">
                <FaMale className="mx-auto text-blue-500 mb-2" size={32} />
                <div className="text-3xl font-bold text-blue-500">{stats.totalMale?.toLocaleString('bn-BD')}</div>
                <div className="text-sm text-gray-600 mt-1">ছাত্র</div>
              </div>
              <div className="card p-5 text-center border-t-4 border-pink-500">
                <FaFemale className="mx-auto text-pink-500 mb-2" size={32} />
                <div className="text-3xl font-bold text-pink-500">{stats.totalFemale?.toLocaleString('bn-BD')}</div>
                <div className="text-sm text-gray-600 mt-1">ছাত্রী</div>
              </div>
            </div>

            {/* Academic Year */}
            <div className="mb-4 text-sm text-gray-600">
              <span className="font-medium">শিক্ষাবর্ষ:</span> {stats.academicYear}
            </div>

            {/* Class-wise table */}
            {stats.classes?.length > 0 && (
              <div className="card overflow-hidden">
                <div className="section-title bg-primary">শ্রেণিভিত্তিক শিক্ষার্থীর সংখ্যা</div>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>শ্রেণি</th>
                        <th className="text-center">ছাত্র (পুরুষ)</th>
                        <th className="text-center">ছাত্রী (মহিলা)</th>
                        <th className="text-center">মোট</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.classes.map(cls => (
                        <tr key={cls.className}>
                          <td className="font-medium">{cls.classNameBn || cls.className}</td>
                          <td className="text-center text-blue-600 font-medium">{cls.male}</td>
                          <td className="text-center text-pink-600 font-medium">{cls.female}</td>
                          <td className="text-center font-bold text-primary">{cls.total}</td>
                        </tr>
                      ))}
                      <tr className="bg-primary/10 font-bold">
                        <td>মোট</td>
                        <td className="text-center text-blue-700">{stats.totalMale}</td>
                        <td className="text-center text-pink-700">{stats.totalFemale}</td>
                        <td className="text-center text-primary">{stats.totalStudents}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <FaUserGraduate className="mx-auto mb-3 text-gray-300" size={48} />
            <p>শিক্ষার্থীর তথ্য পাওয়া যায়নি</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
