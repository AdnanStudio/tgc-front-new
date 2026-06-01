import Link from 'next/link';
import {
  FaBuilding, FaChalkboard, FaUniversity, FaUsers, FaFileAlt,
  FaVoteYea, FaImages, FaDownload, FaGlobe, FaHandshake, FaUserTie
} from 'react-icons/fa';

const menuSections = [
  {
    title:'প্রতিষ্ঠান পরিচিতি', color:'bg-blue-700', icon:FaBuilding,
    items:[
      { label:'কলেজের ইতিহাস',     href:'/about' },
      { label:'লক্ষ্য ও উদ্দেশ্য', href:'/about#objectives' },
      { label:'ভিশন-মিশন',          href:'/about#vision' },
      { label:'সভাপতির বাণী',       href:'/about#principal' },
      { label:'অধ্যক্ষের বাণী',     href:'/about#chairman' },
      { label:'প্রতিষ্ঠানের তথ্য',  href:'/about#info' },
    ]
  },
  {
    title:'প্রশাসন', color:'bg-purple-700', icon:FaUserTie,
    items:[
      { label:'শিক্ষকবৃন্দ',        href:'/teachers' },
      { label:'পরিচালনা কমিটি',      href:'/committee' },
      { label:'অনুমোদন ও স্বীকৃতি', href:'/approvals' },
      { label:'MPO তথ্য',            href:'/mpo' },
    ]
  },
  {
    title:'একাডেমিক', color:'bg-cyan-700', icon:FaChalkboard,
    items:[
      { label:'উচ্চ মাধ্যমিক রুটিন',   href:'/exam#routine' },
      { label:'ক্লাস সময়সূচী',          href:'/academic#schedule' },
      { label:'পাঠ পরিকল্পনা',           href:'/academic#syllabus' },
      { label:'বিভাগ পরিচিতি',           href:'/academic#departments' },
      { label:'একাডেমিক ক্যালেন্ডার', href:'/academic#calendar' },
    ]
  },
  {
    title:'ভর্তি', color:'bg-orange-600', icon:FaUniversity,
    items:[
      { label:'অনলাইনে আবেদন',    href:'/admission' },
      { label:'ভর্তির যোগ্যতা',   href:'/admission#eligibility' },
      { label:'শাখা তালিকা',       href:'/admission#branches' },
      { label:'আসন সংখ্যা',        href:'/admission#seats' },
      { label:'ছাত্র-ছাত্রী তথ্য', href:'/students' },
    ]
  },
  {
    title:'পরীক্ষা ও ফলাফল', color:'bg-red-700', icon:FaFileAlt,
    items:[
      { label:'পরীক্ষার রুটিন',        href:'/exam#routine' },
      { label:'অভ্যন্তরীণ ফলাফল',      href:'/exam#results' },
      { label:'পাবলিক ফলাফল',           href:'/exam#public' },
      { label:'পাশের হার পরিসংখ্যান', href:'/exam#passrate' },
    ]
  },
  {
    title:'ফর্ম পূরণ', color:'bg-teal-700', icon:FaVoteYea,
    items:[
      { label:'ভর্তি ফর্ম',       href:'/admission' },
      { label:'ছাত্র নাম ফর্ম',   href:'/notice' },
      { label:'টেস্টিমোনিয়াল',    href:'/notice' },
    ]
  },
  {
    title:'গ্যালারি', color:'bg-pink-700', icon:FaImages,
    items:[
      { label:'ছবি গ্যালারি',  href:'/gallery' },
      { label:'ইভেন্টসমূহ',    href:'/gallery?category=event' },
      { label:'ক্যাম্পাস',     href:'/gallery?category=campus' },
    ]
  },
  {
    title:'ডাউনলোড ও সেবা', color:'bg-indigo-700', icon:FaDownload,
    items:[
      { label:'নোটিশবোর্ড PDF',  href:'/notice' },
      { label:'রুটিন ডাউনলোড',   href:'/exam' },
      { label:'অনুমোদন দলিল',    href:'/approvals' },
    ]
  },
  {
    title:'অনলাইন সেবা', color:'bg-green-800', icon:FaGlobe,
    items:[
      { label:'শিক্ষা বোর্ড',           href:'http://www.dhakaeducationboard.gov.bd' },
      { label:'জাতীয় বিশ্ববিদ্যালয়', href:'http://www.nu.ac.bd' },
      { label:'EMIS | DSHE',            href:'http://www.dshe.gov.bd' },
      { label:'ফলাফল যাচাই',            href:'http://www.educationboardresults.gov.bd' },
    ]
  },
  {
    title:'সমাজসেবা কার্যক্রম', color:'bg-yellow-700', icon:FaHandshake,
    items:[
      { label:'ক্লাব কার্যক্রম',   href:'/contact' },
      { label:'সামাজিক কার্যক্রম', href:'/contact' },
    ]
  },
];

export default function HomeMenuGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 my-4">
      {menuSections.map(({ title, color, icon:Icon, items }) => (
        <div key={title} className="card overflow-hidden">
          <div className={`${color} text-white px-3 py-2 flex items-center gap-2`}>
            <Icon size={13} className="flex-shrink-0"/>
            <span className="text-xs font-semibold truncate">{title}</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {items.map(({ label, href }) => (
              <li key={label}>
                {href.startsWith('http') ? (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 hover:text-primary hover:bg-green-50 transition-colors">
                    <span className="text-primary">›</span>
                    <span className="line-clamp-1">{label}</span>
                  </a>
                ) : (
                  <Link href={href}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 hover:text-primary hover:bg-green-50 transition-colors">
                    <span className="text-primary">›</span>
                    <span className="line-clamp-1">{label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
