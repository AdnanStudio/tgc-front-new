'use client';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

const MONTHS_BN = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
const DAYS_BN   = ['সো','মঙ','বু','বৃ','শু','শ','র'];

export default function CalendarWidget() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const startDay    = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => { if (month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if (month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };

  const isToday = d => d===today.getDate() && month===today.getMonth() && year===today.getFullYear();
  const isFriday = d => new Date(year,month,d).getDay()===5;

  return (
    <div className="card overflow-hidden">
      <div className="section-title bg-secondary">
        <FaCalendarAlt size={14}/>
        <span>Calendar</span>
      </div>
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 bg-secondary text-white rounded-lg px-3 py-2">
          <button onClick={prevMonth} className="hover:text-yellow-300 transition-colors p-1 rounded hover:bg-white/10">
            <FaChevronLeft size={12}/>
          </button>
          <span className="text-sm font-semibold">{MONTHS_BN[month]} {year}</span>
          <button onClick={nextMonth} className="hover:text-yellow-300 transition-colors p-1 rounded hover:bg-white/10">
            <FaChevronRight size={12}/>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {DAYS_BN.map(d=>(
            <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({length:startDay}).map((_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:daysInMonth}).map((_,i)=>{
            const d = i+1;
            return (
              <div key={d}
                className={`text-center text-xs py-1.5 rounded cursor-pointer transition-colors font-medium
                  ${isToday(d) ? 'bg-secondary text-white font-bold shadow-sm' : ''}
                  ${isFriday(d) && !isToday(d) ? 'text-red-500' : !isToday(d) ? 'hover:bg-gray-100 text-gray-700' : ''}`}>
                {d}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        
      </div>
    </div>
  );
}
