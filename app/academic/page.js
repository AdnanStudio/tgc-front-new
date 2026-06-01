import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaBookOpen, FaCalendarAlt, FaClock, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

export const metadata = {
  title: 'একাডেমিক - মাদরাসাতু দারিল কুরআন',
};

export default function AcademicPage() {
  return (
    <>
      <Navbar />
      <div className="page-header">
        <h1 className="text-3xl font-bold mb-2">একাডেমিক</h1>
        <p className="text-green-200">শিক্ষা কার্যক্রম ও সময়সূচী</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'routine', icon: FaClock, title: 'উচ্চ মাধ্যমিক রুটিন', desc: 'একাদশ ও দ্বাদশ শ্রেণির ক্লাস রুটিন', color: 'bg-blue-600' },
            { id: 'schedule', icon: FaCalendarAlt, title: 'ক্লাস সময়সূচী', desc: 'প্রতিদিনের ক্লাস সময়সূচী ও বিরতি', color: 'bg-green-600' },
            { id: 'syllabus', icon: FaBookOpen, title: 'পাঠ পরিকল্পনা', desc: 'বিষয়ভিত্তিক পাঠ পরিকল্পনা ও সিলেবাস', color: 'bg-purple-600' },
            { id: 'calendar', icon: FaCalendarAlt, title: 'একাডেমিক ক্যালেন্ডার', desc: 'বার্ষিক শিক্ষা পরিকল্পনা ও ছুটির তালিকা', color: 'bg-orange-600' },
            { id: 'departments', icon: FaBookOpen, title: 'বিভাগ পরিচিতি', desc: 'বিজ্ঞান, মানবিক ও ব্যবসায় বিভাগ', color: 'bg-teal-600' },
            { id: 'downloads', icon: FaDownload, title: 'ডাউনলোড', desc: 'বিভিন্ন একাডেমিক ফর্ম ও ডকুমেন্ট', color: 'bg-red-600' },
          ].map(({ id, icon: Icon, title, desc, color }) => (
            <div key={id} id={id} className="card p-6 hover:-translate-y-1 transition-transform group">
              <div className={`${color} text-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
              <Link href="/notice" className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                বিস্তারিত →
              </Link>
            </div>
          ))}
        </div>

        {/* Departments table */}
        <div className="mt-8 card overflow-hidden" id="departments">
          <div className="section-title bg-primary">বিভাগভিত্তিক তথ্য</div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>বিভাগ</th>
                  <th>বিষয়সমূহ</th>
                  <th className="hidden md:table-cell">অনুমোদিত আসন</th>
                  <th className="hidden md:table-cell">শিক্ষক সংখ্যা</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dept: 'বিজ্ঞান', subjects: 'পদার্থ, রসায়ন, জীববিজ্ঞান, গণিত', seats: '৮০', teachers: '৮' },
                  { dept: 'মানবিক', subjects: 'বাংলা, ইংরেজি, ইতিহাস, ইসলামের ইতিহাস', seats: '১৫০', teachers: '১২' },
                  { dept: 'ব্যবসায় শিক্ষা', subjects: 'হিসাববিজ্ঞান, ব্যবসায় সংগঠন, ফিন্যান্স', seats: '১২০', teachers: '৮' },
                ].map(row => (
                  <tr key={row.dept}>
                    <td className="font-medium">{row.dept}</td>
                    <td className="text-sm text-gray-600">{row.subjects}</td>
                    <td className="hidden md:table-cell text-center font-bold text-primary">{row.seats}</td>
                    <td className="hidden md:table-cell text-center">{row.teachers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
