import React, { useState } from 'react';
import { Navigation, MapPin, Clock, Copy, Check, ExternalLink } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';

export default function EventsAndMap() {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(weddingConfig.restaurant.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="event-details" className="py-20 px-4 bg-gradient-to-b from-[#FFFDF9] via-stone-50 to-[#FFFDF9]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-wedding-red font-bold">
            Thời Gian &amp; Địa Điểm
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-wedding-red font-bold mt-1 mb-3">
            Sự Kiện &amp; Tiệc Cưới
          </h3>
          <p className="text-stone-600 text-sm sm:text-base">
            Sự hiện diện của bạn là niềm vinh hạnh và món quà ý nghĩa nhất đối với gia đình chúng mình.
          </p>
        </div>

        {/* Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {weddingConfig.events.map((event, idx) => (
            <div
              key={idx}
              className={`relative p-6 rounded-2xl transition-all duration-300 ${
                event.highlight
                  ? 'bg-gradient-to-b from-wedding-red to-wedding-red-800 text-white shadow-xl shadow-red-900/20 ring-2 ring-amber-300'
                  : 'bg-white text-stone-800 shadow-md border border-stone-100 hover:shadow-lg'
              }`}
            >
              {event.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-wedding-red-900 text-xs font-bold rounded-full uppercase tracking-wider shadow">
                  Tiệc Mừng Chính
                </span>
              )}
              <h4 className={`font-serif text-xl font-bold mb-3 ${event.highlight ? 'text-amber-200' : 'text-wedding-red'}`}>
                {event.title}
              </h4>
              <div className={`flex items-center gap-2 text-sm mb-2 ${event.highlight ? 'text-amber-100' : 'text-stone-600'}`}>
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{event.time}</span>
              </div>
              <div className={`flex items-start gap-2 text-sm mb-3 ${event.highlight ? 'text-stone-100' : 'text-stone-700'}`}>
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{event.location}</span>
              </div>
              <p className={`text-xs ${event.highlight ? 'text-amber-200/90' : 'text-stone-500'} italic`}>
                {event.description}
              </p>
            </div>
          ))}
        </div>

        {/* Highlighted Restaurant & Google Map Section */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-amber-200/80 overflow-hidden">
          <div className="p-6 sm:p-10 bg-gradient-to-r from-wedding-red-900 via-wedding-red-800 to-wedding-red-900 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 mb-2 rounded-full bg-amber-400/20 text-amber-300 text-xs uppercase font-semibold tracking-wider">
                  Địa Điểm Đãi Tiệc
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100">
                  {weddingConfig.restaurant.name}
                </h4>
                <p className="text-amber-300 text-sm font-medium mt-1">
                  {weddingConfig.restaurant.hall}
                </p>
                <p className="text-stone-300 text-sm sm:text-base mt-2 flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{weddingConfig.restaurant.address}</span>
                </p>
              </div>

              {/* Action Buttons: Google Maps Direction & Copy Address */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={weddingConfig.restaurant.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-wedding-red-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-amber-400/30 transition-all duration-200"
                >
                  <Navigation className="w-5 h-5 fill-current" />
                  <span>Chỉ Đường (Google Maps)</span>
                </a>

                <button
                  onClick={copyAddress}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-stone-100 text-sm font-medium border border-white/20 transition-colors"
                  title="Sao chép địa chỉ để đặt xe Grab/Be"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>Sao Chép Địa Chỉ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Embedded Google Map Preview */}
          <div className="relative w-full h-[360px] sm:h-[420px] bg-stone-100">
            <iframe
              title="Vị trí nhà hàng tiệc cưới"
              src={weddingConfig.restaurant.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>

            {/* Quick overlay link */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href={weddingConfig.restaurant.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-stone-800 text-xs font-semibold rounded-lg shadow-md hover:bg-white hover:text-wedding-red transition-colors"
              >
                <span>Xem trên bản đồ lớn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
