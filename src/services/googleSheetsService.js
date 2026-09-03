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

    // Map flexible column names to standard keys
    const guest = {
      id: rowObj.id || `guest-${i}`,
      prefix: rowObj.xungho || rowObj.prefix || rowObj.danhxung || 'Bạn',
      name: rowObj.hoten || rowObj.name || rowObj.ten || '',
      group: rowObj.nhom || rowObj.group || 'Khách Mời',
      table: rowObj.ban || rowObj.table || '',
      message: rowObj.loinhan || rowObj.message || rowObj.ghichu || '',
      phone: rowObj.sdt || rowObj.phone || ''
    };

    if (guest.name) {
      data.push(guest);
    }
  }

  return data;
}

const CACHE_KEY = 'wedding_guests_data';
const CACHE_TIME_KEY = 'wedding_guests_last_fetch';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export async function fetchGuestsFromGoogleSheet(sheetId, sheetName = 'Sheet1') {
  if (!sheetId) {
    return defaultGuests;
  }

  // Check cache first
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION)) {
      return JSON.parse(cachedData);
    }
  } catch (e) {
    console.warn('Could not read from localStorage cache:', e);
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
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

// Format template for Google Sheets
export const GOOGLE_SHEET_TEMPLATE_CSV = `id,xung_ho,ho_ten,nhom,ban,loi_nhan,sdt
duc-nv,Bạn,Nguyễn Văn Đức,Bạn Cấp 3,Bàn 06,Rất vui vì cậu đã luôn đồng hành cùng chúng mình!,0901234567
lan-anh,Chị,Trần Lan Anh,Đồng Nghiệp,Bàn 12,Cảm ơn chị luôn chỉ dẫn em suốt thời gian qua.,0912345678
tuan-anh,Anh,Vũ Tuấn Anh,Bạn Chú Rể,Bàn 05,Hôm đó nhớ đến sớm cụng ly cùng anh em nhé!,0987654321
gia-dinh-bac-hung,Gia đình,Bác Hùng & Bác Hương,Họ Hàng,Bàn VIP 02,Kính mời hai Bác cùng gia đình đến chung vui.,0933221100
phuong-thao,Em,Đỗ Phương Thảo,Bạn Cô Dâu,Bàn 08,Nhớ đến sớm chụp ảnh kỷ niệm thật nhiều nha!,0944556677`;
