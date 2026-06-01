'use client';
import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { studentsAPI } from '../../../../lib/api';

const DEFAULT_CLASSES = [
  { className:'Class XI (Science)',    classNameBn:'একাদশ (বিজ্ঞান)',     male:0, female:0, total:0 },
  { className:'Class XI (Humanities)', classNameBn:'একাদশ (মানবিক)',      male:0, female:0, total:0 },
  { className:'Class XI (Commerce)',   classNameBn:'একাদশ (ব্যবসায়)',     male:0, female:0, total:0 },
  { className:'Class XII (Science)',   classNameBn:'দ্বাদশ (বিজ্ঞান)',    male:0, female:0, total:0 },
  { className:'Class XII (Humanities)',classNameBn:'দ্বাদশ (মানবিক)',     male:0, female:0, total:0 },
  { className:'Class XII (Commerce)',  classNameBn:'দ্বাদশ (ব্যবসায়)',   male:0, female:0, total:0 },
];

export default function AdminStudents() {
  const [stats,   setStats]   = useState(null);
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const [year,    setYear]    = useState(new Date().getFullYear().toString());
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentsAPI.get()
      .then(r => {
        if (r.data) {
          setStats(r.data);
          setClasses(r.data.classes?.length ? r.data.classes : DEFAULT_CLASSES);
          setYear(r.data.academicYear || new Date().getFullYear().toString());
        }
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  // field পরিবর্তন করো
  const updateClass = (i, field, val) => {
    const updated = [...classes];
    if (field === 'male' || field === 'female') {
      const num = parseInt(val) || 0;
      updated[i] = { ...updated[i], [field]: num };
      updated[i].total = (field==='male' ? num : updated[i].male||0)
                       + (field==='female' ? num : updated[i].female||0);
    } else {
      // text fields — classNameBn, className
      updated[i] = { ...updated[i], [field]: val };
    }
    setClasses(updated);
  };

  // row মুছো
  const deleteRow = (i) => {
    if (!confirm('এই শ্রেণিটি মুছে ফেলতে চান?')) return;
    setClasses(classes.filter((_, idx) => idx !== i));
  };

  // নতুন row
  const addRow = () => {
    setClasses([...classes, { className:'', classNameBn:'নতুন শ্রেণি', male:0, female:0, total:0 }]);
  };

  const totals = {
    male:   classes.reduce((s,c)=>s+(c.male||0),0),
    female: classes.reduce((s,c)=>s+(c.female||0),0),
    total:  classes.reduce((s,c)=>s+(c.total||0),0),
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        academicYear: year,
        classes,
        totalMale:     totals.male,
        totalFemale:   totals.female,
        totalStudents: totals.total,
        isCurrent:     true,
      };
      if (stats?._id) await studentsAPI.update(stats._id, payload);
      else            await studentsAPI.create(payload);
      toast.success('শিক্ষার্থীর তথ্য সংরক্ষিত হয়েছে ✅');
    } catch { toast.error('সংরক্ষণ ব্যর্থ হয়েছে'); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"/></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-700">শিক্ষার্থীর পরিসংখ্যান</h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
          {saving ? <><div className="spinner !w-4 !h-4 border-white/30 border-t-white"/> সংরক্ষণ...</> : <><FaSave size={13}/> সংরক্ষণ করুন</>}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center border-t-4 border-primary">
          <div className="text-2xl font-bold text-primary">{totals.total}</div>
          <div className="text-xs text-gray-500 mt-1">মোট শিক্ষার্থী</div>
        </div>
        <div className="card p-4 text-center border-t-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-500">{totals.male}</div>
          <div className="text-xs text-gray-500 mt-1">ছাত্র</div>
        </div>
        <div className="card p-4 text-center border-t-4 border-pink-500">
          <div className="text-2xl font-bold text-pink-500">{totals.female}</div>
          <div className="text-xs text-gray-500 mt-1">ছাত্রী</div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <label className="label mb-0 whitespace-nowrap font-semibold">শিক্ষাবর্ষ:</label>
          <input value={year} onChange={e=>setYear(e.target.value)} className="input w-40 text-sm" placeholder="2026"/>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>শ্রেণি (বাংলা)</th>
                <th className="hidden md:table-cell">Class (English)</th>
                <th className="w-28">ছাত্র</th>
                <th className="w-28">ছাত্রী</th>
                <th className="w-20 text-center">মোট</th>
                <th className="w-12 text-center">মুছুন</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, i) => (
                <tr key={i}>
                  {/* বাংলা নাম — text input */}
                  <td>
                    <input
                      type="text"
                      value={cls.classNameBn}
                      onChange={e=>updateClass(i,'classNameBn',e.target.value)}
                      className="input text-sm"
                      placeholder="বাংলায় শ্রেণির নাম"
                    />
                  </td>
                  {/* English নাম — text input */}
                  <td className="hidden md:table-cell">
                    <input
                      type="text"
                      value={cls.className}
                      onChange={e=>updateClass(i,'className',e.target.value)}
                      className="input text-sm"
                      placeholder="Class name in English"
                    />
                  </td>
                  {/* ছাত্র — শুধু digit */}
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={cls.male}
                      onChange={e=>updateClass(i,'male',e.target.value)}
                      className="input text-sm text-center"
                    />
                  </td>
                  {/* ছাত্রী — শুধু digit */}
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={cls.female}
                      onChange={e=>updateClass(i,'female',e.target.value)}
                      className="input text-sm text-center"
                    />
                  </td>
                  <td className="text-center font-bold text-primary">{cls.total}</td>
                  {/* Delete row */}
                  <td className="text-center">
                    <button
                      onClick={()=>deleteRow(i)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                      title="এই শ্রেণি মুছুন"
                    >
                      <FaTrash size={13}/>
                    </button>
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-primary/10 font-bold">
                <td colSpan={2} className="font-bold text-right pr-4">মোট সংখ্যা:</td>
                <td className="text-center text-blue-700 font-bold">{totals.male}</td>
                <td className="text-center text-pink-700 font-bold">{totals.female}</td>
                <td className="text-center text-primary font-bold">{totals.total}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Add row button */}
        <button
          onClick={addRow}
          className="mt-4 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <FaPlus size={12}/> নতুন শ্রেণি যোগ করুন
        </button>

        <p className="text-xs text-gray-400 mt-2">
          💡 শ্রেণির নামের ঘরে বাংলা বা English যেকোনো লেখা দেওয়া যাবে। ছাত্র/ছাত্রীর ঘরে শুধু সংখ্যা দিন।
        </p>
      </div>
    </div>
  );
}
