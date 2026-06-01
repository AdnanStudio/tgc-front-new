'use client';
import { useEffect, useState, useRef } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaBuilding, FaTrophy } from 'react-icons/fa';
import { studentsAPI, teachersAPI, settingsAPI } from '../../lib/api';

function CountUp({ end, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref          = useRef(null);
  const hasAnimated  = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current && end > 0) {
        hasAnimated.current = true;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString('bn-BD')}</span>;
}

export default function StatsSection() {
  const [data, setData] = useState({ students:0, teachers:0, year:'', pass:95 });

  useEffect(() => {
    Promise.allSettled([
      studentsAPI.get(),
      teachersAPI.getAll(),
      settingsAPI.get(),
    ]).then(([s, t, st]) => {
      setData({
        students: s.status==='fulfilled'  ? (s.value.data?.totalStudents||0)   : 0,
        teachers: t.status==='fulfilled'  ? (t.value.data?.length||0)          : 0,
        year:     st.status==='fulfilled' ? (st.value.data?.establishedYear||'') : '',
        pass: 95,
      });
    });
  }, []);

  const items = [
    { icon:FaUserGraduate,     label:'মোট শিক্ষার্থী', value:data.students, color:'bg-primary',     suffix:'' },
    { icon:FaChalkboardTeacher,label:'শিক্ষক',         value:data.teachers, color:'bg-blue-600',    suffix:'' },
    { icon:FaBuilding,         label:'প্রতিষ্ঠিত',    value:1991,          color:'bg-orange-600',  suffix:'', raw:data.year },
    { icon:FaTrophy,           label:'পাশের হার',     value:data.pass,     color:'bg-purple-600',  suffix:'%' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
      {items.map(({ icon:Icon, label, value, color, suffix, raw }) => (
        <div key={label} className={`${color} text-white rounded-xl p-4 text-center shadow-card`}>
          <Icon className="mx-auto mb-2 opacity-90" size={28}/>
          <div className="text-2xl font-bold">
            {raw ? raw : <><CountUp end={value}/>{suffix}</>}
          </div>
          <div className="text-xs mt-1 opacity-85">{label}</div>
        </div>
      ))}
    </div>
  );
}
