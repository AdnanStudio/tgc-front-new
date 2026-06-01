'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaSave, FaUpload, FaCog, FaPhone, FaPlus, FaTimes, FaAddressCard } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../../../lib/api';

const TABS = ['সাধারণ তথ্য','অধ্যক্ষ / সভাপতি','সোশ্যাল মিডিয়া','কলেজ সম্পর্কে','লোগো ও ছবি'];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState(0);
  const [settings,  setSettings]  = useState(null);
  const [form,      setForm]      = useState({});
  const [phones,    setPhones]    = useState(['']);
  const [saving,    setSaving]    = useState(false);
  const logoRef      = useRef();
  const principalRef = useRef();
  const chairmanRef  = useRef();
  const [uploading, setUploading] = useState({ logo:false, principal:false, chairman:false });

  useEffect(() => {
    settingsAPI.get().then(r => {
      const d = r.data;
      setSettings(d);
      setPhones(d.phone?.length ? d.phone : ['']);
      setForm({
        collegeName:          d.collegeName          || '',
        collegeNameEn:        d.collegeNameEn        || '',
        tagline:              d.tagline              || '',
        eiinNumber:           d.eiinNumber           || '',
        mpoNumber:            d.mpoNumber            || '',
        establishedYear:      d.establishedYear      || '',
        address:              d.address              || '',
        addressEn:            d.addressEn            || '',
        email:                d.email                || '',
        website:              d.website              || '',
        principalName:        d.principalName        || '',
        principalNameBn:      d.principalNameBn      || '',
        principalDesignation: d.principalDesignation || 'অধ্যক্ষ',
        principalMessage:     d.principalMessage     || '',
        chairmanName:         d.chairmanName         || '',
        chairmanNameBn:       d.chairmanNameBn       || '',
        chairmanDesignation:  d.chairmanDesignation  || 'অধ্যক্ষ (ভারপ্রাপ্ত)',
        chairmanMessage:      d.chairmanMessage      || '',
        facebook:             d.socialLinks?.facebook  || '',
        youtube:              d.socialLinks?.youtube   || '',
        twitter:              d.socialLinks?.twitter   || '',
        instagram:            d.socialLinks?.instagram || '',
        googleMapEmbed:       d.googleMapEmbed       || '',
        footerText:           d.footerText           || '',
        metaDescription:      d.metaDescription      || '',
        scrollingNotice:      d.scrollingNotice      || '',
        isScrollingActive:    d.isScrollingActive !== false,
        aboutHistory:         d.aboutHistory         || '',
        visionMission:        d.visionMission        || '',
        objectives:           d.objectives           || '',
        playStoreLink:        d.playStoreLink         || '',
      });
    }).catch(()=>toast.error('সেটিংস লোড হয়নি'));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.update({
        ...form,
        phone: phones.filter(p=>p.trim()),
      });
      toast.success('সেটিংস সংরক্ষিত হয়েছে ✅');
    } catch (e) { toast.error(e.message || 'সংরক্ষণ ব্যর্থ'); }
    setSaving(false);
  };

  const handleUpload = async (type, file) => {
    if (!file) return;
    setUploading(u=>({...u,[type]:true}));
    try {
      const fd = new FormData();
      fd.append(type==='logo' ? 'logo' : 'photo', file);
      let r;
      if      (type==='logo')      r = await settingsAPI.uploadLogo(fd);
      else if (type==='principal') r = await settingsAPI.uploadPrincipalPhoto(fd);
      else                         r = await settingsAPI.uploadChairmanPhoto(fd);
      setSettings(r.data);
      toast.success('ছবি আপলোড হয়েছে ✅');
    } catch { toast.error('আপলোড ব্যর্থ'); }
    setUploading(u=>({...u,[type]:false}));
  };

  const inp = (key, props={}) => (
    <input value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})} className="input" {...props}/>
  );
  const ta = (key, rows=4, props={}) => (
    <textarea value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})} className="input resize-none" rows={rows} {...props}/>
  );

  if (!settings) return <div className="flex justify-center py-20"><div className="spinner"/></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <FaCog size={18}/> ওয়েবসাইট সেটিংস
        </h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
          {saving?<><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> সংরক্ষণ...</>:<><FaSave size={13}/> সংরক্ষণ</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap">
        {TABS.map((tab,i)=>(
          <button key={i} onClick={()=>setActiveTab(i)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-lg text-xs font-medium transition-colors
              ${activeTab===i?'bg-white shadow text-primary':'text-gray-600 hover:text-primary'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {/* ── Tab 0: General ── */}
        {activeTab===0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">সাধারণ তথ্য</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label">কলেজের নাম (বাংলা)</label>{inp('collegeName',{placeholder:'মাদরাসাতু দারিল কুরআন'})}</div>
              <div><label className="label">College Name (English)</label>{inp('collegeNameEn',{placeholder:'Malkhanagar College'})}</div>
              <div><label className="label">ট্যাগলাইন</label>{inp('tagline',{placeholder:'জ্ঞানই শক্তি'})}</div>
              <div><label className="label">EIIN নম্বর</label>{inp('eiinNumber',{placeholder:'134590'})}</div>
              <div>
                <label className="label flex items-center gap-1.5"><FaAddressCard size={12} className="text-primary"/> MPO নম্বর</label>
                {inp('mpoNumber',{placeholder:'MPO নম্বর'})}
              </div>
              <div><label className="label">প্রতিষ্ঠা বছর</label>{inp('establishedYear',{placeholder:'১৯৯১'})}</div>
              <div><label className="label">ঠিকানা (বাংলা)</label>{inp('address',{placeholder:'মালখানগর, সিরাজদিখান, মুন্সিগঞ্জ'})}</div>
              <div><label className="label">Address (English)</label>{inp('addressEn',{placeholder:'Malkhanagar, Sirajdikhan, Munshiganj'})}</div>
              <div><label className="label">ইমেইল</label>{inp('email',{type:'email',placeholder:'college@email.com'})}</div>
              <div><label className="label">ওয়েবসাইট</label>{inp('website',{placeholder:'https://malkhanagarcollege.edu.bd'})}</div>
            </div>

            {/* Phones */}
            <div>
              <label className="label">ফোন নম্বরসমূহ</label>
              {phones.map((ph,i)=>(
                <div key={i} className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12}/>
                    <input value={ph} onChange={e=>{const p=[...phones];p[i]=e.target.value;setPhones(p);}}
                      className="input pl-9" placeholder="01XXXXXXXXX"/>
                  </div>
                  {phones.length>1 && (
                    <button onClick={()=>setPhones(phones.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-600 p-2">
                      <FaTimes size={13}/>
                    </button>
                  )}
                </div>
              ))}
              <button onClick={()=>setPhones([...phones,''])} className="flex items-center gap-1.5 text-primary text-sm hover:underline">
                <FaPlus size={11}/> আরেকটি নম্বর
              </button>
            </div>

            <div>
              <label className="label">স্ক্রলিং নোটিশ বার</label>
              {ta('scrollingNotice',2,{placeholder:'মার্কি বারে যে লেখা দেখাবে...'})}
              <label className="flex items-center gap-2 mt-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.isScrollingActive} onChange={e=>setForm({...form,isScrollingActive:e.target.checked})} className="rounded"/>
                স্ক্রলিং বার সক্রিয় রাখুন
              </label>
            </div>
            <div>
              <label className="label">Google Map Embed URL</label>
              {ta('googleMapEmbed',3,{placeholder:'https://www.google.com/maps/embed?pb=...'})}
            </div>
            <div>
              <label className="label">Footer Text</label>
              {inp('footerText',{placeholder:'All rights reserved © 2026, MALKHANAGAR COLLEGE'})}
            </div>
            <div>
              <label className="label">Meta Description (SEO)</label>
              {ta('metaDescription',2,{placeholder:'ওয়েবসাইটের SEO বিবরণ...'})}
            </div>
            <div>
              <label className="label">Google Play Store App Link</label>
              {inp('playStoreLink',{placeholder:'https://play.google.com/store/apps/...'})}
            </div>
          </div>
        )}

        {/* ── Tab 1: Principal/Chairman ── */}
        {activeTab===1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">সভাপতির তথ্য</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="label">নাম (বাংলা)</label>{inp('principalNameBn',{placeholder:'মো. আব্দুল করিম'})}</div>
                <div><label className="label">Name (English)</label>{inp('principalName',{placeholder:'Md. Abdul Karim'})}</div>
                <div className="md:col-span-2"><label className="label">পদবী</label>{inp('principalDesignation')}</div>
              </div>
              <div className="mt-3"><label className="label">বাণী / বক্তব্য</label>{ta('principalMessage',6,{placeholder:'সভাপতির বাণী লিখুন...'})}</div>
            </div>

            <div className="border-t pt-5">
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">অধ্যক্ষের তথ্য (ভারপ্রাপ্ত)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="label">নাম (বাংলা)</label>{inp('chairmanNameBn')}</div>
                <div><label className="label">Name (English)</label>{inp('chairmanName')}</div>
                <div className="md:col-span-2"><label className="label">পদবী</label>{inp('chairmanDesignation')}</div>
              </div>
              <div className="mt-3"><label className="label">বাণী / বক্তব্য</label>{ta('chairmanMessage',6)}</div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Social ── */}
        {activeTab===2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">সোশ্যাল মিডিয়া লিংক</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="label">Facebook Page URL</label>{inp('facebook',{placeholder:'https://facebook.com/...'})}</div>
              <div><label className="label">YouTube Channel URL</label>{inp('youtube',{placeholder:'https://youtube.com/...'})}</div>
              <div><label className="label">Twitter URL</label>{inp('twitter',{placeholder:'https://twitter.com/...'})}</div>
              <div><label className="label">Instagram URL</label>{inp('instagram',{placeholder:'https://instagram.com/...'})}</div>
            </div>
          </div>
        )}

        {/* ── Tab 3: About ── */}
        {activeTab===3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">কলেজ সম্পর্কে তথ্য</h3>
            <div><label className="label">কলেজের ইতিহাস</label>{ta('aboutHistory',8,{placeholder:'কলেজের ইতিহাস ও প্রতিষ্ঠার গল্প...'})}</div>
            <div><label className="label">লক্ষ্য ও উদ্দেশ্য</label>{ta('objectives',5,{placeholder:'কলেজের লক্ষ্য ও উদ্দেশ্য...'})}</div>
            <div>
              <label className="label">ভিশন ও মিশন</label>
              <p className="text-xs text-gray-400 mb-1">ভিশন ও মিশন | (pipe দিয়ে আলাদা করুন — ভিশন|মিশন)</p>
              {ta('visionMission',4,{placeholder:'আমাদের ভিশন...|আমাদের মিশন...'})}
            </div>
          </div>
        )}

        {/* ── Tab 4: Logo & Photos ── */}
        {activeTab===4 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-700 border-b pb-2">লোগো ও ছবি আপলোড</h3>

            {/* Logo */}
            <div className="flex items-start gap-5 p-4 bg-gray-50 rounded-xl border">
              <div className="w-20 h-20 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {settings?.logo?.url
                  ? <Image src={settings.logo.url} alt="Logo" width={80} height={80} className="object-contain"/>
                  : <span className="text-3xl text-gray-300">🏫</span>}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-700 mb-1">কলেজের লোগো</p>
                <input type="file" accept="image/*" ref={logoRef} onChange={e=>handleUpload('logo',e.target.files[0])} className="hidden"/>
                <button onClick={()=>logoRef.current?.click()} disabled={uploading.logo}
                  className="btn-primary flex items-center gap-2 text-sm">
                  {uploading.logo?<><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> আপলোড...</>:<><FaUpload size={12}/> লোগো আপলোড</>}
                </button>
                <p className="text-xs text-gray-400 mt-1">PNG বা SVG (transparent background ভালো)</p>
              </div>
            </div>

            {/* Principal Photo */}
            <div className="flex items-start gap-5 p-4 bg-gray-50 rounded-xl border">
              <div className="w-20 h-24 bg-white rounded border-2 border-gray-200 overflow-hidden flex-shrink-0">
                {settings?.principalPhoto?.url
                  ? <Image src={settings.principalPhoto.url} alt="Principal" width={80} height={96} className="object-cover w-full h-full"/>
                  : <div className="w-full h-full flex items-center justify-center text-3xl text-gray-200">👤</div>}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-700 mb-1">সভাপতির ছবি</p>
                <input type="file" accept="image/*" ref={principalRef} onChange={e=>handleUpload('principal',e.target.files[0])} className="hidden"/>
                <button onClick={()=>principalRef.current?.click()} disabled={uploading.principal}
                  className="btn-primary flex items-center gap-2 text-sm">
                  {uploading.principal?<><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> আপলোড...</>:<><FaUpload size={12}/> ছবি আপলোড</>}
                </button>
                <p className="text-xs text-gray-400 mt-1">প্রস্তাবিত: 400×500px</p>
              </div>
            </div>

            {/* Chairman Photo */}
            <div className="flex items-start gap-5 p-4 bg-gray-50 rounded-xl border">
              <div className="w-20 h-24 bg-white rounded border-2 border-gray-200 overflow-hidden flex-shrink-0">
                {settings?.chairmanPhoto?.url
                  ? <Image src={settings.chairmanPhoto.url} alt="Chairman" width={80} height={96} className="object-cover w-full h-full"/>
                  : <div className="w-full h-full flex items-center justify-center text-3xl text-gray-200">👤</div>}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-700 mb-1">অধ্যক্ষের ছবি (ভারপ্রাপ্ত)</p>
                <input type="file" accept="image/*" ref={chairmanRef} onChange={e=>handleUpload('chairman',e.target.files[0])} className="hidden"/>
                <button onClick={()=>chairmanRef.current?.click()} disabled={uploading.chairman}
                  className="btn-primary flex items-center gap-2 text-sm">
                  {uploading.chairman?<><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> আপলোড...</>:<><FaUpload size={12}/> ছবি আপলোড</>}
                </button>
                <p className="text-xs text-gray-400 mt-1">প্রস্তাবিত: 400×500px</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving?<><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> সংরক্ষণ হচ্ছে...</>:<><FaSave size={13}/> সকল পরিবর্তন সংরক্ষণ</>}
        </button>
      </div>
    </div>
  );
}
