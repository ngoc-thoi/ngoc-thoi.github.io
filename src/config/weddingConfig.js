// Configuration for Tiệc Báo Hỷ (Post-wedding celebration for friends)
// Inspired by ChungDoi invitation of Ngọc Thời & Khánh Hồng

export const weddingConfig = {
  // Event Type
  eventType: "Tiệc Báo Hỷ",
  eventSubtitle: "Mừng Hạnh Phúc Cùng Bạn Bè Thân Thiết",

  // Couple Information
  groom: {
    fullName: "Nguyễn Ngọc Thời",
    shortName: "Ngọc Thời",
    title: "Chú Rể",
    father: "Hồng Khánh",
    mother: "Trần Thị Mai",
    address: "Hồ Chí Minh",
    avatar: "https://cdn.chungdoi.com/uploads/183ce68b-10af-481e-ac82-5c983182d2c8.jpg",
  },
  bride: {
    fullName: "Nguyễn Thị Khánh Hồng",
    shortName: "Khánh Hồng",
    title: "Cô Dâu",
    father: "Nguyễn Văn Dũng",
    mother: "Lê Thị Thảo",
    address: "Hồ Chí Minh",
    avatar: "https://cdn.chungdoi.com/uploads/6bdc27f3-d2b7-43f3-af42-7aea757fd7f5.jpg",
  },

  // Hero Featured Photo
  heroPhoto: "https://cdn.chungdoi.com/uploads/f7ad6966-5f55-4377-8d63-9f3386eb2442.jpg",
  ogPhoto: "https://cdn.chungdoi.com/uploads/975554a8-cc0b-4530-bf52-a8498150f078.jpg",

  // Main Celebration Date: Chủ Nhật, 20/09/2026
  weddingDate: "2026-09-20T17:30:00",
  displayDate: "Chủ Nhật, ngày 20 tháng 09 năm 2026",
  lunarDate: "Tức ngày 10 tháng 08 năm Bính Ngọ (Âm Lịch)",

  // Main Celebration Banquet (Tiệc Báo Hỷ Tại Nhà Hàng)
  restaurant: {
    name: "Ẩm Thực Thất Sơn",
    hall: "Sảnh Tiệc Báo Hỷ",
    address: "104 Nguyễn Thị Kiêu, Thới An, Quận 12, TP. Hồ Chí Minh",
    time: "17:30",
    date: "20/09/2026",
    banquetTime: "18:00",
    googleMapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=%E1%BA%A8m+th%E1%BB%B1c+Th%E1%BA%A5t+S%E1%BB%91n+104+Nguy%E1%BB%85n+Th%E1%BB%8B+Ki%C3%AAu+Th%E1%BB%9Bi+An+Qu%E1%BA%ADn+12+H%E1%BB%93+Ch%C3%AD+Minh",
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=104%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Ki%C3%AAu,%20Th%E1%BB%9Bi%20An,%20Qu%E1%BA%ADn%2012,%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=16&ie=UTF8&iwloc=&output=embed"
  },

  // Tiệc Báo Hỷ Schedule
  events: [
    {
      title: "Đón Khách & Chụp Ảnh",
      time: "17:30 - 20/09/2026",
      location: "Ẩm Thực Thất Sơn - 104 Nguyễn Thị Kiêu, Q.12, TP.HCM",
      description: "Đón tiếp những người bạn thân thương & lưu giữ khoảnh khắc đẹp"
    },
    {
      title: "Khai Tiệc Báo Hỷ",
      time: "18:00 - 20/09/2026",
      location: "Ẩm Thực Thất Sơn - 104 Nguyễn Thị Kiêu, Q.12, TP.HCM",
      description: "Nâng ly chung vui, chia sẻ niềm hạnh phúc cùng cô dâu & chú rể",
      highlight: true
    },
    {
      title: "Giao Lưu & Chúc Mừng",
      time: "19:30 - 20/09/2026",
      location: "Ẩm Thực Thất Sơn - 104 Nguyễn Thị Kiêu, Q.12, TP.HCM",
      description: "Trò chuyện thân mật, chúc phúc cho hành trình mới"
    }
  ],

  // Background Music
  music: {
    title: "Ánh Nắng Của Anh - Đức Phúc",
    youtubeUrl: "https://www.youtube.com/watch?v=SpIErVx5c0A&list=RD3UyotSd-Cp4&index=6",
    fallbackAudioUrl: ""
  },

  // All 20 Photos from ChungDoi
  gallery: [
    {
      url: "https://cdn.chungdoi.com/uploads/183ce68b-10af-481e-ac82-5c983182d2c8.jpg",
      caption: "Khoảnh khắc ngọt ngào"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/6bdc27f3-d2b7-43f3-af42-7aea757fd7f5.jpg",
      caption: "Nụ cười hạnh phúc"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/16ae709b-994d-4d59-a20a-36fc11f57a5e.jpg",
      caption: "Tay trong tay"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/2dad5918-60de-4369-93c4-3c053b2c27e5.jpg",
      caption: "Ánh mắt yêu thương"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/a0162279-8ab9-4133-a11e-52ea5c00480e.jpg",
      caption: "Hẹn ước trăm năm"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/da0fb668-bc56-4c99-8aae-7cbd05f893d0.jpg",
      caption: "Bên nhau bình yên"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/f41aa07e-c7e0-4bbe-8d58-7ecbc32913bb.jpg",
      caption: "Khoảnh khắc tuyệt vời"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/5094d25b-07fc-4041-90ce-317acdb89072.jpg",
      caption: "Chung một mái nhà"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/c0164e7b-8930-4a48-9884-c1181fd81dda.jpg",
      caption: "Tình yêu nở hoa"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/db1364f8-f14f-4635-ba0f-d64dc8d216c6.jpg",
      caption: "Ngày rạng rỡ"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/ba5d7455-e273-4a28-8c46-84e32d9d9a20.jpg",
      caption: "Hạnh phúc giản đơn"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/206c7cae-ae0a-435a-9bf8-2e6f6d82c23c.jpg",
      caption: "Cùng nhau già đi"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/e2a37b14-5e2f-4b79-8650-46135adb6dd8.jpg",
      caption: "Chạm vào yêu thương"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/3359b134-3bad-4955-903b-e8bf352a014f.jpg",
      caption: "Lời hẹn ước"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/94c7b1b7-b161-4482-87ef-963cb6a5e826.jpg",
      caption: "Nụ cười rạng ngời"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/fce8ac14-c594-415e-90d1-9a9fff83a3ab.jpg",
      caption: "Ấm áp bên người"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/86742fc8-82c5-4a99-bebb-7b93e60c12c5.jpg",
      caption: "Kỷ niệm thanh xuân"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/ca502cfe-e5a2-4d51-987d-c0b4dc071545.jpg",
      caption: "Hành trình mới"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/a44b32cd-82e5-41e5-820b-abd12b1e47b3.jpg",
      caption: "Yêu thương đong đầy"
    },
    {
      url: "https://cdn.chungdoi.com/uploads/b1a9767c-8446-4bac-97f0-5e92385246c0.jpg",
      caption: "Mãi mãi bên nhau"
    }
  ],

  // Google Sheets Config
  googleSheets: {
    sheetId: "1ZMD3XsVahAng0uJNZ6y5Rluof72DSoYGtni7_u_lqqU",
    sheetName: "Sheet1"
  }
};
