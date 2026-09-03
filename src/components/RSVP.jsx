import React, { useState } from 'react';
import { Send, CheckCircle2, Heart } from 'lucide-react';

export default function RSVP({ guest }) {
  const [name, setName] = useState(guest.isCustom ? `${guest.prefix} ${guest.name}` : '');
  const [status, setStatus] = useState('attending');
  const [count, setCount] = useState('1');
  const [wish, setWish] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to local storage for offline tracking
    const rsvpList = JSON.parse(localStorage.getItem('wedding_rsvp_responses') || '[]');
    rsvpList.push({
      name: name || guest.name,
      status,
      count,
      wish,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wedding_rsvp_responses', JSON.stringify(rsvpList));
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-4 bg-[#FFFDF9]">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-wedding-red font-bold">
            Phản Hồi Lời Mời
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-wedding-red font-bold mt-1 mb-2">
            Xác Nhận Tham Dự (RSVP)
          </h3>
          <p className="text-stone-600 text-sm">
            Để giúp gia đình chuẩn bị chu đáo nhất, xin vui lòng gửi phản hồi trước ngày 18/10/2026.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-200">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce-slow" />
              <h4 className="font-serif text-2xl font-bold text-stone-800">
                Cảm Ơn Bạn Rất Nhiều!
              </h4>
              <p className="text-stone-600 text-sm">
                Chúng mình đã nhận được phản hồi và rất háo hức được đón tiếp bạn trong ngày vui!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-wedding-red underline font-medium"
              >
                Gửi phản hồi khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Anh Nguyễn Văn Đức"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-wedding-red focus:ring-1 focus:ring-wedding-red outline-none text-sm text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Bạn sẽ tham dự chứ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${
                    status === 'attending' 
                      ? 'border-wedding-red bg-wedding-red-50 text-wedding-red font-semibold' 
                      : 'border-stone-200 text-stone-600'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="attending"
                      checked={status === 'attending'}
                      onChange={() => setStatus('attending')}
                      className="hidden"
                    />
                    <span>Chắc chắn tham gia</span>
                  </label>

                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${
                    status === 'declined' 
                      ? 'border-stone-400 bg-stone-100 text-stone-800 font-semibold' 
                      : 'border-stone-200 text-stone-600'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="declined"
                      checked={status === 'declined'}
                      onChange={() => setStatus('declined')}
                      className="hidden"
                    />
                    <span>Rất tiếc không thể đến</span>
                  </label>
                </div>
              </div>

              {status === 'attending' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Số người tham dự
                  </label>
                  <select
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-wedding-red focus:ring-1 focus:ring-wedding-red outline-none text-sm text-stone-800 bg-white"
                  >
                    <option value="1">1 người</option>
                    <option value="2">2 người (đi cùng người thương)</option>
                    <option value="family">Cả gia đình</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Lời chúc gửi cô dâu &amp; chú rể
                </label>
                <textarea
                  rows="3"
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Gửi gắm lời chúc ngọt ngào nhất..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-wedding-red focus:ring-1 focus:ring-wedding-red outline-none text-sm text-stone-800 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-wedding-red hover:bg-wedding-red-700 text-amber-200 font-semibold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Gửi Lời Chúc &amp; Xác Nhận</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
