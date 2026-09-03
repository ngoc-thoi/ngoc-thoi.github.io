import { defaultGuests } from '../data/defaultGuests';
import { weddingConfig as fallbackConfig } from '../config/weddingConfig';

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

    // Map flexible column names to standard keys
    const guest = {
      id: rowObj.id || `guest-${i}`,
      prefix: rowObj.xungho || rowObj.prefix || rowObj.danhxung || 'Bạn',
      name: rowObj.hoten || rowObj.name || rowObj.ten || '',
      group: rowObj.nhom || rowObj.group || 'Khách Mời',
      table: rowObj.ban || rowObj.table || '',
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

// Parse Key-Value Config CSV from Tab 'ThongTin'
export function parseConfigCSV(csvText) {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return null;

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
  // Verify this is a key-value config sheet (should have 'key' header)
  if (!headers.includes('key')) {
    return null;
  }

  const keyIdx = headers.indexOf('key');
  const valIdx = headers.findIndex(h => h === 'giatri' || h === 'value' || h === 'val');
  if (valIdx === -1) return null;

  const map = {};
  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.length > 1 && values[keyIdx]) {
      const k = values[keyIdx].trim().toLowerCase();
      const v = values[valIdx] !== undefined ? values[valIdx].trim() : '';
      if (k) map[k] = v;
    }
  }

  return map;
}

// Deep merge remote config map into fallback weddingConfig
export function mergeConfig(remoteMap) {
  if (!remoteMap) return fallbackConfig;

  return {
    groom: {
      ...fallbackConfig.groom,
      shortName: remoteMap['chu_re_ten_ngan'] || fallbackConfig.groom.shortName,
      fullName: remoteMap['chu_re_ho_ten'] || fallbackConfig.groom.fullName,
      father: remoteMap['chu_re_bo'] || fallbackConfig.groom.father,
      mother: remoteMap['chu_re_me'] || fallbackConfig.groom.mother,
      address: remoteMap['chu_re_dia_chi'] || fallbackConfig.groom.address,
      avatar: remoteMap['chu_re_anh'] || fallbackConfig.groom.avatar,
    },
    bride: {
      ...fallbackConfig.bride,
      shortName: remoteMap['co_dau_ten_ngan'] || fallbackConfig.bride.shortName,
      fullName: remoteMap['co_dau_ho_ten'] || fallbackConfig.bride.fullName,
      father: remoteMap['co_dau_bo'] || fallbackConfig.bride.father,
      mother: remoteMap['co_dau_me'] || fallbackConfig.bride.mother,
      address: remoteMap['co_dau_dia_chi'] || fallbackConfig.bride.address,
      avatar: remoteMap['co_dau_anh'] || fallbackConfig.bride.avatar,
    },
    weddingDate: remoteMap['ngay_cuoi_iso'] || fallbackConfig.weddingDate,
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
const CACHE_TIME_KEY = 'wedding_last_fetch';
const CACHE_DURATION = 30 * 1000; // 30 seconds cache for rapid sync

export async function fetchWeddingConfigFromGoogleSheet(sheetId, forceRefresh = false) {
  if (!sheetId) return fallbackConfig;

  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CONFIG_CACHE_KEY);
      const time = localStorage.getItem(CACHE_TIME_KEY);
      if (cached && time && (Date.now() - parseInt(time, 10) < CACHE_DURATION)) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Config cache read error:', e);
    }
  }

  // Try fetching tab 'ThongTin'
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=ThongTin&_t=${Date.now()}`;
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
    console.warn('Failed to fetch ThongTin tab from Google Sheet:', err);
  }

  return fallbackConfig;
}

export async function fetchGuestsFromGoogleSheet(sheetId, sheetName = 'KhachMoi', forceRefresh = false) {
  if (!sheetId) return defaultGuests;

  if (!forceRefresh) {
    try {
      const cachedData = localStorage.getItem(GUESTS_CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION)) {
        return JSON.parse(cachedData);
      }
    } catch (e) {
      console.warn('Could not read from localStorage cache:', e);
    }
  }

  // Try tab 'KhachMoi' first, fallback to 'Sheet1'
  const tryFetchSheet = async (name) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}&_t=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) return null;
    const csvText = await response.text();
    return parseCSV(csvText);
  };

  try {
    let guests = await tryFetchSheet(sheetName);
    if (!guests || guests.length === 0) {
      guests = await tryFetchSheet('Sheet1');
    }

    if (guests && guests.length > 0) {
      try {
        localStorage.setItem(GUESTS_CACHE_KEY, JSON.stringify(guests));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      } catch (e) {
        console.warn('Could not save guests to localStorage:', e);
      }
      return guests;
    }
  } catch (error) {
    console.warn('Failed to fetch from Google Sheet, using fallback:', error);
  }

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
    // Tìm trang tính chứa danh sách khách (KhachMoi hoặc Sheet1)
    var sheet = ss.getSheetByName("KhachMoi") || ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    var rows = sheet.getDataRange().getValues();
    
    // Tìm cột 'trang_thai' (mặc định cột 8 / H nếu chưa có)
    var colIdx = 8;
    for (var c = 0; c < rows[0].length; c++) {
      var h = String(rows[0][c]).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (h === 'trangthai' || h === 'dagui' || h === 'status') {
        colIdx = c + 1;
        break;
      }
    }
    
    // Đảm bảo cột có tiêu đề nếu đang trống
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
chu_re_ho_ten,Vũ Đình Ngọc,Họ tên đầy đủ chú rể
chu_re_bo,Vũ Văn Minh,Thân phụ chú rể
chu_re_me,Trần Thị Mai,Thân mẫu chú rể
chu_re_dia_chi,Hoàn Kiếm, Hà Nội,Địa chỉ gia đình nhà trai
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
nhac_youtube_url,https://www.youtube.com/watch?v=3UyotSd-Cp4,Link YouTube bài hát cưới phát nền
nhac_tieu_de,Ánh Nắng Của Anh - Đức Phúc,Tên bài hát hiển thị`;
