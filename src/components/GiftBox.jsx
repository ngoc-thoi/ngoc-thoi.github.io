import React, { useState } from 'react';
import { Gift, Copy, Check, QrCode } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';

export default function GiftBox() {
  const [activeTab, setActiveTab] = useState('groom');
  const [copiedAccount, setCopiedAccount] = useState('');

  const copyNumber = (accountNum) => {
    navigator.clipboard.writeText(accountNum);
    setCopiedAccount(accountNum);
    setTimeout(() => setCopiedAccount(''), 2000);
  };

  const current = activeTab === 'groom' ? weddingConfig.groom : weddingConfig.bride;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#FFFDF9] via-rose-50/40 to-[#FFFDF9]">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-wedding-red mb-2">
          <Gift className="w-4 h-4 text-amber-500" />
          <span>Hộp Mừng Cưới</span>
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl text-wedding-red font-bold mb-3">
          Gửi Quà Chúc Phúc
        </h3>
        <p className="text-stone-600 text-sm sm:text-base mb-8">
          Sự hiện diện của các bạn là món quà ý nghĩa nhất. Nếu ở xa không thể đến chung vui, bạn có thể gửi lời chúc và món quà nhỏ qua đây nhé!
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center p-1.5 bg-stone-200/60 rounded-full max-w-xs mx-auto mb-8">
          <button
            onClick={() => setActiveTab('groom')}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
              activeTab === 'groom'
                ? 'bg-wedding-red text-amber-200 shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Mừng Chú Rể
          </button>
          <button
            onClick={() => setActiveTab('bride')}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
              activeTab === 'bride'
                ? 'bg-wedding-red text-amber-200 shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Mừng Cô Dâu
          </button>
        </div>

        {/* Bank & QR Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-200/80 transition-all duration-300">
          <div className="w-48 h-48 mx-auto mb-5 p-2 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner flex items-center justify-center">
            <img
              src={current.bank.qrUrl}
              alt={`QR ${current.bank.accountName}`}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-2 text-sm text-stone-700">
            <p className="font-semibold text-wedding-red text-base">
              {current.bank.bankName}
            </p>
            <p className="text-stone-500">
              Chủ tài khoản: <span className="font-bold text-stone-900 uppercase">{current.bank.accountName}</span>
            </p>
            
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="font-mono text-lg font-bold text-stone-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                {current.bank.accountNumber}
              </span>
              <button
                onClick={() => copyNumber(current.bank.accountNumber)}
                className="p-2 rounded-lg bg-wedding-red/10 text-wedding-red hover:bg-wedding-red hover:text-white transition-colors"
                title="Sao chép số tài khoản"
              >
                {copiedAccount === current.bank.accountNumber ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copiedAccount === current.bank.accountNumber && (
              <p className="text-xs text-emerald-600 font-medium">Đã sao chép số tài khoản!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
