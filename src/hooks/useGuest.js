import { useState, useEffect } from 'react';
import { weddingConfig } from '../config/weddingConfig';
import { fetchGuestsFromGoogleSheet } from '../services/googleSheetsService';
import { defaultGuests } from '../data/defaultGuests';

export function useGuest() {
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

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const params = new URLSearchParams(window.location.search);
      const guestId = params.get('g') || params.get('id');
      const directName = params.get('to') || params.get('name');
      const directPrefix = params.get('p') || params.get('prefix') || 'Bạn';
      const directTable = params.get('table') || params.get('b') || '';
      const directMsg = params.get('msg') || '';

      // Direct URL parameter takes immediate precedence if provided
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

      // Check configured Google Sheet ID or local override
      const savedSheetId = localStorage.getItem('wedding_sheet_id') || weddingConfig.googleSheets.sheetId;
      const guests = await fetchGuestsFromGoogleSheet(savedSheetId, weddingConfig.googleSheets.sheetName);
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
    }

    loadData();
  }, []);

  return { guest, allGuests, loading };
}
