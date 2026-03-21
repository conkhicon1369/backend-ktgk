const mongoose = require('mongoose');
const Tour = require('./models/Tour');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb:mongodb+srv://demomongo:passworddemo@cluster0.bvy1owa.mongodb.net/tour_management';

const sampleTours = [
  {
    name: 'Tour Đà Lạt 3N2Đ',
    price: 2500000,
    durationDays: 3,
    departure: 'TP.HCM',
    destination: 'Đà Lạt',
    region: 'Tây Nguyên',
    transport: 'Ôtô',
    startDate: new Date('2026-04-10'),
    endDate: new Date('2026-04-12'),
    slots: 20,
    booked: 5,
    image: 'https://images.unsplash.com/photo-1552942434-ef95e8e1a8f9?w=600',
    description: 'Trải nghiệm Đà Lạt, check-in những địa điểm nổi tiếng, tham quan và ăn uống.',
    schedule: [
      { day: 1, title: 'TP.HCM → Đà Lạt', content: 'Di chuyển, nhận phòng khách sạn' },
      { day: 2, title: 'Tham quan', content: 'Langbiang, Thung Lũng Tình Yêu, hồ Tuyền Lâm' },
      { day: 3, title: 'Mua sắm → về TP.HCM', content: 'Chợ Đà Lạt, mua đặc sản rồi về' }
    ],
    priceIncludes: ['Xe du lịch', 'Khách sạn 3 sao', 'Ăn uống theo chương trình'],
    priceExcludes: ['Chi phí cá nhân', 'VAT'],
    rating: 4.5,
    reviewsCount: 120,
    isHot: true,
    status: 'active'
  },
  {
    name: 'Tour Nha Trang 4N3Đ',
    price: 3200000,
    durationDays: 4,
    departure: 'TP.HCM',
    destination: 'Nha Trang',
    region: 'Miền Trung',
    transport: 'Máy bay',
    slots: 25,
    booked: 10,
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600',
    description: 'Khám phá biển xanh Nha Trang, lặn ngắm san hô, thưởng thức hải sản tươi ngon.',
    schedule: [
      { day: 1, title: 'TP.HCM → Nha Trang', content: 'Bay vào buổi sáng, nhận phòng, tắm biển' },
      { day: 2, title: 'Tour 4 đảo', content: 'Hòn Mun, Hòn Tằm, lặn ngắm san hô' },
      { day: 3, title: 'VinWonders', content: 'Tham quan khu vui chơi VinWonders Nha Trang' },
      { day: 4, title: 'Về TP.HCM', content: 'Mua đặc sản, ra sân bay về' }
    ],
    priceIncludes: ['Vé máy bay khứ hồi', 'Khách sạn 4 sao', 'Ăn sáng'],
    priceExcludes: ['Chi phí cá nhân', 'VAT', 'Vé VinWonders'],
    rating: 4.7,
    reviewsCount: 89,
    isHot: true,
    status: 'active'
  },
  {
    name: 'Tour Hà Nội - Hạ Long 4N3Đ',
    price: 4500000,
    durationDays: 4,
    departure: 'TP.HCM',
    destination: 'Hạ Long',
    region: 'Miền Bắc',
    transport: 'Máy bay',
    slots: 30,
    booked: 12,
    image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600',
    description: 'Khám phá vịnh Hạ Long - kỳ quan thiên nhiên thế giới, thưởng thức ẩm thực Hà Nội.',
    schedule: [
      { day: 1, title: 'TP.HCM → Hà Nội', content: 'Bay ra, tham quan phố cổ, Hồ Hoàn Kiếm' },
      { day: 2, title: 'Hà Nội → Hạ Long', content: 'Di chuyển, xuống tàu tham quan vịnh' },
      { day: 3, title: 'Hạ Long', content: 'Chèo kayak, thăm hang động, tắm biển' },
      { day: 4, title: 'Hạ Long → Hà Nội → TP.HCM', content: 'Về Hà Nội, bay về TP.HCM' }
    ],
    priceIncludes: ['Vé máy bay', 'Tàu du lịch Hạ Long', 'Khách sạn 3 sao', 'Ăn uống trên tàu'],
    priceExcludes: ['Chi phí cá nhân', 'VAT'],
    rating: 4.8,
    reviewsCount: 156,
    isHot: true,
    status: 'active'
  },
  {
    name: 'Tour Phú Quốc 3N2Đ',
    price: 3800000,
    durationDays: 3,
    departure: 'TP.HCM',
    destination: 'Phú Quốc',
    region: 'Biển Đảo',
    transport: 'Máy bay',
    slots: 20,
    booked: 8,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    description: 'Thiên đường nghỉ dưỡng Phú Quốc với bãi biển hoang sơ và hải sản tươi sống.',
    schedule: [
      { day: 1, title: 'TP.HCM → Phú Quốc', content: 'Bay sang đảo, nhận phòng resort, tắm biển' },
      { day: 2, title: 'Tour Bắc Đảo', content: 'Vườn Quốc gia, thác Tranh, Bãi Dài' },
      { day: 3, title: 'Phú Quốc → TP.HCM', content: 'Mua đặc sản, ra sân bay' }
    ],
    priceIncludes: ['Vé máy bay', 'Resort 4 sao', 'Ăn sáng', 'Tour Bắc Đảo'],
    priceExcludes: ['Chi phí cá nhân', 'VAT'],
    rating: 4.6,
    reviewsCount: 203,
    isHot: false,
    status: 'active'
  },
  {
    name: 'Tour Cà Mau - Bạc Liêu 2N1Đ',
    price: 1500000,
    durationDays: 2,
    departure: 'TP.HCM',
    destination: 'Cà Mau',
    region: 'Miền Nam',
    transport: 'Ôtô',
    slots: 35,
    booked: 15,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600',
    description: 'Khám phá miền Tây sông nước, rừng đước Cà Mau, vườn chim Bạc Liêu.',
    schedule: [
      { day: 1, title: 'TP.HCM → Cà Mau', content: 'Di chuyển, tham quan mũi Cà Mau, rừng đước' },
      { day: 2, title: 'Bạc Liêu → về', content: 'Vườn chim, nhà công tử Bạc Liêu, về TP.HCM' }
    ],
    priceIncludes: ['Xe du lịch', 'Khách sạn 2 sao', 'Ăn uống theo chương trình'],
    priceExcludes: ['Chi phí cá nhân'],
    rating: 4.2,
    reviewsCount: 67,
    isHot: false,
    status: 'active'
  },
  {
    name: 'Tour Đà Nẵng - Hội An 4N3Đ',
    price: 3500000,
    durationDays: 4,
    departure: 'TP.HCM',
    destination: 'Đà Nẵng - Hội An',
    region: 'Miền Trung',
    transport: 'Máy bay',
    slots: 25,
    booked: 18,
    image: 'https://images.unsplash.com/photo-1559830001-02e83f48e2ac?w=600',
    description: 'Di sản văn hóa Hội An, cầu Vàng Bà Nà Hills, biển Mỹ Khê tuyệt đẹp.',
    schedule: [
      { day: 1, title: 'TP.HCM → Đà Nẵng', content: 'Bay ra, tham quan cầu Rồng, biển Mỹ Khê' },
      { day: 2, title: 'Bà Nà Hills', content: 'Cáp treo, cầu Vàng, làng Pháp' },
      { day: 3, title: 'Hội An', content: 'Phố cổ Hội An, thả đèn hoa đăng' },
      { day: 4, title: 'Đà Nẵng → TP.HCM', content: 'Mua đặc sản, bay về' }
    ],
    priceIncludes: ['Vé máy bay', 'Khách sạn 3 sao', 'Ăn sáng', 'Vé Bà Nà Hills'],
    priceExcludes: ['Chi phí cá nhân', 'VAT'],
    rating: 4.9,
    reviewsCount: 245,
    isHot: true,
    status: 'active'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Tour.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert tours
    const tours = await Tour.insertMany(sampleTours);
    console.log(`✅ Inserted ${tours.length} tours`);

    // Create admin user
    const admin = new User({ username: 'admin', password: 'admin123', role: 'admin' });
    await admin.save();
    console.log('✅ Created admin user (username: admin, password: admin123)');

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
