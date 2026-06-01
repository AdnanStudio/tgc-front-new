import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Link from 'next/link';
import { FaGraduationCap, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';

export const metadata = { title: 'ভর্তি - মাদরাসাতু দারিল কুরআন' };

export default function AdmissionPage() {
  return (
    <>
      <Navbar />
      <div className="page-header">
        <h1 className="text-3xl font-bold mb-2">ভর্তি তথ্য</h1>
        <p className="text-green-200">একাদশ শ্রেণিতে ভর্তি বিজ্ঞপ্তি ও তথ্য</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Notice */}
            <div className="card p-6 border-l-4 border-yellow-500 bg-yellow-50">
              <h2 className="font-bold text-yellow-700 mb-2 flex items-center gap-2">
                <FaGraduationCap /> ভর্তি বিজ্ঞপ্তি ২০২৬-২৭
              </h2>
              <p className="text-sm text-gray-700">
                মাদরাসাতু দারিল কুরআন একাদশ শ্রেণিতে বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা বিভাগে ভর্তি চলছে। আগ্রহী শিক্ষার্থীরা অনলাইনে আবেদন করুন।
              </p>
              <a href="https://xiclassadmission.gov.bd" target="_blank" rel="noopener noreferrer"
                className="mt-3 btn-primary inline-flex items-center gap-2 text-sm py-2">
                <FaExternalLinkAlt size={12} /> অনলাইনে আবেদন করুন
              </a>
            </div>

            {/* Eligibility */}
            <div className="card p-6" id="eligibility">
              <h2 className="text-xl font-bold text-primary mb-4 border-b pb-2">ভর্তির যোগ্যতা</h2>
              <div className="space-y-3">
                {[
                  { dept: 'বিজ্ঞান', req: 'SSC / সমমান পরীক্ষায় GPA ৩.৫০ বা তার বেশি' },
                  { dept: 'মানবিক', req: 'SSC / সমমান পরীক্ষায় GPA ২.৫০ বা তার বেশি' },
                  { dept: 'ব্যবসায় শিক্ষা', req: 'SSC / সমমান পরীক্ষায় GPA ২.৫০ বা তার বেশি' },
                ].map(({ dept, req }) => (
                  <div key={dept} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCheckCircle className="text-primary mt-0.5 flex-shrink-0" size={16} />
                    <div>
                      <span className="font-semibold text-sm text-gray-700">{dept}: </span>
                      <span className="text-sm text-gray-600">{req}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seats */}
            <div className="card overflow-hidden" id="seats">
              <div className="section-title bg-primary">শ্রেণিভিত্তিক অনুমোদিত আসন</div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr><th>বিভাগ</th><th className="text-center">অনুমোদিত আসন</th><th className="text-center">বর্তমান ভর্তি</th><th className="text-center">শূন্য আসন</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { dept: 'বিজ্ঞান', total: 80, enrolled: 72, empty: 8 },
                      { dept: 'মানবিক', total: 150, enrolled: 138, empty: 12 },
                      { dept: 'ব্যবসায় শিক্ষা', total: 120, enrolled: 110, empty: 10 },
                    ].map(r => (
                      <tr key={r.dept}>
                        <td className="font-medium">{r.dept}</td>
                        <td className="text-center font-bold text-primary">{r.total}</td>
                        <td className="text-center text-blue-600">{r.enrolled}</td>
                        <td className="text-center text-green-600 font-bold">{r.empty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-bold text-primary mb-3 text-sm border-b pb-2">প্রয়োজনীয় কাগজপত্র</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {['SSC মার্কশিট', 'SSC সনদপত্র', 'রেজিস্ট্রেশন কার্ড', 'পাসপোর্ট সাইজ ছবি (৩ কপি)', 'জন্ম নিবন্ধন', 'অভিভাবকের NID কপি'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <FaCheckCircle className="text-primary flex-shrink-0" size={11} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 bg-primary text-white">
              <h3 className="font-bold mb-3 text-sm">যোগাযোগ</h3>
              <p className="text-xs text-green-100 leading-relaxed">ভর্তি সংক্রান্ত যেকোনো তথ্যের জন্য কলেজ অফিসে যোগাযোগ করুন।</p>
              <Link href="/contact" className="mt-3 block bg-white text-primary text-center text-sm py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                যোগাযোগ করুন
              </Link>
            </div>

            <div className="card p-5">
              <h3 className="font-bold text-primary mb-3 text-sm border-b pb-2">গুরুত্বপূর্ণ তারিখ</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'আবেদন শুরু', date: '০১ জুলাই ২০২৬' },
                  { label: 'আবেদন শেষ', date: '৩১ জুলাই ২০২৬' },
                  { label: 'ভর্তি শুরু', date: '১ আগস্ট ২০২৬' },
                  { label: 'ক্লাস শুরু', date: '১৫ আগস্ট ২০২৬' },
                ].map(({ label, date }) => (
                  <div key={label} className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-600">{label}:</span>
                    <span className="font-semibold text-primary">{date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
