'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaQuoteLeft, FaInfoCircle } from 'react-icons/fa';
import { settingsAPI } from '../../lib/api';

export default function AboutPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsAPI.get().then(r => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-header">
        <h1 className="text-3xl font-bold mb-2">প্রতিষ্ঠান পরিচিতি</h1>
        <p className="text-green-200">আমাদের ইতিহাস, লক্ষ্য ও উদ্দেশ্য</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* History */}
            <div className="card p-6" id="history">
              <h2 className="text-xl font-bold text-primary mb-4 border-b-2 border-primary/20 pb-2 flex items-center gap-2">
                <FaInfoCircle size={18} /> কলেজের ইতিহাস
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {settings?.aboutHistory || `এই কলেজটি এলাকার শিক্ষার্থীদের উচ্চ মাধ্যমিক শিক্ষার সুযোগ প্রদান করে আসছে। প্রতিষ্ঠার পর থেকে কলেজটি শিক্ষার মান উন্নয়নে নিরলসভাবে কাজ করে যাচ্ছে।`}
              </p>
            </div>

            {/* Objectives */}
            <div className="card p-6" id="objectives">
              <h2 className="text-xl font-bold text-primary mb-4 border-b-2 border-primary/20 pb-2">লক্ষ্য ও উদ্দেশ্য</h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {settings?.objectives || `আমাদের লক্ষ্য হলো শিক্ষার্থীদের মানসম্পন্ন শিক্ষা প্রদান করা এবং তাদের নৈতিক, সামাজিক ও মানবিক মূল্যবোধ গড়ে তোলা। একটি আলোকিত ও দক্ষ জাতি গঠনে আমরা প্রতিশ্রুতিবদ্ধ।`}
              </p>
            </div>

            {/* Vision Mission */}
            <div className="card p-6" id="vision">
              <h2 className="text-xl font-bold text-primary mb-4 border-b-2 border-primary/20 pb-2">ভিশন ও মিশন</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-primary/5 border-l-4 border-primary rounded p-4">
                  <h3 className="font-bold text-primary mb-2">ভিশন</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {settings?.visionMission?.split('|')[0] || 'একটি আধুনিক, প্রগতিশীল ও মানসম্পন্ন শিক্ষা প্রতিষ্ঠান হিসেবে নিজেকে প্রতিষ্ঠিত করা।'}
                  </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
                  <h3 className="font-bold text-blue-700 mb-2">মিশন</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {settings?.visionMission?.split('|')[1] || 'শিক্ষার্থীদের সামগ্রিক বিকাশে সর্বোচ্চ মানের শিক্ষা, নৈতিকতা ও মূল্যবোধ প্রদান করা।'}
                  </p>
                </div>
              </div>
            </div>

            {/* College Info Table */}
            <div className="card overflow-hidden" id="info">
              <div className="section-title bg-primary"><span>প্রতিষ্ঠানের তথ্য</span></div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <tbody>
                    {[
                      ['কলেজের নাম', settings?.collegeName || 'মাদরাসাতু দারিল কুরআন'],
                      ['ইংরেজি নাম', settings?.collegeNameEn || 'Madrasha Darul Quran'],
                      ['EIIN নম্বর', settings?.eiinNumber || ''],
                      ['MPO নম্বর', settings?.mpoNumber || 'N/A'],
                      ['প্রতিষ্ঠা বছর', settings?.establishedYear || ''],
                      ['ঠিকানা', settings?.address || 'চান্দনী মহল, খুলনা'],
                      ['ফোন', settings?.phone?.[0] || 'N/A'],
                      ['ইমেইল', settings?.email || 'N/A'],
                    ].map(([key, val]) => (
                      <tr key={key}>
                        <td className="font-medium text-gray-700 w-1/3">{key}</td>
                        <td className="text-gray-600">: {val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Principal & Chairman */}
          <div className="space-y-4">
            {/* Principal */}
            <div className="card overflow-hidden" id="principal">
              <div className="section-title bg-primary">সভাপতির বাণী</div>
              <div className="p-4 text-center">
                {settings?.principalPhoto?.url ? (
                  <div className="relative w-32 h-36 mx-auto mb-3">
                    <Image src={settings.principalPhoto.url} alt="Principal" fill className="object-cover rounded border-2 border-gray-200" sizes="128px" />
                  </div>
                ) : (
                  <div className="w-32 h-36 mx-auto mb-3 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-4xl text-primary/30">👤</span>
                  </div>
                )}
                <h3 className="font-bold text-gray-800">{settings?.principalNameBn || settings?.principalName || 'অধ্যক্ষ'}</h3>
                <p className="text-xs text-gray-500 mb-3">{settings?.principalDesignation || 'অধ্যক্ষ, মাদরাসাতু দারিল কুরআন'}</p>
                {settings?.principalMessage && (
                  <div className="relative text-left bg-gray-50 rounded p-3">
                    <FaQuoteLeft className="text-gray-200 absolute -top-1 -left-1" size={18} />
                    <p className="text-xs text-gray-600 leading-relaxed pl-3">{settings.principalMessage}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chairman */}
            <div className="card overflow-hidden" id="chairman">
              <div className="section-title bg-secondary">অধ্যক্ষের বাণী</div>
              <div className="p-4 text-center">
                {settings?.chairmanPhoto?.url ? (
                  <div className="relative w-32 h-36 mx-auto mb-3">
                    <Image src={settings.chairmanPhoto.url} alt="Chairman" fill className="object-cover rounded border-2 border-gray-200" sizes="128px" />
                  </div>
                ) : (
                  <div className="w-32 h-36 mx-auto mb-3 bg-secondary/10 rounded flex items-center justify-center">
                    <span className="text-4xl text-secondary/30">👤</span>
                  </div>
                )}
                <h3 className="font-bold text-gray-800">{settings?.chairmanNameBn || settings?.chairmanName || 'অধ্যক্ষ (ভারপ্রাপ্ত)'}</h3>
                <p className="text-xs text-gray-500 mb-3">{settings?.chairmanDesignation || 'অধ্যক্ষ (ভারপ্রাপ্ত)'}</p>
                {settings?.chairmanMessage && (
                  <div className="relative text-left bg-gray-50 rounded p-3">
                    <FaQuoteLeft className="text-gray-200 absolute -top-1 -left-1" size={18} />
                    <p className="text-xs text-gray-600 leading-relaxed pl-3">{settings.chairmanMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
