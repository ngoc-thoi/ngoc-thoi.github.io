import React, { useState, useEffect } from 'react';
import { CalendarPlus, Heart } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';

export default function Countdown({ config = weddingConfig }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const targetDate = new Date(config.weddingDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.weddingDate]);

  // Dynamic Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    let d = new Date(config.weddingDate || '2026-10-25T11:00:00');
    if (isNaN(d.getTime())) d = new Date('2026-10-25T11:00:00');
    const pad = (n) => String(n).padStart(2, '0');
    const formatCalDate = (date) => 
      `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
    const startTime = formatCalDate(d);
    const endD = new Date(d.getTime() + 4 * 60 * 60 * 1000); // 4-hour wedding celebration
    const endTime = formatCalDate(endD);
    const title = encodeURIComponent(`Đám Cưới ${config.groom.shortName} & ${config.bride.shortName}`);
    const details = encodeURIComponent(`Lễ thành hôn & tiệc cưới của ${config.groom.fullName} & ${config.bride.fullName}`);
    const location = encodeURIComponent(`${config.restaurant.name}, ${config.restaurant.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  };

  return (
    <section className="py-16 px-4 bg-[#FFFDF9] text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-wedding-red fill-wedding-red" />
          <span className="text-xs uppercase tracking-widest text-wedding-red font-semibold">
            Đếm Ngược Ngày Hạnh Phúc
          </span>
          <Heart className="w-4 h-4 text-wedding-red fill-wedding-red" />
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl text-stone-800 font-bold mb-4">
          Cùng Đếm Ngược Tới Giờ G
        </h3>
        <p className="text-stone-600 max-w-md mx-auto mb-8 text-sm sm:text-base">
          {config.displayDate} ({config.lunarDate})
        </p>

        {/* Countdown Cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mb-8">
          {[
            { label: 'Ngày', value: timeLeft.days },
            { label: 'Giờ', value: timeLeft.hours },
            { label: 'Phút', value: timeLeft.minutes },
            { label: 'Giây', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-gradient-to-b from-wedding-red-50 to-amber-50/50 border border-wedding-red-100 shadow-sm"
            >
              <span className="font-serif text-2xl sm:text-4xl font-bold text-wedding-red">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-stone-500 uppercase mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Add to Calendar Button */}
        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-wedding-red hover:bg-wedding-red-700 text-amber-200 text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <CalendarPlus className="w-4 h-4 text-amber-300" />
          <span>Lưu Ngày Vào Lịch Google</span>
        </a>
      </div>
    </section>
  );
}
