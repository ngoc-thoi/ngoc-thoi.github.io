import { defaultGuests } from '../data/defaultGuests';

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

const CACHE_KEY = 'wedding_guests_data';
const CACHE_TIME_KEY = 'wedding_guests_last_fetch';
const CACHE_DURATION = 60 * 1000; // 1 minute cache for near-real-time updates

export async function fetchGuestsFromGoogleSheet(sheetId, sheetName = 'Sheet1', forceRefresh = false) {
  if (!sheetId) {
    return defaultGuests;
  }

  // Check cache unless forceRefresh
  if (!forceRefresh) {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION)) {
        return JSON.parse(cachedData);
      }
    } catch (e) {
      console.warn('Could not read from localStorage cache:', e);
    }
  }

  // Real-time cache buster query parameter
  const cacheBuster = `&_t=${Date.now()}`;
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}${cacheBuster}`;

  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Google Sheet request failed with status: ${response.status}`);
    }
    const csvText = await response.text();
    const guests = parseCSV(csvText);

    if (guests && guests.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(guests));
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

// Google Apps Script code template to copy-paste into Google Sheet
export const GOOGLE_APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    
    // Đảm bảo cột H (cột 8) có tiêu đề 'trang_thai'
    if (sheet.getRange(1, 8).getValue() === "") {
      sheet.getRange(1, 8).setValue("trang_thai");
    }
    
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim().toLowerCase() === String(data.id).trim().toLowerCase()) {
        sheet.getRange(i + 1, 8).setValue(data.status ? "Đã gửi" : "Chưa gửi");
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

// Format template for Google Sheets
export const GOOGLE_SHEET_TEMPLATE_CSV = `id,xung_ho,ho_ten,nhom,ban,loi_nhan,sdt,trang_thai
duc-nv,Bạn,Nguyễn Văn Đức,Bạn Cấp 3,Bàn 06,Rất vui vì cậu đã luôn đồng hành cùng chúng mình!,0901234567,Chưa gửi
lan-anh,Chị,Trần Lan Anh,Đồng Nghiệp,Bàn 12,Cảm ơn chị luôn chỉ dẫn em suốt thời gian qua.,0912345678,Chưa gửi
tuan-anh,Anh,Vũ Tuấn Anh,Bạn Chú Rể,Bàn 05,Hôm đó nhớ đến sớm cụng ly cùng anh em nhé!,0987654321,Chưa gửi
gia-dinh-bac-hung,Gia đình,Bác Hùng & Bác Hương,Họ Hàng,Bàn VIP 02,Kính mời hai Bác cùng gia đình đến chung vui.,0933221100,Chưa gửi
phuong-thao,Em,Đỗ Phương Thảo,Bạn Cô Dâu,Bàn 08,Nhớ đến sớm chụp ảnh kỷ niệm thật nhiều nha!,0944556677,Chưa gửi`;
