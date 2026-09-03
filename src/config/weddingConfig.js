// Wedding configuration - easily customize all details here

export const weddingConfig = {
  // Couple Information
  groom: {
    fullName: "Vũ Đình Ngọc",
    shortName: "Ngọc",
    title: "Chú Rể",
    father: "Vũ Văn Minh",
    mother: "Trần Thị Mai",
    address: "Hoàn Kiếm, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    bank: {
      bankName: "MB Bank (Quân Đội)",
      accountNumber: "0988888888",
      accountName: "VU DINH NGOC",
      qrUrl: "https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=0&addInfo=Mung+cuoi+Ngoc+Thoi"
    }
  },
  bride: {
    fullName: "Nguyễn Thị Thơi",
    shortName: "Thơi",
    title: "Cô Dâu",
    father: "Nguyễn Văn Dũng",
    mother: "Lê Thị Thảo",
    address: "Cầu Giấy, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    bank: {
      bankName: "Techcombank",
      accountNumber: "19033333333333",
      accountName: "NGUYEN THI THOI",
      qrUrl: "https://img.vietqr.io/image/TCB-19033333333333-compact2.png?amount=0&addInfo=Mung+cuoi+Ngoc+Thoi"
    }
  },

  // Main Wedding Date (YYYY-MM-DDTHH:mm:ss for countdown)
  weddingDate: "2026-10-25T11:00:00",
  displayDate: "Chủ Nhật, ngày 25 tháng 10 năm 2026",
  lunarDate: "Tức ngày 15 tháng 09 năm Bính Ngọ (Âm Lịch)",

  // Main Wedding Banquet (Tiệc Cưới Tại Nhà Hàng)
  restaurant: {
    name: "Trung Tâm Hội Nghị & Tiệc Cưới Trống Đồng Palace",
    hall: "Sảnh Hoàng Gia (Tầng 2)",
    address: "72 Quán Sứ, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    time: "11:00",
    date: "25/10/2026",
    // Direct link to open Google Maps turn-by-turn navigation on iOS / Android / Desktop
    googleMapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Tr%E1%BB%91ng+%C4%90%E1%BB%93ng+Palace+72+Qu%C3%A1n+S%E1%BB%A9+H%C3%A0+N%E1%BB%99i",
    // Embed map for iframe
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.2387146599723!2d105.84277027587399!3d21.023133387970726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab96b613d9bb%3A0x63351d8b1aa7066f!2zVHLhu5FuZyDEkOG7k25nIFBhbGFjZSBRdcOhbiBT4bup!5e0!3m2!1svi!2s!4v1709470000000!5m2!1svi!2s"
  },

  // Events schedule
  events: [
    {
      title: "Lễ Vu Quy (Nhà Gái)",
      time: "08:00 - 25/10/2026",
      location: "Tư gia Nhà Gái: Cầu Giấy, Hà Nội",
      description: "Nghi lễ truyền thống tại tư gia nhà gái"
    },
    {
      title: "Lễ Thành Hôn (Nhà Trai)",
      time: "09:30 - 25/10/2026",
      location: "Tư gia Nhà Trai: Hoàn Kiếm, Hà Nội",
      description: "Nghi lễ đón dâu và gia tiên tại nhà trai"
    },
    {
      title: "Tiệc Cưới Chung Vui",
      time: "11:00 - 25/10/2026",
      location: "Trống Đồng Palace, 72 Quán Sứ, Hà Nội",
      description: "Khai tiệc mừng hạnh phúc cùng bạn bè & quan khách",
      highlight: true
    }
  ],

  // Background Music (Supports any YouTube URL or Video ID)
  music: {
    title: "Ánh Nắng Của Anh - Đức Phúc",
    // Paste any YouTube URL or Video ID here
    youtubeUrl: "https://www.youtube.com/watch?v=3UyotSd-Cp4",
    // Fallback direct audio if needed
    fallbackAudioUrl: ""
  },

  // Photo Gallery Placeholders (high resolution romantic wedding shots)
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
      caption: "Khoảnh khắc hẹn ước"
    },
    {
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
      caption: "Nụ cười ngày chung đôi"
    },
    {
      url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80",
      caption: "Hành trình yêu thương"
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
      caption: "Bên nhau trọn đời"
    },
    {
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
      caption: "Mùa hoa hạnh phúc"
    },
    {
      url: "https://images.unsplash.com/photo-1519225429813-825f6e626e22?w=800&auto=format&fit=crop&q=80",
      caption: "Lời hứa trọn kiếp"
    }
  ],

  // Google Sheets Config
  googleSheets: {
    // Connected to user's Google Sheet
    sheetId: "1ZMD3XsVahAng0uJNZ6y5Rluof72DSoYGtni7_u_lqqU",
    sheetName: "Sheet1"
  }
};
