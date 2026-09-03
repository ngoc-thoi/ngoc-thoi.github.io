import { defaultGuests } from '../data/defaultGuests';
import { weddingConfig as fallbackConfig } from '../config/weddingConfig';

// Helper to extract clean Sheet ID if full URL is passed
export function cleanSheetId(idOrUrl) {
  if (!idOrUrl) return '';
  const match = idOrUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : idOrUrl.trim();
}

// Helper to parse CSV rows accounting for commas inside quotes
export function parseCSV(csvText) {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const parseRow = (rowStr) => {
    const result = [];
    let insideQuote = false;
    let current = '';
    
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"') {
        if (insideQuote && rowStr[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.length === 0 || !values[0]) continue;

    const rowObj = {};
    headers.forEach((header, idx) => {
      rowObj[header] = values[idx] || '';
    });

    const isSentVal = rowObj.trangthai || rowObj.dagui || rowObj.status || '';
    const isSent = typeof isSentVal === 'string' 
      ? isSentVal.toLowerCase().includes('đã') || isSentVal.toLowerCase().includes('yes') || isSentVal === 'true'
      : Boolean(isSentVal);

    // Map flexible column names to standard keys (excluding table info)
    const guest = {
      id: rowObj.id || `guest-${i}`,
      prefix: rowObj.xungho || rowObj.prefix || rowObj.danhxung || 'Bạn',
      name: rowObj.hoten || rowObj.name || rowObj.ten || '',
      group: rowObj.nhom || rowObj.group || 'Khách Mời',
      message: rowObj.loinhan || rowObj.message || rowObj.ghichu || '',
      phone: rowObj.sdt || rowObj.phone || '',
      isSent: isSent
    };

    if (guest.name) {
      data.push(guest);
    }
  }

  return data;
}

// Parse Key-Value Config CSV from Tab 'mau_thong_tin_dam_cuoi' or 'ThongTin'
export function parseConfigCSV(csvText) {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return null;

  const parseRow = (rowStr) => {
    const result = [];
    let insideQuote = false;
    let current = '';
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"') {
        if (insideQuote && rowStr[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const map = {};

  for (const line of lines) {
    const row = parseRow(line);
    // Trim empty trailing columns
    while (row.length > 0 && !row[row.length - 1]) {
      row.pop();
    }
    if (row.length < 2) continue;

    const k = row[0].trim().toLowerCase();
    if (k === 'key' || !k) continue;

    let val = '';
    if (row.length === 2 || row.length === 3) {
      val = row[1].trim();
    } else {
      // Rejoin all middle values split by comma (excluding the last column which is description 'mo_ta')
      val = row.slice(1, -1).map(p => p.trim()).filter(Boolean).join(', ');
    }

    if (k && val) {
      map[k] = val;
    }
  }

  return Object.keys(map).length > 0 ? map : null;
}

// Deep merge remote config map into fallback weddingConfig
export function mergeConfig(remoteMap) {
  if (!remoteMap) return fallbackConfig;

  // Normalize date format if user provided '2026-10-25 11:00:00' to ISO '2026-10-25T11:00:00'
  let rawDate = remoteMap['ngay_cuoi_iso'] || fallbackConfig.weddingDate;
  if (rawDate && rawDate.includes(' ') && !rawDate.includes('T')) {
    rawDate = rawDate.replace(' ', 'T');
  }

  const isPlaceholder = (url) => !url || typeof url !== 'string' || url.includes('unsplash.com');

  return {
    eventType: fallbackConfig.eventType,
    heroPhoto: fallbackConfig.heroPhoto,
    groom: {
      ...fallbackConfig.groom,
      shortName: remoteMap['chu_re_ten_ngan'] || fallbackConfig.groom.shortName,
      fullName: remoteMap['chu_re_ho_ten'] || fallbackConfig.groom.fullName,
      father: remoteMap['chu_re_bo'] || fallbackConfig.groom.father,
      mother: remoteMap['chu_re_me'] || fallbackConfig.groom.mother,
      address: remoteMap['chu_re_dia_chi'] || fallbackConfig.groom.address,
      avatar: !isPlaceholder(remoteMap['chu_re_anh']) ? remoteMap['chu_re_anh'] : fallbackConfig.groom.avatar,
    },
    bride: {
      ...fallbackConfig.bride,
      shortName: remoteMap['co_dau_ten_ngan'] || fallbackConfig.bride.shortName,
      fullName: remoteMap['co_dau_ho_ten'] || fallbackConfig.bride.fullName,
      father: remoteMap['co_dau_bo'] || fallbackConfig.bride.father,
      mother: remoteMap['co_dau_me'] || fallbackConfig.bride.mother,
      address: remoteMap['co_dau_dia_chi'] || fallbackConfig.bride.address,
      avatar: !isPlaceholder(remoteMap['co_dau_anh']) ? remoteMap['co_dau_anh'] : fallbackConfig.bride.avatar,
    },
    weddingDate: rawDate,
    displayDate: remoteMap['ngay_cuoi_hien_thi'] || fallbackConfig.displayDate,
    lunarDate: remoteMap['ngay_cuoi_am_lich'] || fallbackConfig.lunarDate,
    restaurant: {
      ...fallbackConfig.restaurant,
      name: remoteMap['nha_hang_ten'] || fallbackConfig.restaurant.name,
      hall: remoteMap['nha_hang_sanh'] || fallbackConfig.restaurant.hall,
      address: remoteMap['nha_hang_dia_chi'] || fallbackConfig.restaurant.address,
      time: remoteMap['nha_hang_gio'] || fallbackConfig.restaurant.time,
      googleMapsDirectionsUrl: remoteMap['google_map_chi_duong'] || fallbackConfig.restaurant.googleMapsDirectionsUrl,
      googleMapsEmbedUrl: remoteMap['google_map_embed'] || fallbackConfig.restaurant.googleMapsEmbedUrl,
    },
    events: fallbackConfig.events,
    music: {
      ...fallbackConfig.music,
      title: remoteMap['nhac_tieu_de'] || fallbackConfig.music.title,
      youtubeUrl: remoteMap['nhac_youtube_url'] || fallbackConfig.music.youtubeUrl,
    },
    gallery: fallbackConfig.gallery,
    googleSheets: fallbackConfig.googleSheets,
  };
}

const GUESTS_CACHE_KEY = 'wedding_guests_data';
const CONFIG_CACHE_KEY = 'wedding_config_data';

export async function fetchWeddingConfigFromGoogleSheet(sheetIdOrUrl) {
  const sheetId = cleanSheetId(sheetIdOrUrl);
  if (!sheetId) return fallbackConfig;

  // Candidate tabs for wedding metadata (mau_thong_tin_dam_cuoi prioritized)
  const candidateTabs = ['mau_thong_tin_dam_cuoi', 'ThongTin', 'thongtin', 'Thông tin', 'Config', 'config', 'Sheet2'];

  for (const tab of candidateTabs) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&headers=0&sheet=${encodeURIComponent(tab)}&_t=${Date.now()}`;
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (res.ok) {
        const csv = await res.text();
        const map = parseConfigCSV(csv);
        if (map && Object.keys(map).length > 0) {
          const merged = mergeConfig(map);
          try {
            localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(merged));
          } catch {}
          return merged;
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch tab ${tab}:`, err);
    }
  }

  // Fallback to offline cached config if available
  try {
    const cached = localStorage.getItem(CONFIG_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}

  return fallbackConfig;
}

export async function fetchGuestsFromGoogleSheet(sheetIdOrUrl, sheetName = 'KhachMoi') {
  const sheetId = cleanSheetId(sheetIdOrUrl);
  if (!sheetId) return defaultGuests;

  const tryFetchSheet = async (name) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&headers=0&sheet=${encodeURIComponent(name)}&_t=${Date.now()}`;
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) return null;
      const csvText = await response.text();
      return parseCSV(csvText);
    } catch {
      return null;
    }
  };

  const candidateTabs = [sheetName, 'mau_danh_sach_khach_moi', 'KhachMoi', 'khachmoi', 'Khách mời', 'Sheet1', 'Trang tính 1'];

  for (const tab of candidateTabs) {
    try {
      const guests = await tryFetchSheet(tab);
      if (guests && guests.length > 0) {
        try {
          localStorage.setItem(GUESTS_CACHE_KEY, JSON.stringify(guests));
        } catch (e) {
          console.warn('Could not save guests to localStorage:', e);
        }
        return guests;
      }
    } catch (err) {
      console.warn(`Failed fetching tab ${tab}:`, err);
    }
  }

  // If network error, use cached guests
  try {
    const cachedData = localStorage.getItem(GUESTS_CACHE_KEY);
    if (cachedData) return JSON.parse(cachedData);
  } catch {}

  return defaultGuests;
}

// 2-Way Sync: Update guest status directly in Google Sheets via Google Apps Script Webhook
export async function updateGuestStatusInGoogleSheet(scriptUrl, guestId, isSent) {
  if (!scriptUrl) return false;

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        id: guestId,
        status: isSent
      })
    });
    return true;
  } catch (err) {
    console.warn('Error syncing status to Google Sheet:', err);
    return false;
  }
}

// Google Apps Script code template to copy-paste into Google Sheet for 2-way sync
export const GOOGLE_APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("mau_danh_sach_khach_moi") || ss.getSheetByName("KhachMoi") || ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    var rows = sheet.getDataRange().getValues();
    
    var colIdx = 7;
    for (var c = 0; c < rows[0].length; c++) {
      var h = String(rows[0][c]).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (h === 'trangthai' || h === 'dagui' || h === 'status') {
        colIdx = c + 1;
        break;
      }
    }
    
    if (sheet.getRange(1, colIdx).getValue() === "") {
      sheet.getRange(1, colIdx).setValue("trang_thai");
    }
    
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim().toLowerCase() === String(data.id).trim().toLowerCase()) {
        sheet.getRange(i + 1, colIdx).setValue(data.status ? "Đã gửi" : "Chưa gửi");
        return ContentService.createTextOutput(JSON.stringify({status: "success"}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({status: "not_found"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

// Format template for Tab 1: KhachMoi (No table column needed)
export const GOOGLE_SHEET_TEMPLATE_CSV = `id,xung_ho,ho_ten,nhom,loi_nhan,sdt,trang_thai
duc-nv,Bạn,Nguyễn Văn Đức,Bạn Cấp 3,Rất vui vì cậu đã luôn đồng hành cùng chúng mình!,0901234567,Chưa gửi
lan-anh,Chị,Trần Lan Anh,Đồng Nghiệp,Cảm ơn chị luôn chỉ dẫn em suốt thời gian qua.,0912345678,Chưa gửi
tuan-anh,Anh,Vũ Tuấn Anh,Bạn Chú Rể,Hôm đó nhớ đến sớm cụng ly cùng anh em nhé!,0987654321,Chưa gửi
gia-dinh-bac-hung,Gia đình,Bác Hùng & Bác Hương,Họ Hàng,Kính mời hai Bác cùng gia đình đến chung vui.,0933221100,Chưa gửi
phuong-thao,Em,Đỗ Phương Thảo,Bạn Cô Dâu,Nhớ đến sớm chụp ảnh kỷ niệm thật nhiều nha!,0944556677,Chưa gửi`;

// Format template for Tab 2: ThongTin (Single Source of Truth for all wedding info)
export const GOOGLE_SHEET_CONFIG_TEMPLATE_CSV = `key,gia_tri,mo_ta
chu_re_ten_ngan,Ngọc,Tên thân mật chú rể
chu_re_ho_ten,Nguyễn Ngọc Thời,Họ tên đầy đủ chú rể
chu_re_bo,Hồng Khánh,Thân phụ chú rể
chu_re_me,Trần Thị Mai,Thân mẫu chú rể
chu_re_dia_chi,Sài gòn, Hà Nội,Địa chỉ gia đình nhà trai
chu_re_anh,https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80,Link ảnh chú rể
co_dau_ten_ngan,Thơi,Tên thân mật cô dâu
co_dau_ho_ten,Nguyễn Thị Thơi,Họ tên đầy đủ cô dâu
co_dau_bo,Nguyễn Văn Dũng,Thân phụ cô dâu
co_dau_me,Lê Thị Thảo,Thân mẫu cô dâu
co_dau_dia_chi,Cầu Giấy, Hà Nội,Địa chỉ gia đình nhà gái
co_dau_anh,https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80,Link ảnh cô dâu
ngay_cuoi_iso,2026-10-25T11:00:00,Thời gian cho đồng hồ đếm ngược (YYYY-MM-DDTHH:mm:ss)
ngay_cuoi_hien_thi,Chủ Nhật, ngày 25 tháng 10 năm 2026,Ngày cưới hiển thị trang trọng
ngay_cuoi_am_lich,Tức ngày 15 tháng 09 năm Bính Ngọ (Âm Lịch),Ngày âm lịch
nha_hang_ten,Trung Tâm Hội Nghị & Tiệc Cưới Trống Đồng Palace,Tên nhà hàng tổ chức tiệc
nha_hang_sanh,Sảnh Hoàng Gia (Tầng 2),Sảnh tiệc
nha_hang_dia_chi,72 Quán Sứ, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội,Địa chỉ nhà hàng
nha_hang_gio,11:00,Giờ đón khách khai tiệc
google_map_chi_duong,https://www.google.com/maps/dir/?api=1&destination=Tr%E1%BB%91ng+%C4%90%E1%BB%93ng+Palace+72+Qu%C3%A1n+S%E1%BB%A9+H%C3%A0+N%E1%BB%99i,Link chỉ đường Google Maps
google_map_embed,https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.2387146599723!2d105.84277027587399!3d21.023133387970726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab96b613d9bb%3A0x63351d8b1aa7066f!2zVHLhu5FuZyDEkOG7k25nIFBhbGFjZSBRdcOhbiBT4bup!5e0!3m2!1svi!2s!4v1709470000000!5m2!1svi!2s,Link nhúng bản đồ iframe
nhac_youtube_url,https://www.youtube.com/watch?v=SpIErVx5c0A&list=RD3UyotSd-Cp4&index=6,Link YouTube bài hát cưới phát nền
nhac_tieu_de,Ánh Nắng Của Anh - Đức Phúc,Tên bài hát hiển thị`;
