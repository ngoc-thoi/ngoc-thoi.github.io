import { useState, useEffect, useCallback } from 'react';
import { weddingConfig as initialFallbackConfig } from '../config/weddingConfig';
import { 
  fetchGuestsFromGoogleSheet, 
  fetchWeddingConfigFromGoogleSheet 
} from '../services/googleSheetsService';
import { defaultGuests } from '../data/defaultGuests';

export function useGuest() {
  const [config, setConfig] = useState(initialFallbackConfig);
  const [guest, setGuest] = useState({
    id: 'default',
    prefix: 'Quý',
    name: 'Khách Quý & Bạn Bè',
    group: 'Khách Mời',
    table: '',
    message: '',
    isCustom: false
  });
  const [allGuests, setAllGuests] = useState(defaultGuests);
  const [loading, setLoading] = useState(true);

  const loadAllData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const guestId = params.get('g') || params.get('id');
    const directName = params.get('to') || params.get('name');
    const directPrefix = params.get('p') || params.get('prefix') || 'Bạn';
    const directTable = params.get('table') || params.get('b') || '';
    const directMsg = params.get('msg') || '';

    const savedSheetId = localStorage.getItem('wedding_sheet_id') || initialFallbackConfig.googleSheets.sheetId;

    // 1. Fetch live Wedding Configuration (Bride, Groom, Parents, Restaurant, Address, etc.)
    const liveConfig = await fetchWeddingConfigFromGoogleSheet(savedSheetId, forceRefresh);
    setConfig(liveConfig);

    // 2. Direct URL parameter takes immediate precedence for guest if provided
    if (directName) {
      setGuest({
        id: 'custom-url',
        prefix: directPrefix,
        name: directName,
        group: 'Bạn Bè',
        table: directTable,
        message: directMsg,
        isCustom: true
      });
      setLoading(false);
      return;
    }

    // 3. Fetch Guest list from Google Sheet
    const guests = await fetchGuestsFromGoogleSheet(savedSheetId, 'KhachMoi', forceRefresh);
    setAllGuests(guests);

    if (guestId) {
      const found = guests.find(g => 
        g.id.toLowerCase() === guestId.toLowerCase() ||
        g.phone === guestId
      );

      if (found) {
        setGuest({
          ...found,
          isCustom: true
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAllData(false);
  }, [loadAllData]);

  return { guest, allGuests, config, loading, refreshAll: () => loadAllData(true) };
}
