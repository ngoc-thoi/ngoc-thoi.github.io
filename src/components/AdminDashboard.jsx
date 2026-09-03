import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  X,
  Users,
  Share2,
  Music
} from 'lucide-react';
import { 
  fetchGuestsFromGoogleSheet, 
  fetchWeddingConfigFromGoogleSheet,
  updateGuestStatusInGoogleSheet,
  GOOGLE_APPS_SCRIPT_CODE,
  GOOGLE_SHEET_TEMPLATE_CSV,
  GOOGLE_SHEET_CONFIG_TEMPLATE_CSV 
} from '../services/googleSheetsService';
import { weddingConfig } from '../config/weddingConfig';

export default function AdminDashboard({ onClose, config = weddingConfig, onRefreshData }) {
  const [sheetInput, setSheetInput] = useState(() => {
    return localStorage.getItem('wedding_sheet_id') || weddingConfig.googleSheets.sheetId || '';
  });
  const [ytInput, setYtInput] = useState(() => {
    return localStorage.getItem('wedding_youtube_url') || config.music.youtubeUrl || '';
  });
  const [ytSaved, setYtSaved] = useState(false);
  const [scriptInput, setScriptInput] = useState(() => {
    return localStorage.getItem('wedding_apps_script_url') || '';
  });
  const [scriptSaved, setScriptSaved] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [syncToast, setSyncToast] = useState('');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [sentMap, setSentMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wedding_sent_checklist') || '{}');
    } catch {
      return {};
    }
  });
  const [activeTab, setActiveTab] = useState('guests'); // 'guests', 'sheets'

  // Extract ID from full Google Sheet URL if user pastes URL
  const extractSheetId = (input) => {
    if (!input) return '';
    const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : input.trim();
  };

  const loadGuests = async (idToUse, forceRefresh = false) => {
    setLoading(true);
    setStatusMsg('');
    const id = extractSheetId(idToUse);
    try {
      if (id) {
        localStorage.setItem('wedding_sheet_id', id);
      }
      const data = await fetchGuestsFromGoogleSheet(id, 'KhachMoi', forceRefresh);
      setGuests(data);

      // Merge remote status from Google Sheet into local sentMap
      const updatedSentMap = { ...sentMap };
      data.forEach(g => {
        if (g.isSent) {
          updatedSentMap[g.id] = true;
        }
      });
      setSentMap(updatedSentMap);
      localStorage.setItem('wedding_sent_checklist', JSON.stringify(updatedSentMap));

      if (id) {
        setStatusMsg(`Đã kết nối thành công! Đã tải ${data.length} khách mời & thông tin đám cưới.`);
      } else {
        setStatusMsg(`Đang sử dụng danh sách khách mời mặc định (${data.length} khách).`);
      }
      if (onRefreshData) onRefreshData();
    } catch (err) {
      setStatusMsg('Lỗi khi tải dữ liệu từ Google Sheet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuests(sheetInput, true);
  }, []);

  const toggleSent = async (guestId) => {
    const newStatus = !sentMap[guestId];
    const updated = { ...sentMap, [guestId]: newStatus };
    setSentMap(updated);
    localStorage.setItem('wedding_sent_checklist', JSON.stringify(updated));

    // If Google Apps Script URL is configured, sync directly to Google Sheet in real time
    if (scriptInput) {
      setSyncToast(`Đang đồng bộ tới Google Sheet...`);
      const ok = await updateGuestStatusInGoogleSheet(scriptInput, guestId, newStatus);
      if (ok) {
        setSyncToast(`Đã đồng bộ "${newStatus ? 'Đã gửi' : 'Chưa gửi'}" lên Google Sheet!`);
      } else {
        setSyncToast(`Lỗi đồng bộ Google Sheet. Vui lòng kiểm tra lại URL Script.`);
      }
      setTimeout(() => setSyncToast(''), 3000);
    }
  };

  const copyInviteMessage = (guest) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const inviteUrl = `${baseUrl}?g=${encodeURIComponent(guest.id)}`;
    const msg = `Thân gửi ${guest.prefix} ${guest.name},\n\nGia đình chúng mình chuẩn bị tổ chức lễ cưới vào ngày ${config.displayDate}.\nRất mong ${guest.prefix} sẽ đến chung vui cùng chúng mình trong ngày trọng đại này!\n\nThiệp mời trực tuyến riêng của ${guest.prefix} ở đây nhé:\n${inviteUrl}\n\nRất hân hạnh được đón tiếp ${guest.prefix}!`;

    navigator.clipboard.writeText(msg);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const downloadTemplateCSV = () => {
    const blob = new Blob([GOOGLE_SHEET_TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mau_danh_sach_khach_moi.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadConfigTemplateCSV = () => {
    const blob = new Blob([GOOGLE_SHEET_CONFIG_TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mau_thong_tin_dam_cuoi_ThongTin.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groups = ['all', ...Array.from(new Set(guests.map(g => g.group).filter(Boolean)))];

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.phone && guest.phone.includes(searchTerm));
    const matchesGroup = selectedGroup === 'all' || guest.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const sentCount = Object.values(sentMap).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-300/40">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-wedding-red-900 to-wedding-red-800 text-white flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-300" />
              <span>Quản Lý Khách Mời &amp; Gửi Link Thiệp</span>
            </h2>
            <p className="text-amber-200/80 text-xs sm:text-sm mt-0.5">
              Đã gửi: {sentCount}/{guests.length} khách • Kết nối trực tiếp Google Sheet
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Đóng bảng quản lý"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2">
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'guests'
                ? 'border-wedding-red text-wedding-red'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Danh Sách &amp; Gửi Link ({filteredGuests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'sheets'
                ? 'border-wedding-red text-wedding-red'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Cài Đặt Google Sheet</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50/50">
          
          {/* TAB 1: GUESTS LIST & ONE-CLICK ZALO SENDER */}
          {activeTab === 'guests' && (
            <div className="space-y-4">
              {/* Search & Group Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, ID, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:border-wedding-red focus:outline-none bg-white"
                  />
                </div>

                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:border-wedding-red focus:outline-none"
                >
                  <option value="all">Tất cả các nhóm</option>
                  {groups.filter(g => g !== 'all').map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                <button
                  onClick={() => loadGuests(sheetInput, true)}
                  className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-sm font-medium flex items-center gap-1.5 shrink-0"
                  title="Làm mới dữ liệu từ Google Sheet ngay lập tức"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Đồng bộ lại</span>
                </button>
              </div>

              {/* Real-time sync notification toast */}
              {syncToast && (
                <div className="p-3 rounded-xl bg-amber-50 text-wedding-red font-medium text-xs border border-amber-200 flex items-center justify-between shadow-sm">
                  <span>{syncToast}</span>
                </div>
              )}

              {/* Guest Table / Cards */}
              <div className="space-y-2.5">
                {filteredGuests.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-sm">
                    Không tìm thấy khách mời nào phù hợp.
                  </div>
                ) : (
                  filteredGuests.map((g) => {
                    const isSent = !!sentMap[g.id];
                    const isCopied = copiedId === g.id;
                    const previewUrl = `${window.location.origin}${window.location.pathname}?g=${encodeURIComponent(g.id)}`;

                    return (
                      <div
                        key={g.id}
                        className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSent 
                            ? 'bg-emerald-50/40 border-emerald-200' 
                            : 'bg-white border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        {/* Guest details */}
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSent}
                            onChange={() => toggleSent(g.id)}
                            className="mt-1 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
                            title="Đánh dấu đã gửi"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-base">
                                {g.prefix} {g.name}
                              </span>
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-stone-100 text-stone-600">
                                {g.group}
                              </span>
                              {g.table && (
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                                  {g.table}
                                </span>
                              )}
                            </div>
                            {g.message && (
                              <p className="text-xs text-stone-500 italic mt-0.5 line-clamp-1">
                                "{g.message}"
                              </p>
                            )}
                            <p className="text-[11px] font-mono text-stone-400 mt-1">
                              ID: {g.id} {g.phone && `• SĐT: ${g.phone}`}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => copyInviteMessage(g)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-wedding-red text-amber-200 hover:bg-wedding-red-700'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Đã chép tin Zalo!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Chép tin nhắn Zalo</span>
                              </>
                            )}
                          </button>

                          <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
                            title="Xem thiệp của khách này"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SHEETS SETUP */}
          {activeTab === 'sheets' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <span>Google Sheet - Nguồn Dữ Liệu Duy Nhất</span>
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={downloadTemplateCSV}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200"
                      title="Tải mẫu danh sách khách mời (Tab 1: KhachMoi)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Mẫu Khách Mời</span>
                    </button>
                    <button
                      onClick={downloadConfigTemplateCSV}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200"
                      title="Tải mẫu thông tin cô dâu, chú rể, bố mẹ, nhà hàng (Tab 2: ThongTin)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Mẫu Thông Tin</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-stone-600">
                  Google Sheet của bạn là <b>Single Source of Truth</b> duy nhất. Toàn bộ tên cô dâu chú rể, bố mẹ hai bên, địa chỉ, nhà hàng, link Google Maps và danh sách khách mời đều được đọc tự động từ Google Sheet!
                </p>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-stone-700">
                    Đường dẫn Google Sheet (hoặc Sheet ID)
                  </label>
                  <input
                    type="text"
                    value={sheetInput}
                    onChange={(e) => setSheetInput(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1ZMD3XsVahAng0uJNZ6y5Rluof72DSoYGtni7_u_lqqU/edit"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-wedding-red focus:outline-none font-mono"
                  />
                </div>

                <button
                  onClick={() => loadGuests(sheetInput, true)}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Lưu &amp; Đồng Bộ Toàn Bộ Dữ Liệu</span>
                </button>

                {statusMsg && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${
                    statusMsg.includes('Lỗi') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {statusMsg}
                  </div>
                )}
              </div>

              {/* Live Info Preview from Google Sheet */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-bold text-base text-stone-800 flex items-center gap-2">
                  <span>💎 Thông Tin Đang Hiển Thị (Single Source of Truth)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <p className="font-bold text-wedding-red text-sm">🎩 Nhà Trai (Chú Rể)</p>
                    <p><b>Họ tên:</b> {config.groom.fullName} ({config.groom.shortName})</p>
                    <p><b>Thân phụ:</b> {config.groom.father}</p>
                    <p><b>Thân mẫu:</b> {config.groom.mother}</p>
                    <p><b>Địa chỉ:</b> {config.groom.address}</p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <p className="font-bold text-wedding-red text-sm">👰 Nhà Gái (Cô Dâu)</p>
                    <p><b>Họ tên:</b> {config.bride.fullName} ({config.bride.shortName})</p>
                    <p><b>Thân phụ:</b> {config.bride.father}</p>
                    <p><b>Thân mẫu:</b> {config.bride.mother}</p>
                    <p><b>Địa chỉ:</b> {config.bride.address}</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs space-y-1">
                  <p className="font-bold text-amber-900">🏰 Địa Điểm &amp; Thời Gian</p>
                  <p><b>Nhà hàng:</b> {config.restaurant.name} - {config.restaurant.hall}</p>
                  <p><b>Địa chỉ:</b> {config.restaurant.address}</p>
                  <p><b>Ngày tổ chức:</b> {config.displayDate} ({config.lunarDate})</p>
                </div>
              </div>

              {/* YouTube Background Music Configuration */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                  <Music className="w-5 h-5 text-red-600" />
                  <span>Nhạc Nền YouTube</span>
                </h3>
                <p className="text-sm text-stone-600">
                  Dán đường link bất kỳ bài hát YouTube nào (hoặc Video ID) bạn muốn phát làm nhạc nền khi khách mở thiệp cưới.
                </p>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-stone-700">
                    Đường dẫn YouTube (URL hoặc Video ID)
                  </label>
                  <input
                    type="text"
                    value={ytInput}
                    onChange={(e) => setYtInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=1YBl3Zbt80A"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-wedding-red focus:outline-none font-mono"
                  />
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('wedding_youtube_url', ytInput.trim());
                    setYtSaved(true);
                    setTimeout(() => setYtSaved(false), 2500);
                  }}
                  className="w-full py-2.5 rounded-xl bg-wedding-red hover:bg-wedding-red-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Music className="w-4 h-4" />
                  <span>{ytSaved ? "Đã Lưu & Đang Áp Dụng Nhạc Mới!" : "Lưu Link Nhạc YouTube"}</span>
                </button>
              </div>

              {/* 2-Way Real-Time Sync Configuration */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    <span>Đồng Bộ 2 Chiều Trực Tiếp Lên Google Sheet</span>
                  </h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
                      setCodeCopied(true);
                      setTimeout(() => setCodeCopied(false), 2500);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{codeCopied ? "Đã sao chép mã!" : "Sao Chép Mã Apps Script"}</span>
                  </button>
                </div>
                <p className="text-sm text-stone-600">
                  Khi tích chọn <b>[✓] Đã gửi</b> trên web, trạng thái sẽ tự động được ghi thẳng vào cột H (<b>trang_thai</b>) trên file Google Sheet của bạn ngay tức thì!
                </p>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-stone-700">
                    Đường dẫn Web App (Apps Script Webhook URL)
                  </label>
                  <input
                    type="text"
                    value={scriptInput}
                    onChange={(e) => setScriptInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-wedding-red focus:outline-none font-mono"
                  />
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('wedding_apps_script_url', scriptInput.trim());
                    setScriptSaved(true);
                    setTimeout(() => setScriptSaved(false), 2500);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{scriptSaved ? "Đã Lưu Cấu Hình Đồng Bộ 2 Chiều!" : "Lưu URL Đồng Bộ 2 Chiều"}</span>
                </button>
                
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1.5">
                  <p className="font-semibold text-blue-950">⚡ 3 bước thiết lập đồng bộ 2 chiều (Chỉ làm 1 lần):</p>
                  <p>1. Mở file Google Sheet của bạn ➔ chọn <b>Tiện ích mở rộng (Extensions)</b> ➔ <b>Apps Script</b>.</p>
                  <p>2. Xoá hết mã cũ, bấm nút <b>"Sao Chép Mã Apps Script"</b> ở trên rồi dán vào.</p>
                  <p>3. Bấm <b>Triển khai (Deploy)</b> ➔ <b>Tùy chọn triển khai mới (New deployment)</b> ➔ Chọn biểu tượng bánh răng chọn <b>Ứng dụng web (Web app)</b> ➔ Người có quyền truy cập: <b>Bất kỳ ai (Anyone)</b> ➔ Bấm <b>Triển khai</b> và dán link vào ô này!</p>
                </div>
              </div>

              {/* Step by step guide */}
              <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-900 text-sm">
                  📌 Cấu Trúc Google Sheet Chuẩn (2 Tab - Single Source of Truth):
                </h4>
                <div className="text-xs sm:text-sm text-amber-950 space-y-2">
                  <div>
                    <strong>Tab 1: "KhachMoi" (Danh sách khách mời):</strong>
                    <code className="block mt-1 p-2 bg-white rounded border border-amber-200 text-xs font-mono text-stone-800">
                      id, xung_ho, ho_ten, nhom, ban, loi_nhan, sdt, trang_thai
                    </code>
                  </div>
                  <div>
                    <strong>Tab 2: "ThongTin" (Thông tin cô dâu, chú rể, bố mẹ, nhà hàng):</strong>
                    <p className="text-xs text-stone-600 mt-0.5">Bấm nút <b>"Mẫu Thông Tin"</b> ở trên để tải file mẫu định dạng Key-Value chuẩn về import vào Google Sheet!</p>
                    <code className="block mt-1 p-2 bg-white rounded border border-amber-200 text-xs font-mono text-stone-800">
                      key, gia_tri, mo_ta
                    </code>
                  </div>
                  <div className="pt-2 border-t border-amber-200 text-xs">
                    <b>Lưu ý chia sẻ:</b> Trên Google Sheet, ấn nút <b>"Chia sẻ" (Share)</b> ➔ chọn <b>"Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with link can view)</b> để trang web đọc dữ liệu tự động.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
