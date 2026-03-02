import { useState, useEffect, useCallback, useRef } from "react";

const GAME_WIDTH = 480;
const GAME_HEIGHT = 800;

// =========================================
// UNIFIED THEME — Binding Middle Tone
// =========================================
const THEME = {
  // Surfaces (warmed GitHub dark)
  bgDeep: '#10141a',
  bgSurface: '#181d26',
  bgElevated: '#222833',
  bgHover: '#2a3040',
  // Borders
  borderDefault: '#333a47',
  borderSubtle: '#262d38',
  // Text
  textPrimary: '#d0d7e0',
  textSecondary: '#8a929c',
  textMuted: '#4a5160',
  // Semantic accents
  blue: '#58a6ff',
  green: '#3fb950',
  yellow: '#d29922',
  red: '#f85149',
  gold: '#f1c40f',
  // Brand warm
  brandPrimary: '#c04a42',
  brandDark: '#8b2828',
  brandGlow: 'rgba(192,74,66,0.4)',
  warmSurface: '#1e1518',
  warmBorder: '#3d2528',
  // Radii
  rSm: 6,
  rMd: 10,
  rLg: 14,
  rXl: 18,
  // Overlays
  overlay55: 'rgba(16,20,26,0.55)',
  overlay75: 'rgba(16,20,26,0.75)',
  overlay88: 'rgba(16,20,26,0.88)',
  overlay92: 'rgba(16,20,26,0.92)',
};

// =========================================
// MAGAZA ESYALARI
// =========================================
const SHOP_ITEMS = [
  { id: "dual_monitor", name: "Çift Monitör", desc: "Bug Fix süresine +8 saniye ekler.", price: 15, icon: "🖥️" },
  { id: "mech_keyboard", name: "Mekanik Klavye", desc: "Yanlış tıklama cezasını 3s→1s'ye düşürür.", price: 12, icon: "⌨️" },
  { id: "neon_sign", name: "Neon Tabela", desc: "Her iş başına +1 GP bonus!", price: 20, icon: "✨" },
  { id: "coffee_machine", name: "Espresso Makinesi", desc: "Her gün başı +2 itibar bonusu.", price: 10, icon: "☕" },
  { id: "potted_plant", name: "Ofis Bitkisi", desc: "Günlük gideri 1 GP azaltır.", price: 5, icon: "🌿" },
];

// =========================================
// DEPARTMANLAR
// "Medya ve IT" tek birlesik departman, digerleri ileride acilacak
// =========================================
const DEPARTMENTS = [
  {
    id: "media_it",
    name: "Medya ve IT",
    icon: "🖥️",
    color: "#6366f1",
    colorDark: "#4f46e5",
    desc: "Dijital dünya senin oyun alanın. Web geliştirme, sosyal medya yönetimi, grafik tasarım ve teknik altyapı.",
    skills: "Bug Fix · Logo Tasarım · Logo Hizalama · Kablo Bağlama · Quiz",
    available: true,
  },
  {
    id: "member_rel",
    name: "Üye İlişkileri",
    icon: "👥",
    color: "#10b981",
    colorDark: "#059669",
    desc: "İnsanlarla iletişim en güçlü yanın. Üye memnuniyeti ve topluluk büyütme.",
    skills: "Hafıza Eşleştirme · Dosya Sıralama · Quiz",
    available: true,
  },
  {
    id: "corporate",
    name: "Kurumsal İlişkiler",
    icon: "💼",
    color: "#f59e0b",
    colorDark: "#d97706",
    desc: "Sponsorlar, partnerler ve dış ilişkiler. GP ve prestij kazanma uzmanı.",
    skills: "Süreci Sırala · Spam Temizliği · Quiz",
    available: true,
  },
  {
    id: "events_org",
    name: "Etkinlik ve Organizasyon",
    icon: "🎪",
    color: "#ef4444",
    colorDark: "#dc2626",
    desc: "Etkinlik planlama ve organizasyon. Kaliteli etkinlikler düzenle.",
    skills: "Klima Ayarla · Süreci Sırala · Quiz",
    available: true,
  },
];

// =========================================
// ZİYARETÇİ TİPLERİ
// =========================================
const CHARACTERS = [
  { displayName: "Ekin", sprite: "/assets/dummies/ekin/ekin_neutral.png", spriteHappy: "/assets/dummies/ekin/ekin_happy.png", spriteUnhappy: "/assets/dummies/ekin/ekin_unhappy.png" },
  { displayName: "Berrin", sprite: "/assets/dummies/berrin/berrin_neutral.png", spriteHappy: "/assets/dummies/berrin/berrin_happy.png", spriteUnhappy: "/assets/dummies/berrin/berrin_unhappy.png" },
  { displayName: "Ementü", sprite: "/assets/dummies/ementu/ementu_neutral.png", spriteHappy: "/assets/dummies/ementu/ementu_happy.png", spriteUnhappy: "/assets/dummies/ementu/ementu_unhappy.png" },
  { displayName: "Merve", sprite: "/assets/dummies/merve/merve_neutral.png", spriteHappy: "/assets/dummies/merve/merve_happy.png", spriteUnhappy: "/assets/dummies/merve/merve_unhappy.png" },
];

const CUSTOMER_TYPES = [
  // 🖥️ Medya ve IT
  {
    id: "student", name: "Öğrenci", color: "#9b59b6", dept: "media_it",
    requests: ["Web sitem çöktü!", "Final projem patladı!", "Database silindi..."],
    gameType: "BUG_FIX",
  },
  {
    id: "sponsor", name: "Sponsor", color: "#f1c40f", dept: "media_it",
    requests: ["Logomuzu büyütelim.", "Renkleri canlı yapalım.", "Yatırım görüşmesi?"],
    gameType: "DESIGN_CLICK",
  },
  {
    id: "designer", name: "Tasarımcı", color: "#1abc9c", dept: "media_it",
    requests: ["Logoyu afişe ortala!", "Tasarımı hizala!", "Banneri ortala!"],
    gameType: "ALIGN_LOGO",
  },
  {
    id: "technician", name: "Teknisyen", color: "#2c3e50", dept: "media_it",
    requests: ["Sunucu odasını bağla!", "Kabloları düzenle!", "Ağı kur!"],
    gameType: "WIRE_CONNECT",
  },
  {
    id: "it_intern", name: "IT Stajyeri", color: "#6366f1", dept: "media_it",
    requests: ["Bu kod ne işe yarıyor?", "React mi Vue mu?", "Framework hangisi?"],
    gameType: "QUIZ",
  },
  // 👥 Üye İlişkileri
  {
    id: "researcher", name: "Araştırmacı", color: "#3498db", dept: "member_rel",
    requests: ["Verileri eşleştir!", "Kaynakları bul!", "Bağlantıları keşfet!"],
    gameType: "MEMORY_MATCH",
  },
  {
    id: "organizer", name: "Organizatör", color: "#e67e22", dept: "member_rel",
    requests: ["Slaytlar karışmış, toparla!", "Faturaları sıraya koy!", "Dosyaları düzenle!"],
    gameType: "SORT_FILES",
  },
  {
    id: "member_rep", name: "Üye Temsilcisi", color: "#10b981", dept: "member_rel",
    requests: ["Yeni üye oryantasyonu var!", "Üye anketi sonuçları ne?", "Topluluk kuralları neydi?"],
    gameType: "QUIZ",
  },
  // 💼 Kurumsal İlişkiler
  {
    id: "coordinator", name: "Koordinatör", color: "#e67e22", dept: "corporate",
    requests: ["Süreçleri organize et!", "Proje akışını düzenle!", "Adımları sırala!"],
    gameType: "DRAG_DROP",
  },
  {
    id: "sysadmin", name: "Sistem Admin", color: "#e74c3c", dept: "corporate",
    requests: ["Mail kutusu spam dolmuş!", "Virüs saldırısı var!", "Inbox'u temizle acil!"],
    gameType: "SPAM_CLEANUP",
  },
  {
    id: "corp_rep", name: "Kurumsal Temsilci", color: "#f59e0b", dept: "corporate",
    requests: ["Sponsor sunumu hazırla!", "Protokol kuralları ne?", "Bütçe raporu lazım!"],
    gameType: "QUIZ",
  },
  // 🎪 Etkinlik ve Organizasyon
  {
    id: "electrician", name: "Elektrikçi", color: "#e67e22", dept: "events_org",
    requests: ["Klima bozuldu ayarla!", "Klima çıldırdı!", "Sıcaklığı düzelt acil!"],
    gameType: "AC_ADJUST",
  },
  {
    id: "event_planner", name: "Etkinlik Planlayıcı", color: "#ef4444", dept: "events_org",
    requests: ["Etkinlik programını sırala!", "Sahne düzenini kur!", "Konuşmacıları planla!"],
    gameType: "DRAG_DROP",
  },
  {
    id: "event_host", name: "Etkinlik Sunucusu", color: "#ec4899", dept: "events_org",
    requests: ["Salon kapasitesi kaç?", "Etkinlik bütçesi ne?", "Sahne planı nasıl?"],
    gameType: "QUIZ",
  },
];

// =========================================
// SEÇİM SİSTEMİ (Endgame)
// =========================================

// Boş kariyer istatistikleri şablonu
const EMPTY_SEASON_STATS = {
  totalEarned: 0,
  sRankCount: 0,
  bestStreak: 0,
  perfectJobs: 0,
  activeDays: 0,
  noFailDays: 0,
  totalJobs: 0,
  failedJobs: 0,
  dayFailed: false,
};

// Seçim puanı ağırlıkları
const ELECTION_WEIGHTS = {
  reputation: 1.0,       // İtibar direkt sayılır
  totalEarned: 0.08,     // Toplam GP kazancı
  sRankCount: 15,        // S Rank kalite göstergesi
  bestStreak: 10,        // Tutarlılık
  perfectJobs: 8,        // Hatasız iş sayısı
  activeDays: 5,         // Bağlılık
  noFailDays: 12,        // Başarısız olunan gün = 0 olan günler
};

// AI rakip isimleri havuzu
const RIVAL_NAMES = [
  "Arda Yılmaz", "Zeynep Kaya", "Burak Aksoy", "Elif Demirtaş",
  "Can Öztürk", "Selin Aydın", "Mert Demir", "Ayşe Güneş",
  "Emre Çelik", "Deniz Yıldırım", "Baran Koç", "İrem Şahin",
];

// =========================================
// GKT HİYERARŞİ SİSTEMİ
// İtibar eşikleriyle otomatik terfi (0-5), endgame seçim (6)
// =========================================

const GKT_HIERARCHY = [
  { rank: 0, title: "Aktif Üye",             icon: "🌱", color: "#8b949e", minRep: 0,    gpBonus: 0   },
  { rank: 1, title: "Takım Direktörü",       icon: "🎯", color: "#58a6ff", minRep: 5,    gpBonus: 5   },
  { rank: 2, title: "Departman Koordinatörü", icon: "⭐", color: "#3fb950", minRep: 20,   gpBonus: 10  },
  { rank: 3, title: "Yürütme Komitesi Üyesi", icon: "⚡", color: "#d29922", minRep: 50,   gpBonus: 15  },
  { rank: 4, title: "Yönetim Kurulu Üyesi",  icon: "🏛️", color: "#bc8cff", minRep: 100,  gpBonus: 20  },
  { rank: 5, title: "Başkan Yardımcısı",     icon: "💎", color: "#f0883e", minRep: 150,  gpBonus: 30  },
  { rank: 6, title: "YK Başkanı",            icon: "👑", color: "#f1c40f", minRep: 250,  gpBonus: 50  },
];

// Departman bazlı direktör takım seçenekleri (Kademe 1'de popup gösterilir)
// Gerçek GKT 2025-2026 kadrosu
const DEPT_DIRECTORS = {
  media_it: [
    { id: "design_team",  title: "Tasarım Takımı",  director: "Mehmet Baytemir", icon: "🎨" },
    { id: "content_team", title: "İçerik Takımı",   director: "Merve Çakmak",    icon: "📝" },
  ],
  member_rel: [
    { id: "office_team",  title: "Ofis Takımı",     director: "Gaye Sena Aydoğmuş", icon: "🏢" },
    { id: "analysis_team", title: "Analiz Takımı",  director: "Mahmutcan Çakır",     icon: "📊" },
  ],
  corporate: [
    { id: "summit_team",  title: "Zirve Takımı",    director: "Serra Güllü",     icon: "🏔️" },
    { id: "finance_team", title: "Finans Takımı",   director: "Nehir Su Aras",   icon: "💰" },
  ],
  events_org: [
    { id: "event_team",   title: "Etkinlik Takımı", director: "Fatih Türkan",    icon: "🎪" },
    { id: "project_team", title: "Proje Takımı",    director: "Salih Yaşar",     icon: "📋" },
  ],
};

// Departman koordinatör isimleri (Kademe 2+ için bilgi amaçlı)
const DEPT_COORDINATORS = {
  media_it:    { name: "Melih Demir",          icon: "🖥️" },
  member_rel:  { name: "Süeda Nur Şahinol",   icon: "👥" },
  corporate:   { name: "Abdullah Kerim Çolak", icon: "💼" },
  events_org:  { name: "Doğa Naz Yılmaz",     icon: "🎪" },
};

// İtibar puanına göre mevcut rütbeyi hesapla (seçim gerektiren rank 6 hariç)
const getRankInfo = (reputation, currentRank = 0) => {
  // Rank 6 (YK Başkanı) sadece seçimle ulaşılır, otomatik terfi yok
  let maxReachable = 0;
  for (let i = GKT_HIERARCHY.length - 2; i >= 0; i--) { // rank 6 hariç (index 5'e kadar)
    if (reputation >= GKT_HIERARCHY[i].minRep) {
      maxReachable = i;
      break;
    }
  }
  // Eğer oyuncu zaten seçimle rank 6'ya ulaştıysa onu koru
  if (currentRank === 6) return GKT_HIERARCHY[6];
  return GKT_HIERARCHY[Math.max(currentRank, maxReachable)];
};

// Kampanya puanı hesapla
const calculateCampaignScore = (stats, rep) => {
  return Math.floor(
    rep * ELECTION_WEIGHTS.reputation +
    stats.totalEarned * ELECTION_WEIGHTS.totalEarned +
    stats.sRankCount * ELECTION_WEIGHTS.sRankCount +
    stats.bestStreak * ELECTION_WEIGHTS.bestStreak +
    stats.perfectJobs * ELECTION_WEIGHTS.perfectJobs +
    stats.activeDays * ELECTION_WEIGHTS.activeDays +
    stats.noFailDays * ELECTION_WEIGHTS.noFailDays
  );
};

// AI rakip üret (oyuncunun puanına ve istatistiklerine göre dengeli)
const generateRival = (playerScore, season, playerStats) => {
  const difficultyMult = 0.5 + (season * 0.12);
  const minMult = Math.max(0.50, difficultyMult - 0.12);
  const maxMult = Math.min(1.08, difficultyMult + 0.12);
  const rivalScore = Math.floor(playerScore * (minMult + Math.random() * (maxMult - minMult)));
  const name = RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)];
  // Rakip istatistikleri (seçim kartı için)
  const s = () => 0.5 + Math.random() * 0.7;
  return {
    name,
    score: rivalScore,
    reputation: Math.max(1, Math.floor((playerStats.activeDays || 1) * 3 * s())),
    totalEarned: Math.max(0, Math.floor((playerStats.totalEarned || 100) * s())),
    perfectJobs: Math.max(0, Math.floor((playerStats.perfectJobs || 1) * s())),
    bestStreak: Math.max(0, Math.floor((playerStats.bestStreak || 1) * s())),
    sRankCount: Math.max(0, Math.floor((playerStats.sRankCount || 1) * s())),
  };
};

// =========================================
// QUIZ SORU HAVUZLARI (Departmana göre)
// =========================================
const QUIZ_POOLS = {
  // 🖥️ Medya ve IT
  media_it: [
    { q: "React'te state değiştirmek için ne kullanılır?", opts: ["useState", "useEffect", "div"], answer: "useState" },
    { q: "CSS'te bir elementi ortalamak için?", opts: ["display: flex", "display: table", "display: none"], answer: "display: flex" },
    { q: "JavaScript'te dizi uzunluğu?", opts: [".length", ".size()", ".count"], answer: ".length" },
    { q: "HTML'de en büyük başlık etiketi?", opts: ["<h1>", "<h6>", "<big>"], answer: "<h1>" },
    { q: "Git'te değişiklikleri kaydetmek?", opts: ["git commit", "git save", "git push"], answer: "git commit" },
    { q: "JSON ne demek?", opts: ["JavaScript Object Notation", "Java System Output", "Joint Server Node"], answer: "JavaScript Object Notation" },
    { q: "HTTP 404 hatası ne anlama gelir?", opts: ["Bulunamadı", "Sunucu Hatası", "Başarılı"], answer: "Bulunamadı" },
    { q: "Hangisi bir veritabanı türüdür?", opts: ["MongoDB", "ReactDB", "NodeDB"], answer: "MongoDB" },
    { q: "Hangisi bir programlama dili değildir?", opts: ["Photoshop", "Python", "JavaScript"], answer: "Photoshop" },
    { q: "SEO ne demektir?", opts: ["Arama Motoru Optimizasyonu", "Sosyal Erişim Oranı", "Site Erişim Ortamı"], answer: "Arama Motoru Optimizasyonu" },
  ],
  // 👥 Üye İlişkileri
  member_rel: [
    { q: "Topluluk yönetiminde en önemli şey?", opts: ["İletişim", "Bütçe", "Logo"], answer: "İletişim" },
    { q: "Yeni üye oryantasyonunda ilk adım?", opts: ["Tanışma", "Aidat toplama", "Görev verme"], answer: "Tanışma" },
    { q: "Üye memnuniyet anketi ne işe yarar?", opts: ["Geri bildirim almak", "Üye çıkarmak", "Bütçe planlamak"], answer: "Geri bildirim almak" },
    { q: "Bir topluluğu büyütmenin en iyi yolu?", opts: ["Değer sunmak", "Reklam vermek", "Zorunlu üyelik"], answer: "Değer sunmak" },
    { q: "Üye iletişiminde hangi kanal en etkili?", opts: ["Yüz yüze", "Faks", "Mektup"], answer: "Yüz yüze" },
    { q: "Takım çalışmasında en önemli beceri?", opts: ["Empati", "Rekabet", "Hız"], answer: "Empati" },
    { q: "Topluluk etkinliğine katılım nasıl artırılır?", opts: ["İlgi çekici içerik", "Ceza sistemi", "Zorunlu katılım"], answer: "İlgi çekici içerik" },
    { q: "Gönüllülük motivasyonu nereden gelir?", opts: ["Aidiyet hissi", "Maddi kazanç", "Zorunluluk"], answer: "Aidiyet hissi" },
  ],
  // 💼 Kurumsal İlişkiler
  corporate: [
    { q: "B2B ne demektir?", opts: ["Business to Business", "Back to Back", "Business to Boss"], answer: "Business to Business" },
    { q: "MVP neyin kısaltmasıdır?", opts: ["Minimum Viable Product", "Most Valuable Player", "Maximum Viral Post"], answer: "Minimum Viable Product" },
    { q: "Bir girişimin kısa sunumuna ne denir?", opts: ["Elevator Pitch", "Stair Speech", "Roof Talk"], answer: "Elevator Pitch" },
    { q: "Sponsor ilişkisinde en önemli şey?", opts: ["Karşılıklı fayda", "Sadece para", "Logo büyüklüğü"], answer: "Karşılıklı fayda" },
    { q: "Kurumsal mail nasıl biter?", opts: ["Saygılarımla", "Görüşürüz", "BB"], answer: "Saygılarımla" },
    { q: "Profesyonel bir sunumda ilk ne yapılır?", opts: ["Kendini tanıtma", "Fiyat söyleme", "Demo gösterme"], answer: "Kendini tanıtma" },
    { q: "KPI ne demektir?", opts: ["Anahtar Performans Göstergesi", "Kurumsal Plan İndeksi", "Kalite Puanı"], answer: "Anahtar Performans Göstergesi" },
    { q: "Networking etkinliğinde ne yapılır?", opts: ["İlişki kurmak", "Satış yapmak", "CV dağıtmak"], answer: "İlişki kurmak" },
  ],
  // 🎪 Etkinlik ve Organizasyon
  events_org: [
    { q: "Etkinlik planlamasında ilk adım?", opts: ["Hedef belirlemek", "Mekan kiralamak", "Afiş bastırmak"], answer: "Hedef belirlemek" },
    { q: "Bir etkinlikte moderatörün görevi?", opts: ["Yönetmek", "Yemek sipariş etmek", "Bilet satmak"], answer: "Yönetmek" },
    { q: "Etkinlik bütçesinde en büyük kalem genelde?", opts: ["Mekan", "Kalem", "Kırtasiye"], answer: "Mekan" },
    { q: "Panel ile workshop arasındaki fark?", opts: ["Panel izlenir, workshop yapılır", "Aynı şey", "Panel uzun, workshop kısa"], answer: "Panel izlenir, workshop yapılır" },
    { q: "Etkinlik sonrası ne yapılmalı?", opts: ["Geri bildirim toplamak", "Hemen unutmak", "Sadece kutlamak"], answer: "Geri bildirim toplamak" },
    { q: "Sahne düzeninde en önemli unsur?", opts: ["Görünürlük", "Renk", "Müzik"], answer: "Görünürlük" },
    { q: "Etkinlik tanıtımında en etkili yöntem?", opts: ["Sosyal medya", "Gazete ilanı", "Kapı kapı dolaşmak"], answer: "Sosyal medya" },
    { q: "Konuşmacı için ideal sunum süresi?", opts: ["15-20 dakika", "2 saat", "5 dakika"], answer: "15-20 dakika" },
  ],
};

// =========================================
// BUG FIX — KOD SATIRLARI VE HATALAR
// Her set: doğru satırlar + araya gizlenmiş hatalı satırlar
// =========================================
const CODE_SETS = [
  {
    title: "server.js — Sunucu Başlatma",
    lines: [
      { code: 'const express = require("express");', bug: false },
      { code: "const app = express();", bug: false },
      { code: "const PORT = undefined;", bug: true, fix: "const PORT = 3000;" },
      { code: 'app.get("/", (req, res) => {', bug: false },
      { code: '  res.send("Merhaba Dünya!");', bug: false },
      { code: "});", bug: false },
      { code: "app.listen(PORT, () => {", bug: false },
      { code: "  console.log(Sunucu çalışıyor);", bug: true, fix: '  console.log("Sunucu çalışıyor");' },
      { code: "});", bug: false },
      { code: "module.export = app;", bug: true, fix: "module.exports = app;" },
    ],
  },
  {
    title: "database.js — Veritabanı Bağlantısı",
    lines: [
      { code: 'const mongoose = require("mongoose");', bug: false },
      { code: "async function connect() {", bug: false },
      { code: '  await mongoose.connect("mongodb://localhost");', bug: false },
      { code: "  const db = mongoose.connection;", bug: false },
      { code: '  db.on("eror", console.error);', bug: true, fix: '  db.on("error", console.error);' },
      { code: '  db.once("open", () => {', bug: false },
      { code: '    console.log("DB bağlandı");', bug: false },
      { code: "  });", bug: false },
      { code: "  return db", bug: true, fix: "  return db;" },
      { code: "}", bug: false },
    ],
  },
  {
    title: "auth.js — Kullanıcı Girişi",
    lines: [
      { code: "function login(username, password) {", bug: false },
      { code: '  if (username = "admin") {', bug: true, fix: '  if (username === "admin") {' },
      { code: "    const token = jwt.sign({ user: username });", bug: false },
      { code: "    return { success: true, token };", bug: false },
      { code: "  }", bug: false },
      { code: "  return { success: flase, error: 401 };", bug: true, fix: "  return { success: false, error: 401 };" },
      { code: "}", bug: false },
      { code: "", bug: false },
      { code: "function logout(token) {", bug: false },
      { code: "  token.destory();", bug: true, fix: "  token.destroy();" },
      { code: "}", bug: false },
    ],
  },
  {
    title: "api.js — REST API",
    lines: [
      { code: 'app.get("/users", async (req, res) => {', bug: false },
      { code: "  const users = await User.find({});", bug: false },
      { code: "  res.status(200).json(users);", bug: false },
      { code: "});", bug: false },
      { code: "", bug: false },
      { code: 'app.post("/users", async (req res) => {', bug: true, fix: 'app.post("/users", async (req, res) => {' },
      { code: "  const newUser = new User(req.body);", bug: false },
      { code: "  await newUser.safe();", bug: true, fix: "  await newUser.save();" },
      { code: "  res.status(201).json(newUser);", bug: false },
      { code: "});", bug: false },
    ],
  },
  {
    title: "PlayerMovement.cs — Unity Karakter",
    lines: [
      { code: "void Update() {", bug: false },
      { code: '  float x = Input.GetAxis("Horizontal");', bug: false },
      { code: "  float speed = 5f;", bug: false },
      { code: "  transform.Translate(x * speed * Time.deltatime, 0, 0);", bug: true, fix: "  transform.Translate(x * speed * Time.deltaTime, 0, 0);" },
      { code: "  if (Input.GetKeyDown(KeyCode.Space)) {", bug: false },
      { code: "    GetComponent<Rigidbody>().AddForce(Vector3.up * 10);", bug: false },
      { code: "  }", bug: false },
      { code: "  Debug.log(transform.position);", bug: true, fix: "  Debug.Log(transform.position);" },
      { code: "}", bug: false },
    ],
  },
  {
    title: "style.css — Sayfa Stilleri",
    lines: [
      { code: ".container {", bug: false },
      { code: "  display: flex;", bug: false },
      { code: "  justify-content: center;", bug: false },
      { code: "  align-items: center;", bug: false },
      { code: "  backround-color: #fff;", bug: true, fix: "  background-color: #fff;" },
      { code: "}", bug: false },
      { code: "", bug: false },
      { code: ".button {", bug: false },
      { code: "  padding: 10px 20px;", bug: false },
      { code: "  border-raduis: 8px;", bug: true, fix: "  border-radius: 8px;" },
      { code: "  cursor: pointer;", bug: false },
      { code: "}", bug: false },
    ],
  },
];

// =========================================
// DRAG & DROP — SIRALAMA SETLERI
// =========================================
const SORT_SETS = [
  {
    title: "Yazılım Geliştirme Süreci",
    customer: "Proje Yöneticisi",
    items: ["📋 Analiz", "🎨 Tasarım", "💻 Kodlama", "🧪 Test", "🚀 Deploy"],
  },
  {
    title: "Etkinlik Planlama",
    customer: "Organizatör",
    items: ["💡 Fikir", "💰 Bütçe", "📍 Mekan", "📢 Tanıtım", "🎪 Etkinlik"],
  },
  {
    title: "Startup Yolculuğu",
    customer: "Girişimci",
    items: ["❓ Problem", "💡 Çözüm", "🛠️ MVP", "📊 Test", "📈 Scale"],
  },
  {
    title: "Git İş Akışı",
    customer: "Developer",
    items: ["🌿 Branch", "💻 Code", "📦 Commit", "⬆️ Push", "🔀 Merge"],
  },
  {
    title: "Kullanıcı Deneyimi Tasarımı",
    customer: "UX Designer",
    items: ["🔍 Araştırma", "✏️ Wireframe", "🎨 Prototip", "🧪 Test", "✅ Onay"],
  },
  {
    title: "Makale Yayınlama",
    customer: "Editör",
    items: ["📝 Taslak", "✍️ Yazım", "🔍 Düzenleme", "🖼️ Görsel", "📤 Yayın"],
  },
  {
    title: "Mobil Uygulama Çıkış Süreci",
    customer: "Product Manager",
    items: ["📐 Tasarım", "💻 Geliştirme", "🧪 Beta Test", "📝 Store Kayıt", "🚀 Yayınla"],
  },
  {
    title: "Sponsorluk Anlaşması",
    customer: "Kurumsal İlişkiler",
    items: ["🔍 Araştırma", "📧 İletişim", "🤝 Toplantı", "📄 Sözleşme", "💰 Ödeme"],
  },
];

// =========================================
// MEMORY MATCH — KART TEMALARI
// =========================================
const CARD_THEMES = [
  ["💻", "🎯", "📱", "☕", "🎨", "🔧", "📊", "🎪", "👥", "💼"],
  ["🚀", "⭐", "🔥", "💎", "🎵", "📷", "🌍", "⚡", "🎮", "🧠"],
  ["🐱", "🐶", "🦊", "🐼", "🦁", "🐸", "🦉", "🐙", "🦋", "🐝"],
];

// =========================================
// BAŞARI PİRİLTİ EFEKTİ (Sparkle SVG)
// =========================================
const SparkleEffect = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" style={{
    position: "absolute", top: 30, left: "50%", marginLeft: 40, zIndex: 50,
    animation: "sparkleAnim 0.8s ease-out forwards",
    pointerEvents: "none",
  }}>
    <path d="M30 5 L33 22 L50 18 L36 28 L45 45 L30 34 L15 45 L24 28 L10 18 L27 22 Z"
      fill="#f1c40f" opacity="0.9">
      <animate attributeName="opacity" values="0;1;0.8" dur="0.6s" fill="freeze" />
    </path>
    <circle cx="12" cy="8" r="2.5" fill="#fff" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="0.5s" begin="0.1s" fill="freeze" />
    </circle>
    <circle cx="50" cy="10" r="2" fill="#fff" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="0.5s" begin="0.2s" fill="freeze" />
    </circle>
    <circle cx="8" cy="38" r="1.5" fill="#f1c40f" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="0.4s" begin="0.15s" fill="freeze" />
    </circle>
    <circle cx="52" cy="42" r="2" fill="#f1c40f" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="0.4s" begin="0.25s" fill="freeze" />
    </circle>
  </svg>
);

// =========================================
// BAŞARISIZLIK ÖFKELİ İŞARET (Anger Mark SVG — anime tarzı #)
// =========================================
const AngerMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" style={{
    position: "absolute", top: 35, left: "50%", marginLeft: 40, zIndex: 50,
    animation: "angerPop 0.4s ease-out forwards",
    pointerEvents: "none",
  }}>
    <g stroke="#e74c3c" strokeWidth="3.5" strokeLinecap="round" opacity="0.95">
      <line x1="8" y1="6" x2="16" y2="14" />
      <line x1="20" y1="6" x2="28" y2="14" />
      <line x1="8" y1="22" x2="16" y2="30" />
      <line x1="20" y1="22" x2="28" y2="30" />
      <line x1="14" y1="10" x2="22" y2="10" />
      <line x1="14" y1="26" x2="22" y2="26" />
      <line x1="10" y1="14" x2="10" y2="22" />
      <line x1="26" y1="14" x2="26" y2="22" />
    </g>
  </svg>
);

// =========================================
// WIRE CONNECT — KABLO RENKLERİ
// =========================================
const WIRE_COLORS = ["#f85149", "#3fb950", "#58a6ff", "#d29922", "#bc8cff", "#f78166"];

// =========================================
// WIRE CONNECT — KABLO SETLERİ
// =========================================
const WIRE_SETS = [
  {
    title: "Etkinlik Hazırlığı",
    pairs: [
      { left: "🎤 Mikrofon", right: "🔊 Hoparlör" },
      { left: "📽️ Projeksiyon", right: "🖥️ Laptop" },
      { left: "📷 Kamera", right: "💡 Işık" },
      { left: "🪑 Sandalye", right: "🪧 Masa" },
    ],
  },
  {
    title: "Ofis Sabahı",
    pairs: [
      { left: "☕ Kahve", right: "🍵 Bardak" },
      { left: "🖨️ Yazıcı", right: "📄 Kağıt" },
      { left: "💻 Laptop", right: "🔌 Şarj" },
      { left: "📱 Telefon", right: "🎧 Kulaklık" },
    ],
  },
  {
    title: "Sosyal Medya İçerik",
    pairs: [
      { left: "📸 Fotoğraf", right: "📱 Instagram" },
      { left: "🎬 Video", right: "▶️ YouTube" },
      { left: "✍️ Yazı", right: "📝 Blog" },
      { left: "🎨 Tasarım", right: "🖼️ Canva" },
    ],
  },
  {
    title: "Kariyer Fuarı",
    pairs: [
      { left: "👔 CV", right: "💼 Şirket" },
      { left: "🎤 Sunum", right: "📊 Slayt" },
      { left: "🤝 Sponsor", right: "💰 Bütçe" },
      { left: "📧 Davet", right: "👥 Katılımcı" },
    ],
  },
];

// =========================================
// ZORLUK HESAPLAYICI
// Gun ilerledikce sure kisalir, secenekler artar, odul carpani yukselir
// =========================================
const getDifficulty = (day) => {
  const d = Math.min(day, 40); // 40. günde zorluk sabitlenir
  return {
    day: d,
    timeLimit: Math.max(6, 15 - Math.floor(d * 0.25)),
    quizTime: Math.max(5, 12 - Math.floor(d * 0.2)),
    designTime: Math.max(4, 10 - Math.floor(d * 0.2)),
    designItems: Math.min(8, 4 + Math.floor(d / 6)),
    rent: Math.min(5, 2 + Math.floor((d - 1) / 8)),
    wrongPenalty: 3,
    moneyPenalty: 0, // Başarısızlıkta para kesilmez
  };
};

// =========================================
// DEBUG RENK HARITASI
// =========================================
const DEBUG_STYLES = {
  BG_WALL:        { bg: "#2c3e50", color: "#ecf0f1", label: "OFİS DUVARI" },
  BG_WINDOW:      { bg: "#3498db", color: "#fff", label: "MANZARA" },
  BG_POSTER:      { bg: "#8e44ad", color: "#fff", label: "POSTER" },
  BG_CLOCK:       { bg: "#2c3e50", color: "#f1c40f", label: "SAAT" },
  BG_SHELF:       { bg: "#6d4c2a", color: "#fff", label: "RAF" },
  DESK_SURFACE:   { bg: "#e67e22", color: "#fff", label: "ÇALIŞMA MASASI" },
  DESK_DRAWER:    { bg: "#d35400", color: "#fff", label: "ÇEKMECELİ KISIM" },
  ITEM_PC:        { bg: "#34495e", color: "#fff", label: "BİLGİSAYAR" },
  ITEM_PC_SCREEN: { bg: "#2ecc71", color: "#000", label: "EKRAN" },
  ITEM_KEYBOARD:  { bg: "#7f8c8d", color: "#fff", label: "KLAVYE" },
  ITEM_COFFEE:    { bg: "#e74c3c", color: "#fff", label: "KAHVE" },
  ITEM_PHONE:     { bg: "#1abc9c", color: "#fff", label: "TELEFON" },
  ITEM_LAMP:      { bg: "#f39c12", color: "#fff", label: "LAMBA" },
  ITEM_PLANT:     { bg: "#27ae60", color: "#fff", label: "BİTKİ" },
  ITEM_NOTEBOOK:  { bg: "#ecf0f1", color: "#333", label: "DEFTER" },
  DEFAULT:        { bg: "#95a5a6", color: "#000", label: "EŞYA" },
};

// =========================================
// SPRITE COMPONENT
// =========================================
function Sprite({ src, x, y, width, height, z, onClick, className, style, customColor, label }) {
  const ds = DEBUG_STYLES[className] || { bg: customColor || "#95a5a6", color: "#fff", label: label || className || "?" };

  const base = {
    position: "absolute", left: x, top: y, width, height, zIndex: z,
    cursor: onClick ? "pointer" : "default", transition: "transform 0.1s ease", ...style,
  };

  if (src) {
    return <img src={src} style={{ ...base, objectFit: "cover" }} onClick={onClick} alt={className} draggable={false} />;
  }

  return (
    <div
      onClick={onClick}
      style={{
        ...base, background: ds.bg, color: ds.color,
        border: "2px solid rgba(255,255,255,0.15)", display: "flex",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        fontWeight: "bold", fontSize: 11, boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        borderRadius: 6, userSelect: "none",
      }}
      onMouseDown={(e) => { if (onClick) e.currentTarget.style.transform = "scale(0.95)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {ds.label}
    </div>
  );
}

// =========================================
// BUG FIX MINI-GAME COMPONENT
// =========================================
function BugFixGame({ difficulty, ownedItems = [], onComplete, onFail }) {
  const [codeSet] = useState(() => CODE_SETS[Math.floor(Math.random() * CODE_SETS.length)]);
  const [lines, setLines] = useState(() => codeSet.lines.map((l, i) => ({ ...l, id: i, found: false })));
  const baseTime = difficulty?.timeLimit ?? 15;
  const bonusTime = ownedItems.includes("dual_monitor") ? 8 : 0;
  const [timeLeft, setTimeLeft] = useState(baseTime + bonusTime);
  const [score, setScore] = useState(0);
  const [wrongFlash, setWrongFlash] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [burstLineId, setBurstLineId] = useState(null);
  const [screenFlash, setScreenFlash] = useState(false);
  const totalBugs = codeSet.lines.filter((l) => l.bug).length;
  const timerRef = useRef(null);
  const burstTimer = useRef(null);
  const flashTimer = useRef(null);

  // Zamanlayici
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          onFail();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [onFail]);

  // Kod kaydirma animasyonu
  useEffect(() => {
    const iv = setInterval(() => {
      setScrollY((prev) => {
        const maxScroll = Math.max(0, lines.length * 38 - 400);
        if (prev >= maxScroll) return 0;
        return prev + 0.3;
      });
    }, 50);
    return () => clearInterval(iv);
  }, [lines.length]);

  const handleLineClick = useCallback(
    (line, e) => {
      if (line.found) return;
      if (line.bug) {
        setLines((prev) => prev.map((l) => (l.id === line.id ? { ...l, found: true, code: l.fix } : l)));
        clearTimeout(burstTimer.current);
        clearTimeout(flashTimer.current);
        setBurstLineId(line.id);
        burstTimer.current = setTimeout(() => setBurstLineId(null), 600);
        setShakeKey((k) => k + 1);
        setScreenFlash(true);
        flashTimer.current = setTimeout(() => setScreenFlash(false), 400);
        const newScore = score + 1;
        setScore(newScore);
        if (newScore >= totalBugs) {
          clearInterval(timerRef.current);
          setTimeout(() => onComplete(timeLeft), 300);
        }
      } else {
        setWrongFlash(line.id);
        const penalty = ownedItems.includes("mech_keyboard") ? 1 : (difficulty?.wrongPenalty ?? 3);
        setTimeLeft((t) => Math.max(0, t - penalty));
        setTimeout(() => setWrongFlash(null), 400);
      }
    },
    [score, totalBugs, timeLeft, onComplete, ownedItems, difficulty]
  );

  const pct = totalBugs > 0 ? (score / totalBugs) * 100 : 0;
  const urgent = timeLeft <= 5;
  const totalTime = baseTime + bonusTime;

  return (
    <div key={`shake-${shakeKey}`} style={{ position: "absolute", inset: 0, background: "#0d1117", display: "flex", flexDirection: "column", overflow: "hidden", animation: shakeKey > 0 ? "screenShake 0.35s ease-out" : "none" }}>
      <style>{`
        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-3.75px, 1.5px); }
          25% { transform: translate(3.75px, -2.25px); }
          40% { transform: translate(-3px, 2.25px); }
          55% { transform: translate(3px, -1.5px); }
          70% { transform: translate(-1.5px, 1.5px); }
          85% { transform: translate(1.5px, -0.75px); }
        }
        @keyframes bugBurst {
          0% { opacity: 0.75; transform: scale(1); }
          40% { opacity: 0.6; transform: scale(2.5); }
          100% { opacity: 0; transform: scale(4); }
        }
        @keyframes screenFlash {
          0% { opacity: 0.375; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Yeşil ekran flash overlay */}
      {screenFlash && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none",
          background: "rgba(63,185,80,0.11)",
          animation: "screenFlash 0.4s ease-out forwards",
        }} />
      )}
      {/* Ust bar — Windows tarzı başlık çubuğu */}
      <div style={{ background: "#1e2430", padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 13 }}>📝</span>
          <span style={{ color: "#8b949e", fontSize: 11 }}>{codeSet.title}</span>
          <span style={{ color: "#484f58", fontSize: 10 }}>—</span>
          <span style={{ color: "#484f58", fontSize: 10 }}>GKT Terminal v1.0</span>
        </div>
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          <div style={{ width: 28, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3, color: "#8b949e", fontSize: 11, cursor: "default", lineHeight: 1 }}>─</div>
          <div style={{ width: 28, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3, cursor: "default" }}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><rect x="0.5" y="0.5" width="8" height="8" stroke="#8b949e" strokeWidth="1.2" /></svg>
          </div>
          <div style={{ width: 28, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3, color: "#8b949e", fontSize: 11, cursor: "default", lineHeight: 1 }}>✕</div>
        </div>
      </div>

      {/* Zaman + ilerleme */}
      <div style={{ padding: "8px 12px", background: "#161b22", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#c9d1d9", fontWeight: 700 }}>
            🐛 {score}/{totalBugs} hata bulundu
          </span>
          <span
            style={{
              fontSize: 13, fontWeight: 800,
              color: urgent ? "#f85149" : "#58a6ff",
              animation: urgent ? "pulse 0.5s infinite" : "none",
            }}
          >
            ⏱ {timeLeft}s
          </span>
        </div>
        {/* Ilerleme cubugu */}
        <div style={{ height: 6, background: "#21262d", borderRadius: 3, overflow: "hidden" }}>
          <div
            style={{
              height: "100%", borderRadius: 3, transition: "width 0.3s",
              background: pct >= 100 ? "#3fb950" : "linear-gradient(90deg, #58a6ff, #bc8cff)",
              width: `${pct}%`,
            }}
          />
        </div>
        {/* Zaman cubugu */}
        <div style={{ height: 3, background: "#21262d", borderRadius: 2, overflow: "hidden", marginTop: 4 }}>
          <div
            style={{
              height: "100%", borderRadius: 2, transition: "width 1s linear",
              background: urgent ? "#f85149" : "#d29922",
              width: `${(timeLeft / totalTime) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Ipucu + aktif bufflar */}
      <div style={{ padding: "6px 12px", background: "#1c2128", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#8b949e" }}>
            💡 Hatalı satıra tıkla! Yanlış = -{ownedItems.includes("mech_keyboard") ? "1" : (difficulty?.wrongPenalty ?? 3)}s
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {ownedItems.includes("dual_monitor") && (
              <span style={{ fontSize: 9, background: "#238636", color: "#fff", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>🖥️+8s</span>
            )}
            {ownedItems.includes("mech_keyboard") && (
              <span style={{ fontSize: 9, background: "#1f6feb", color: "#fff", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>⌨️-ceza</span>
            )}
          </div>
        </div>
      </div>

      {/* Kod alani */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Satir numarasi kenari — arka plan */}
        <div style={{
          position: "absolute", left: 0, top: 0, width: 36, height: "100%", zIndex: 0,
          background: "#161b22", borderRight: "1px solid #30363d",
        }} />
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0,
            transform: `translateY(${-scrollY}px)`,
            transition: "transform 0.05s linear",
            padding: "8px 0",
          }}
        >
          {lines.map((line, i) => {
            const isBug = line.bug && !line.found;
            const isFixed = line.bug && line.found;
            const isWrong = wrongFlash === line.id;

            return (
              <div
                key={line.id}
                onClick={(e) => handleLineClick(line, e)}
                style={{
                  display: "flex", alignItems: "center", padding: "4px 8px 4px 4px",
                  cursor: "pointer", height: 30, transition: "background 0.15s",
                  position: "relative",
                  background: isWrong
                    ? "rgba(248,81,73,0.25)"
                    : isFixed
                      ? "rgba(63,185,80,0.12)"
                      : isBug
                        ? "rgba(248,81,73,0.06)"
                        : "transparent",
                  borderLeft: isFixed ? "3px solid #3fb950" : isBug ? "3px solid transparent" : "3px solid transparent",
                }}
              >
                {burstLineId === line.id && (
                  <div style={{
                    position: "absolute",
                    top: "-200%", left: "-50%", right: "-50%", bottom: "-200%",
                    pointerEvents: "none",
                    zIndex: 10,
                    background: "radial-gradient(circle at center, rgba(63,185,80,0.525) 0%, rgba(63,185,80,0.225) 30%, transparent 60%)",
                    animation: "bugBurst 0.6s ease-out forwards",
                  }} />
                )}
                {/* Satir numarasi */}
                <div
                  style={{
                    width: 36, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: "#484f58", fontFamily: "monospace",
                    flexShrink: 0, userSelect: "none",
                  }}
                >
                  {i + 1}
                </div>
                {/* Kod satiri */}
                <div
                  style={{
                    flex: 1, fontSize: 12, fontFamily: "'Cascadia Code', 'Fira Code', monospace",
                    color: isFixed ? "#3fb950" : isBug ? "#f0883e" : "#c9d1d9",
                    whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis",
                    textDecoration: isFixed ? "none" : "none",
                  }}
                >
                  {line.code}
                  {isFixed && <span style={{ color: "#3fb950", fontSize: 10, marginLeft: 6 }}>✓ düzeltildi</span>}
                </div>
                {/* Bug gostergesi */}
                {isBug && (
                  <div
                    style={{
                      width: 18, height: 18, borderRadius: 4,
                      background: "#f8514920", border: "1px solid #f8514940",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, flexShrink: 0, animation: "pulse 2s infinite",
                    }}
                  >
                    ⚠️
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scan-line efekti placeholder */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)",
            zIndex: 5,
          }}
        />
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}

// =========================================
// DRAG & DROP — SÜREÇ SIRALAMA MINI-GAME
// =========================================
function DragDropGame({ difficulty, onComplete, onFail }) {
  const [set] = useState(() => SORT_SETS[Math.floor(Math.random() * SORT_SETS.length)]);
  const correctOrder = set.items;
  const [items, setItems] = useState(() => [...set.items].sort(() => Math.random() - 0.5));
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [timeLeft, setTimeLeft] = useState(difficulty?.designTime ? difficulty.designTime + 6 : 16);
  const [result, setResult] = useState(null);
  const [wrongItems, setWrongItems] = useState([]);
  const timerRef = useRef(null);
  const touchStartY = useRef(null);
  const touchStartIdx = useRef(null);

  useEffect(() => {
    if (result) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); onFail(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [onFail, result]);

  const checkOrder = useCallback(() => {
    clearInterval(timerRef.current);
    setResult("checking");

    const wrong = [];
    items.forEach((item, i) => {
      if (item !== correctOrder[i]) wrong.push(i);
    });

    setTimeout(() => {
      if (wrong.length === 0) {
        setResult("correct");
        setTimeout(() => onComplete(timeLeft), 800);
      } else {
        setWrongItems(wrong);
        setResult("wrong");
        setTimeout(() => onFail(), 1200);
      }
    }, 600);
  }, [items, correctOrder, timeLeft, onComplete, onFail]);

  const handleDragStart = (idx) => {
    setDragIdx(idx);
  };

  const handleDragOver = (idx) => {
    if (dragIdx === null || dragIdx === idx) return;
    setOverIdx(idx);
    const newItems = [...items];
    const [dragged] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, dragged);
    setItems(newItems);
    setDragIdx(idx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  const handleTouchStart = (idx, e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartIdx.current = idx;
    setDragIdx(idx);
  };

  const handleTouchMove = (e) => {
    if (touchStartIdx.current === null) return;
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const elements = document.querySelectorAll('[data-drag-item]');

    for (let i = 0; i < elements.length; i++) {
      const rect = elements[i].getBoundingClientRect();
      if (touchY >= rect.top && touchY <= rect.bottom && i !== dragIdx) {
        handleDragOver(i);
        break;
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartIdx.current = null;
    handleDragEnd();
  };

  const urgent = timeLeft <= 4;
  const totalTime = difficulty?.designTime ? difficulty.designTime + 6 : 16;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0d1117", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#161b22", padding: "10px 14px", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#c9d1d9" }}>🧩 {set.title}</div>
            <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>Doğru sıraya dizin!</div>
          </div>
          <span style={{
            fontSize: 16, fontWeight: 900,
            color: urgent ? "#f85149" : "#58a6ff",
            animation: urgent ? "pulse 0.5s infinite" : "none",
          }}>
            ⏱ {timeLeft}s
          </span>
        </div>
        {/* Time bar */}
        <div style={{ height: 4, background: "#21262d", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, transition: "width 1s linear",
            background: urgent ? "#f85149" : "linear-gradient(90deg, #58a6ff, #bc8cff)",
            width: `${(timeLeft / totalTime) * 100}%`,
          }} />
        </div>
      </div>

      {/* Instruction */}
      <div style={{ padding: "8px 14px", background: "#1c2128", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "#8b949e" }}>👆 Sürükleyerek sırala, sonra &quot;Kontrol Et&quot; bas</span>
      </div>

      {/* Items */}
      <div
        style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, i) => {
          const isWrong = wrongItems.includes(i);
          const isCorrect = result === "correct";
          const isDragging = dragIdx === i;

          return (
            <div
              key={item}
              data-drag-item
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => { e.preventDefault(); handleDragOver(i); }}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(i, e)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: isCorrect ? "rgba(63,185,80,0.15)" : isWrong ? "rgba(248,81,73,0.15)" : isDragging ? "#21262d" : "#161b22",
                border: `2px solid ${isCorrect ? "#3fb950" : isWrong ? "#f85149" : isDragging ? "#58a6ff" : "#30363d"}`,
                borderRadius: 12, padding: "14px 16px",
                cursor: result ? "default" : "grab",
                transition: "all 0.2s",
                transform: isDragging ? "scale(1.03)" : "scale(1)",
                boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.4)" : "0 2px 4px rgba(0,0,0,0.2)",
                userSelect: "none", touchAction: "none",
              }}
            >
              {/* Number badge */}
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: isCorrect ? "#3fb950" : isWrong ? "#f85149" : "#21262d",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: isCorrect || isWrong ? "#fff" : "#8b949e",
                flexShrink: 0,
              }}>
                {isCorrect ? "✓" : isWrong ? "✗" : i + 1}
              </div>

              {/* Item label */}
              <span style={{
                fontSize: 15, fontWeight: 700,
                color: isCorrect ? "#3fb950" : isWrong ? "#f85149" : "#c9d1d9",
                flex: 1,
              }}>
                {item}
              </span>

              {/* Drag handle */}
              {!result && (
                <div style={{ fontSize: 16, color: "#484f58", flexShrink: 0 }}>⠿</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!result && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid #30363d", flexShrink: 0 }}>
          <button
            onClick={checkOrder}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #238636, #2ea043)", color: "#fff",
              fontWeight: 800, fontSize: 15, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(46,160,67,0.3)",
            }}
          >
            Kontrol Et
          </button>
        </div>
      )}

      {/* Result overlay */}
      {result === "checking" && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
        }}>
          <div style={{ fontSize: 32, animation: "pulse 0.5s infinite" }}>🔍</div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}

// =========================================
// MEMORY MATCH — HAFIZA EŞLEŞTIRME MINI-GAME
// =========================================
function MemoryMatchGame({ difficulty, ownedItems = [], onComplete, onFail }) {
  const pairCount = Math.min(6, 3 + Math.floor((difficulty?.designItems || 4) / 2));
  const bonusTime = ownedItems.includes("dual_monitor") ? 5 : 0;
  const baseTime = 12 + pairCount * 2 + bonusTime;

  const [cards, setCards] = useState(() => {
    const theme = CARD_THEMES[Math.floor(Math.random() * CARD_THEMES.length)];
    const selected = theme.slice(0, pairCount);
    const deck = [...selected, ...selected].map((icon, i) => ({
      id: i, icon, flipped: false, matched: false,
    }));
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  });

  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(baseTime);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowAll(false);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showAll) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); onFail(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [showAll, onFail]);

  useEffect(() => {
    if (matchedCount >= pairCount && !showAll) {
      clearInterval(timerRef.current);
      setTimeout(() => onComplete(timeLeft), 600);
    }
  }, [matchedCount, pairCount, timeLeft, onComplete, showAll]);

  const handleCardClick = useCallback((card) => {
    if (locked || showAll || card.flipped || card.matched || flippedIds.length >= 2) return;

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);
    setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);

      const [first, second] = newFlipped.map((id) => cards.find((c) => c.id === id));

      if (first.icon === cards.find(c => c.id === card.id).icon && first.id !== card.id) {
        setTimeout(() => {
          setCards((prev) => prev.map((c) =>
            c.id === first.id || c.id === card.id ? { ...c, matched: true } : c
          ));
          setMatchedCount((m) => m + 1);
          setFlippedIds([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) =>
            newFlipped.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
          setLocked(false);
        }, 800);
      }
    }
  }, [flippedIds, cards, locked, showAll]);

  const urgent = timeLeft <= 5;
  const cols = pairCount <= 4 ? 3 : 4;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0d1117", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#161b22", padding: "10px 14px", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#c9d1d9" }}>🎯 Hafıza Eşleştirme</div>
            <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>
              {matchedCount}/{pairCount} eşleşme · {moves} hamle
            </div>
          </div>
          <span style={{
            fontSize: 16, fontWeight: 900,
            color: urgent ? "#f85149" : "#58a6ff",
            animation: urgent ? "pulse 0.5s infinite" : "none",
          }}>
            ⏱ {timeLeft}s
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, background: "#21262d", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3, transition: "width 0.3s",
            background: matchedCount >= pairCount ? "#3fb950" : "linear-gradient(90deg, #58a6ff, #bc8cff)",
            width: `${(matchedCount / pairCount) * 100}%`,
          }} />
        </div>
        {/* Time bar */}
        <div style={{ height: 3, background: "#21262d", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, transition: "width 1s linear",
            background: urgent ? "#f85149" : "#d29922",
            width: `${(timeLeft / baseTime) * 100}%`,
          }} />
        </div>
      </div>

      {/* Buffs */}
      {ownedItems.includes("dual_monitor") && (
        <div style={{ padding: "4px 14px", background: "#1c2128", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
          <span style={{ fontSize: 9, background: "#238636", color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>🖥️ +5s bonus</span>
        </div>
      )}

      {/* Show-all overlay */}
      {showAll && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
          background: "rgba(13,17,23,0.7)", padding: "6px",
          textAlign: "center", fontSize: 12, color: "#58a6ff", fontWeight: 700,
          borderBottom: "1px solid #58a6ff40",
        }}>
          👀 Kartları ezberle!
        </div>
      )}

      {/* Card grid */}
      <div style={{
        flex: 1, padding: 16, display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 10, alignContent: "center",
      }}>
        {cards.map((card) => {
          const isVisible = showAll || card.flipped || card.matched;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              style={{
                aspectRatio: "1", borderRadius: 14,
                background: card.matched
                  ? "rgba(63,185,80,0.2)"
                  : isVisible
                    ? "#161b22"
                    : "linear-gradient(135deg, #21262d, #161b22)",
                border: `2px solid ${card.matched ? "#3fb950" : isVisible ? "#58a6ff" : "#30363d"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isVisible ? 32 : 20,
                cursor: card.matched || showAll ? "default" : "pointer",
                transition: "all 0.3s",
                transform: isVisible ? "rotateY(0)" : "rotateY(180deg)",
                boxShadow: card.matched
                  ? "0 0 16px rgba(63,185,80,0.2)"
                  : isVisible
                    ? "0 4px 12px rgba(0,0,0,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.2)",
                userSelect: "none",
                opacity: card.matched ? 0.6 : 1,
              }}
            >
              {isVisible ? card.icon : "❓"}
            </div>
          );
        })}
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}



// =========================================
// WIRE CONNECT — KABLO BAĞLAMA MINI-GAME
// =========================================
function WireConnectGame({ difficulty, onComplete, onFail }) {
  const pairCount = Math.min(4, 3 + Math.floor((difficulty?.designItems || 4) / 3));
  const baseTime = 10 + pairCount * 3;

  const [set] = useState(() => {
    const s = WIRE_SETS[Math.floor(Math.random() * WIRE_SETS.length)];
    const pairs = s.pairs.slice(0, pairCount);
    const rightShuffled = [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5);
    return {
      title: s.title,
      left: pairs.map(p => p.left),
      right: rightShuffled,
      correctMap: pairs.reduce((acc, p, i) => {
        acc[i] = rightShuffled.indexOf(p.right);
        return acc;
      }, {}),
    };
  });

  const [connections, setConnections] = useState({});
  const [dragging, setDragging] = useState(null);
  const [timeLeft, setTimeLeft] = useState(baseTime);
  const [lockedPairs, setLockedPairs] = useState({});
  const [flashWrong, setFlashWrong] = useState(null);
  const [timePenalty, setTimePenalty] = useState(false);
  const [snapPort, setSnapPort] = useState(null);
  const [cascading, setCascading] = useState(false);
  const [cascadeStep, setCascadeStep] = useState(-1);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const rightBoxRefs = useRef([]);
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const wireAreaRef = useRef(null);

  const failedRef = useRef(false);
  useEffect(() => {
    if (cascading) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!failedRef.current) { failedRef.current = true; setTimeout(() => onFail(), 0); }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [onFail, cascading]);

  const getScale = useCallback((el) => {
    if (!el) return 1;
    return el.getBoundingClientRect().width / el.offsetWidth || 1;
  }, []);

  const getPos = useCallback((ref) => {
    if (!ref || !wireAreaRef.current) return { x: 0, y: 0 };
    const rect = ref.getBoundingClientRect();
    const cRect = wireAreaRef.current.getBoundingClientRect();
    const s = getScale(wireAreaRef.current);
    return {
      x: (rect.left - cRect.left + rect.width / 2) / s,
      y: (rect.top - cRect.top + rect.height / 2) / s,
    };
  }, [getScale]);

  const handleLeftStart = (idx, e) => {
    e.preventDefault();
    if (lockedPairs[idx] !== undefined) return;
    if (cascading) return;
    if (connections[idx] !== undefined && lockedPairs[idx] === undefined) {
      setConnections(prev => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
    }
    const touch = e.touches ? e.touches[0] : e;
    const area = wireAreaRef.current || containerRef.current;
    if (!area) return;
    const cRect = area.getBoundingClientRect();
    const s = getScale(area);
    setDragging({
      from: idx,
      curX: (touch.clientX - cRect.left) / s,
      curY: (touch.clientY - cRect.top) / s,
    });
  };

  const handleRightStart = (rightIdx, e) => {
    e.preventDefault();
    if (cascading) return;
    const connectedFrom = Object.entries(connections).find(([, v]) => v === rightIdx);
    if (connectedFrom) {
      const leftIdx = Number(connectedFrom[0]);
      if (lockedPairs[leftIdx] !== undefined) return;
      setConnections(prev => {
        const next = { ...prev };
        delete next[leftIdx];
        return next;
      });
    }
  };

  const handleMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const area = wireAreaRef.current || containerRef.current;
    if (!area) return;
    const cRect = area.getBoundingClientRect();
    const s = getScale(area);
    setDragging(prev => ({
      ...prev,
      curX: (touch.clientX - cRect.left) / s,
      curY: (touch.clientY - cRect.top) / s,
    }));
  };

  const handleEnd = (e) => {
    if (!dragging) return;
    const touch = e.changedTouches ? e.changedTouches[0] : e;

    const tx = touch.clientX;
    const ty = touch.clientY;
    let hitIdx = null;
    let minDist = Infinity;
    rightBoxRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      if (tx >= rect.left && tx <= rect.right && ty >= rect.top && ty <= rect.bottom) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(tx - cx, ty - cy);
        if (dist < minDist) {
          minDist = dist;
          hitIdx = i;
        }
      }
    });
    if (hitIdx === null) {
      rightRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(tx - cx, ty - cy);
        if (dist < 50 && dist < minDist) {
          minDist = dist;
          hitIdx = i;
        }
      });
    }

    if (hitIdx !== null) {
      const leftIdx = dragging.from;

      // Bu sol port zaten kilitliyse islem yapma
      if (lockedPairs[leftIdx] !== undefined) {
        setDragging(null);
        return;
      }

      // Bu sag port zaten kilitli bir kabloyla mi bagli?
      const rightLocked = Object.values(lockedPairs).includes(hitIdx);
      if (rightLocked) {
        setDragging(null);
        return;
      }

      // Dogru mu kontrol et
      const isCorrect = set.correctMap[leftIdx] === hitIdx;

      if (isCorrect) {
        // DOGRU — kilitle + snap efekti
        setLockedPairs(prev => ({ ...prev, [leftIdx]: hitIdx }));
        setConnections(prev => {
          const next = { ...prev };
          next[leftIdx] = hitIdx;
          return next;
        });
        setSnapPort({ left: leftIdx, right: hitIdx });
        setTimeout(() => setSnapPort(null), 500);

        // Tum kablolar baglandi mi?
        const totalLocked = Object.keys(lockedPairs).length + 1;
        if (totalLocked >= set.left.length) {
          // CASCADE bitirisi — 300ms sonra basla
          clearInterval(timerRef.current);
          setTimeout(() => {
            setCascading(true);
            for (let i = 0; i < set.left.length; i++) {
              setTimeout(() => setCascadeStep(i), i * 250);
            }
            setTimeout(() => onComplete(timeLeft), set.left.length * 250 + 400);
          }, 300);
        }
      } else {
        // YANLIS — flash + cozul + ceza
        setConnections(prev => ({ ...prev, [leftIdx]: hitIdx }));
        setFlashWrong(leftIdx);

        // Sure cezasi (-2s)
        setTimePenalty(true);
        setTimeout(() => setTimePenalty(false), 800);
        setTimeLeft(t => {
          const next = Math.max(0, t - 2);
          if (next <= 0) {
            clearInterval(timerRef.current);
            if (!failedRef.current) { failedRef.current = true; setTimeout(() => onFail(), 0); }
          }
          return next;
        });

        // 0.6sn sonra kabloyu coz
        setTimeout(() => {
          setConnections(prev => {
            const next = { ...prev };
            delete next[leftIdx];
            return next;
          });
          setFlashWrong(null);
        }, 600);
      }
    }

    setDragging(null);
  };

  const urgent = timeLeft <= 4;

  const makeCablePath = (x1, y1, x2, y2) => {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const tension = Math.min(0.6, Math.max(0.15, dist / 400));
    const dx = Math.abs(x2 - x1) * tension;
    const sag = Math.min(30, dist * 0.08);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1 + sag * 0.3}, ${x2 - dx} ${y2 + sag * 0.3}, ${x2} ${y2}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      style={{ position: "absolute", inset: 0, background: "#0d1117", display: "flex", flexDirection: "column", overflow: "hidden", touchAction: "none" }}
    >
      {/* Header */}
      <div style={{ background: "#161b22", padding: "10px 14px", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#c9d1d9" }}>🔌 {set.title}</div>
            <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>Kabloları doğru porta bağla!</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
            {timePenalty && (
              <span style={{
                fontSize: 13, fontWeight: 900, color: "#f85149",
                animation: "penaltyFloat 0.8s ease-out forwards",
                position: "absolute", right: "100%", marginRight: 4, whiteSpace: "nowrap",
              }}>-2s</span>
            )}
            <span style={{
              fontSize: 16, fontWeight: 900,
              color: timePenalty ? "#f85149" : urgent ? "#f85149" : "#58a6ff",
              animation: timePenalty ? "wrongShake 0.5s ease-out" : urgent ? "pulse 0.5s infinite" : "none",
              transition: "color 0.2s",
            }}>⏱ {timeLeft}s</span>
          </div>
        </div>
        <div style={{ height: 4, background: "#21262d", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, transition: "width 1s linear",
            background: timePenalty ? "#f85149" : urgent ? "#f85149" : "linear-gradient(90deg, #58a6ff, #bc8cff)",
            width: `${(timeLeft / baseTime) * 100}%`,
          }} />
        </div>
      </div>

      {/* Hint */}
      <div style={{ padding: "6px 14px", background: "#1c2128", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: "#8b949e" }}>👆 Sol porttan sağ porta parmağını kaydır</span>
      </div>

      {/* Wire area */}
      <div ref={wireAreaRef} style={{ flex: 1, position: "relative", padding: "20px 0" }}>

        {/* SVG kablo katmani */}
        <svg style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "visible" }}>
          <defs>
            {WIRE_COLORS.map((wc, i) => (
              <filter key={`glow-${i}`} id={`wireGlow${i}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feFlood floodColor={wc} floodOpacity="0.6" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="shadow" />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
            <filter id="wireGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#3fb950" floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="wireGlowRed" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#f85149" floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Tamamlanmis baglantilar */}
          {Object.entries(connections).map(([leftIdx, rightIdx]) => {
            const lRef = leftRefs.current[leftIdx];
            const rRef = rightRefs.current[rightIdx];
            if (!lRef || !rRef) return null;
            const lPos = getPos(lRef);
            const rPos = getPos(rRef);
            const isLocked = lockedPairs[Number(leftIdx)] !== undefined;
            const isFlashingWrong = flashWrong === Number(leftIdx);
            const isCascadeActive = cascading && cascadeStep >= Number(leftIdx);
            const colorIdx = Number(leftIdx) % WIRE_COLORS.length;
            const color = isFlashingWrong ? "#f85149" :
                          isCascadeActive ? "#3fb950" :
                          isLocked ? "#3fb950" :
                          WIRE_COLORS[colorIdx];
            const strokeW = isCascadeActive ? 10 : 8;
            const glowFilter = isFlashingWrong ? "url(#wireGlowRed)" :
                               (isLocked || isCascadeActive) ? "url(#wireGlowGreen)" :
                               `url(#wireGlow${colorIdx})`;
            return (
              <g key={`conn-${leftIdx}`} style={{
                pointerEvents: "none",
                animation: isCascadeActive ? "cascadeGlow 0.4s ease-out" : "none",
              }}>
                <path
                  d={makeCablePath(lPos.x, lPos.y, rPos.x, rPos.y)}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth={strokeW + 4}
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={makeCablePath(lPos.x, lPos.y, rPos.x, rPos.y)}
                  stroke={color}
                  strokeWidth={strokeW}
                  fill="none"
                  strokeLinecap="round"
                  filter={glowFilter}
                />
                <path
                  d={makeCablePath(lPos.x, lPos.y - 2, rPos.x, rPos.y - 2)}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Suruklenen kablo */}
          {dragging && (() => {
            const lRef = leftRefs.current[dragging.from];
            if (!lRef) return null;
            const lPos = getPos(lRef);
            const colorIdx = dragging.from % WIRE_COLORS.length;
            const color = WIRE_COLORS[colorIdx];
            return (
              <g style={{ pointerEvents: "none" }}>
                <path
                  d={makeCablePath(lPos.x, lPos.y, dragging.curX, dragging.curY)}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth={12}
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={makeCablePath(lPos.x, lPos.y, dragging.curX, dragging.curY)}
                  stroke={color}
                  strokeWidth={8}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.85}
                  filter={`url(#wireGlow${colorIdx})`}
                />
                <circle
                  cx={dragging.curX}
                  cy={dragging.curY}
                  r={10}
                  fill={color}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth={2}
                  opacity={0.9}
                  style={{ pointerEvents: "none", filter: `drop-shadow(0 0 8px ${color})` }}
                />
              </g>
            );
          })()}
        </svg>

        {/* Sol portlar */}
        <div style={{ position: "absolute", left: 12, top: 0, bottom: 0, width: "38%", display: "flex", flexDirection: "column", justifyContent: "space-evenly", zIndex: 3 }}>
          {set.left.map((label, i) => {
            const isLocked = lockedPairs[i] !== undefined;
            const isWrong = flashWrong === i;
            const isConnected = connections[i] !== undefined;
            const isDraggingThis = dragging && dragging.from === i;
            const color = WIRE_COLORS[i % WIRE_COLORS.length];
            return (
              <div
                key={`l-${i}`}
                style={{ position: "relative", display: "flex", alignItems: "center" }}
              >
                <div
                  onMouseDown={(e) => !cascading && handleLeftStart(i, e)}
                  onTouchStart={(e) => !cascading && handleLeftStart(i, e)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: isLocked ? "rgba(63,185,80,0.15)" : isWrong ? "rgba(248,81,73,0.2)" : isDraggingThis ? `${color}15` : "#161b22",
                    border: `2px solid ${isLocked ? "#3fb950" : isWrong ? "#f85149" : isDraggingThis ? color : isConnected ? color : "#30363d"}`,
                    borderRadius: 12, padding: "12px 14px",
                    cursor: isLocked || cascading ? "default" : "grab",
                    userSelect: "none", touchAction: "none",
                    transition: "all 0.15s",
                    transform: isDraggingThis ? "scale(1.03)" : "scale(1)",
                    boxShadow: isDraggingThis ? `0 0 16px ${color}40` : "none",
                    flex: 1,
                    animation: isWrong ? "wrongShake 0.5s ease-out" : "none",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#c9d1d9" }}>{label}</span>
                </div>
                <div
                  ref={el => leftRefs.current[i] = el}
                  onMouseDown={(e) => !cascading && handleLeftStart(i, e)}
                  onTouchStart={(e) => !cascading && handleLeftStart(i, e)}
                  style={{
                    position: "absolute", right: -12, zIndex: 5,
                    width: 34, height: 34, borderRadius: "50%",
                    background: isDraggingThis ? color : isConnected ? color : "#21262d",
                    border: `3px solid ${isDraggingThis ? "#fff" : isConnected ? color : "#484f58"}`,
                    boxShadow: isDraggingThis
                      ? `0 0 16px ${color}, 0 0 4px #fff`
                      : isConnected
                        ? `0 0 10px ${color}80`
                        : "0 2px 4px rgba(0,0,0,0.4)",
                    transition: "all 0.15s",
                    cursor: isLocked || cascading ? "default" : "grab",
                    touchAction: "none",
                    animation: snapPort?.left === i ? "portSnap 0.4s ease-out" :
                               isWrong ? "wrongShake 0.5s ease-out" :
                               isDraggingThis ? "portPulse 0.8s ease-in-out infinite" : "none",
                    ...(isLocked ? {
                      background: "#3fb950",
                      borderColor: "#3fb950",
                      boxShadow: "0 0 12px rgba(63,185,80,0.6)",
                    } : {}),
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Sag portlar */}
        <div style={{ position: "absolute", right: 12, top: 0, bottom: 0, width: "38%", display: "flex", flexDirection: "column", justifyContent: "space-evenly", zIndex: 3 }}>
          {set.right.map((label, i) => {
            const connectedFrom = Object.entries(connections).find(([, v]) => v === i);
            const isConnected = !!connectedFrom;
            const leftIdx = connectedFrom ? Number(connectedFrom[0]) : null;
            const color = connectedFrom ? WIRE_COLORS[leftIdx % WIRE_COLORS.length] : "#484f58";
            const isLocked = leftIdx !== null && lockedPairs[leftIdx] !== undefined;
            const isWrong = leftIdx !== null && flashWrong === leftIdx;
            const isHoverTarget = dragging && !isConnected && !Object.values(lockedPairs).includes(i);
            return (
              <div
                key={`r-${i}`}
                ref={el => rightBoxRefs.current[i] = el}
                style={{ position: "relative", display: "flex", alignItems: "center" }}
              >
                <div
                  ref={el => rightRefs.current[i] = el}
                  onMouseDown={(e) => !cascading && isConnected && handleRightStart(i, e)}
                  onTouchStart={(e) => !cascading && isConnected && handleRightStart(i, e)}
                  style={{
                    position: "absolute", left: -12, zIndex: 4,
                    width: 34, height: 34, borderRadius: "50%",
                    background: isConnected ? color : "#21262d",
                    border: `3px solid ${isConnected ? color : isHoverTarget ? "#58a6ff" : "#484f58"}`,
                    boxShadow: isConnected
                      ? `0 0 10px ${color}80`
                      : isHoverTarget
                        ? "0 0 12px rgba(88,166,255,0.4)"
                        : "0 2px 4px rgba(0,0,0,0.4)",
                    transition: "all 0.15s",
                    cursor: isConnected && !isLocked && !cascading ? "pointer" : "default",
                    touchAction: "none",
                    animation: snapPort?.right === i ? "portSnap 0.4s ease-out, portGlow 0.5s ease-out" :
                               isHoverTarget ? "portPulse 1.2s ease-in-out infinite" : "none",
                    ...(isLocked ? {
                      background: "#3fb950",
                      borderColor: "#3fb950",
                      boxShadow: "0 0 12px rgba(63,185,80,0.6)",
                    } : {}),
                  }}
                />
                <div
                  onMouseDown={(e) => !cascading && isConnected && handleRightStart(i, e)}
                  onTouchStart={(e) => !cascading && isConnected && handleRightStart(i, e)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: isLocked ? "rgba(63,185,80,0.15)" : isWrong ? "rgba(248,81,73,0.2)" : "#161b22",
                    border: `2px solid ${isLocked ? "#3fb950" : isWrong ? "#f85149" : isConnected ? color : isHoverTarget ? "#58a6ff40" : "#30363d"}`,
                    borderRadius: 12, padding: "12px 14px",
                    userSelect: "none",
                    cursor: isConnected && !isLocked && !cascading ? "pointer" : "default",
                    touchAction: "none",
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#c9d1d9", marginLeft: 8 }}>{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alt ilerleme cubugu */}
      {!cascading && (
        <div style={{ padding: "10px 20px", borderTop: "1px solid #30363d", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {set.left.map((_, i) => {
              const isLocked = lockedPairs[i] !== undefined;
              const isWrong = flashWrong === i;
              return (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: isLocked ? "#3fb950" : isWrong ? "#f85149" : "#21262d",
                  border: `2px solid ${isLocked ? "#3fb950" : isWrong ? "#f85149" : "#30363d"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#fff", fontWeight: 800,
                  transition: "all 0.3s",
                  animation: isLocked ? "portSnap 0.4s ease-out" : "none",
                }}>
                  {isLocked ? "✓" : isWrong ? "✗" : i + 1}
                </div>
              );
            })}
          </div>
          <div style={{
            textAlign: "center", marginTop: 6,
            fontSize: 11, color: "#8b949e", fontWeight: 600,
          }}>
            🔌 {Object.keys(lockedPairs).length}/{set.left.length} doğru bağlandı
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes portPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes portSnap {
          0% { transform: scale(1); }
          30% { transform: scale(1.5); }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes portGlow {
          0% { box-shadow: 0 0 0px transparent; }
          50% { box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
          100% { box-shadow: 0 0 10px currentColor; }
        }
        @keyframes wrongShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(3px); }
        }
        @keyframes cascadeGlow {
          0% { filter: brightness(1); }
          50% { filter: brightness(2); }
          100% { filter: brightness(1.3); }
        }
        @keyframes penaltyFloat {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(-8px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-18px) scale(0.8); }
        }
      `}</style>
    </div>
  );
}


// =========================================
// SORT FILES — DOSYA SIRALAMA MINI-GAME
// =========================================
function SortFilesGame({ difficulty, ownedItems = [], onComplete, onFail }) {
  const fileCount = Math.min(10, Math.max(5, 4 + Math.floor((difficulty?.designItems || 4) * 0.8)));
  const bonusTime = ownedItems.includes("dual_monitor") ? 5 : 0;
  const baseTime = Math.max(8, 18 - Math.floor((difficulty?.timeLimit || 15) * 0.3)) + bonusTime;

  const FILE_ICONS = ["📄", "📊", "📋", "📁", "📝", "📈", "📑", "🗂️", "📎", "🗃️"];

  const [shuffled] = useState(() => {
    const nums = Array.from({ length: fileCount }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums;
  });

  const [current, setCurrent] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [timeLeft, setTimeLeft] = useState(baseTime);
  const [wrongFlash, setWrongFlash] = useState(null);
  const timerRef = useRef(null);

  // Internal timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          onFail();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [onFail]);

  const handleClick = useCallback((num) => {
    if (completed.includes(num)) return;
    if (num === current) {
      const newCompleted = [...completed, num];
      setCompleted(newCompleted);
      setCurrent(num + 1);
      if (newCompleted.length >= fileCount) {
        clearInterval(timerRef.current);
        setTimeout(() => onComplete(timeLeft), 400);
      }
    } else {
      setWrongFlash(num);
      const penalty = ownedItems.includes("mech_keyboard") ? 1 : (difficulty?.wrongPenalty ?? 3);
      setTimeLeft((t) => Math.max(0, t - penalty));
      setTimeout(() => setWrongFlash(null), 400);
    }
  }, [current, completed, fileCount, timeLeft, onComplete, ownedItems, difficulty]);

  const urgent = timeLeft <= 5;
  const pct = (completed.length / fileCount) * 100;
  const cols = fileCount < 6 ? 3 : 4;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0d1117", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#161b22", padding: "10px 14px", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#c9d1d9" }}>🗂️ Dosya Sıralama</div>
            <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>
              Sıradaki → <span style={{ color: "#58a6ff", fontWeight: 800 }}>{current <= fileCount ? current : "✓"}</span>
            </div>
          </div>
          <span style={{
            fontSize: 16, fontWeight: 900,
            color: urgent ? "#f85149" : "#58a6ff",
            animation: urgent ? "pulse 0.5s infinite" : "none",
          }}>⏱ {timeLeft}s</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, background: "#21262d", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3, transition: "width 0.3s",
            background: pct >= 100 ? "#3fb950" : "linear-gradient(90deg, #58a6ff, #bc8cff)",
            width: pct + "%",
          }} />
        </div>
        {/* Time bar */}
        <div style={{ height: 3, background: "#21262d", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, transition: "width 1s linear",
            background: urgent ? "#f85149" : "#d29922",
            width: ((timeLeft / baseTime) * 100) + "%",
          }} />
        </div>
      </div>

      {/* Buffs */}
      <div style={{ padding: "6px 12px", background: "#1c2128", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#8b949e" }}>
            💡 Sırayla dokun: 1, 2, 3... Yanlış = -{ownedItems.includes("mech_keyboard") ? "1" : (difficulty?.wrongPenalty ?? 3)}s
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {ownedItems.includes("dual_monitor") && (
              <span style={{ fontSize: 9, background: "#238636", color: "#fff", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>🖥️+5s</span>
            )}
            {ownedItems.includes("mech_keyboard") && (
              <span style={{ fontSize: 9, background: "#1f6feb", color: "#fff", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>⌨️-ceza</span>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        flex: 1, padding: 16, display: "grid",
        gridTemplateColumns: "repeat(" + cols + ", 1fr)",
        gap: 10, alignContent: "center",
      }}>
        {shuffled.map((num) => {
          const isDone = completed.includes(num);
          const isWrong = wrongFlash === num;
          const icon = FILE_ICONS[(num - 1) % FILE_ICONS.length];

          return (
            <div
              key={num}
              onClick={() => !isDone && handleClick(num)}
              style={{
                aspectRatio: "1",
                minHeight: 64, minWidth: 64,
                borderRadius: 14,
                background: isDone
                  ? "rgba(63,185,80,0.2)"
                  : isWrong
                    ? "rgba(248,81,73,0.25)"
                    : "#161b22",
                border: "2px solid " + (isDone ? "#3fb950" : isWrong ? "#f85149" : "#30363d"),
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 4,
                cursor: isDone ? "default" : "pointer",
                transition: "all 0.2s",
                transform: isDone ? "scale(0.9)" : isWrong ? "scale(1.05)" : "scale(1)",
                boxShadow: isDone
                  ? "0 0 12px rgba(63,185,80,0.2)"
                  : isWrong
                    ? "0 0 12px rgba(248,81,73,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.2)",
                userSelect: "none",
                opacity: isDone ? 0.6 : 1,
              }}
            >
              <span style={{ fontSize: 24 }}>{icon}</span>
              <span style={{
                fontSize: 18, fontWeight: 900,
                color: isDone ? "#3fb950" : isWrong ? "#f85149" : "#c9d1d9",
              }}>
                {num}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}


// =========================================
// ALIGN LOGO — LOGO HİZALAMA MINI-GAME
// =========================================
function AlignLogoGame({ difficulty, ownedItems = [], onComplete, onFail }) {
  const bonusTime = ownedItems.includes("dual_monitor") ? 4 : 0;
  const baseTime = Math.max(6, 14 - Math.floor((difficulty?.timeLimit || 15) * 0.4)) + bonusTime;
  const dayNum = Math.min(10, Math.max(1, Math.floor((difficulty?.designItems || 4) / 1.2)));
  const speed = 2 + dayNum * 0.4;
  const tolerance = Math.max(8, 15 - dayNum);

  const [timeLeft, setTimeLeft] = useState(baseTime);
  const [logoX, setLogoX] = useState(10);
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState(null);
  const [flash, setFlash] = useState(null); // "perfect" | "good" | "miss"
  const timerRef = useRef(null);
  const animRef = useRef(null);
  const logoRef = useRef(10);
  const dirRef = useRef(1);

  // Internal timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          cancelAnimationFrame(animRef.current);
          onFail();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [onFail]);

  // Logo animation
  useEffect(() => {
    if (result) return;
    const animate = () => {
      logoRef.current += dirRef.current * speed * 0.3;
      if (logoRef.current >= 90) {
        logoRef.current = 90;
        dirRef.current = -1;
      } else if (logoRef.current <= 10) {
        logoRef.current = 10;
        dirRef.current = 1;
      }
      setLogoX(logoRef.current);
      setDirection(dirRef.current);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [result, speed]);

  const handleSnap = useCallback(() => {
    if (result) return;

    const center = 50;
    const dist = Math.abs(logoRef.current - center);
    const tolerancePct = tolerance;

    if (dist <= 5) {
      // Perfect!
      clearInterval(timerRef.current);
      cancelAnimationFrame(animRef.current);
      setResult("perfect");
      setFlash("perfect");
      setTimeout(() => onComplete(timeLeft), 800);
    } else if (dist <= tolerancePct) {
      // Good
      clearInterval(timerRef.current);
      cancelAnimationFrame(animRef.current);
      setResult("good");
      setFlash("good");
      setTimeout(() => onComplete(Math.floor(timeLeft * 0.7)), 800);
    } else {
      // Miss
      setFlash("miss");
      const penalty = ownedItems.includes("mech_keyboard") ? 1 : (difficulty?.wrongPenalty ?? 3);
      setTimeLeft((t) => Math.max(0, t - penalty));
      setTimeout(() => setFlash(null), 400);
    }
  }, [tolerance, timeLeft, result, onComplete, ownedItems, difficulty]);

  const urgent = timeLeft <= 4;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0d1117", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#161b22", padding: "10px 14px", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#c9d1d9" }}>🎯 Logo Hizalama</div>
            <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>
              {result === "perfect" ? "Mükemmel! 🌟" : result === "good" ? "İyi! 👍" : "Logoyu ortaya hizala!"}
            </div>
          </div>
          <span style={{
            fontSize: 16, fontWeight: 900,
            color: urgent ? "#f85149" : "#58a6ff",
            animation: urgent ? "pulse 0.5s infinite" : "none",
          }}>⏱ {timeLeft}s</span>
        </div>
        {/* Time bar */}
        <div style={{ height: 4, background: "#21262d", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, transition: "width 1s linear",
            background: urgent ? "#f85149" : "linear-gradient(90deg, #58a6ff, #bc8cff)",
            width: ((timeLeft / baseTime) * 100) + "%",
          }} />
        </div>
      </div>

      {/* Buffs */}
      <div style={{ padding: "6px 12px", background: "#1c2128", borderBottom: "1px solid #30363d", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#8b949e" }}>
            👆 Logo ortadayken SABİTLE! Yanlış = -{ownedItems.includes("mech_keyboard") ? "1" : (difficulty?.wrongPenalty ?? 3)}s
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {ownedItems.includes("dual_monitor") && (
              <span style={{ fontSize: 9, background: "#238636", color: "#fff", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>🖥️+4s</span>
            )}
            {ownedItems.includes("mech_keyboard") && (
              <span style={{ fontSize: 9, background: "#1f6feb", color: "#fff", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>⌨️-ceza</span>
            )}
          </div>
        </div>
      </div>

      {/* Game area */}
      <div
        onMouseDown={() => !result && handleSnap()}
        onTouchStart={() => !result && handleSnap()}
        style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", cursor: result ? "default" : "pointer" }}>
        {/* Tolerance zone */}
        <div style={{
          position: "absolute",
          left: (50 - tolerance) + "%",
          width: (tolerance * 2) + "%",
          top: "10%", bottom: "10%",
          background: "rgba(88,166,255,0.08)",
          border: "1px dashed rgba(88,166,255,0.25)",
          borderRadius: 8,
          zIndex: 1,
        }} />

        {/* Perfect zone */}
        <div style={{
          position: "absolute",
          left: "45%", width: "10%",
          top: "10%", bottom: "10%",
          background: "rgba(63,185,80,0.08)",
          border: "1px dashed rgba(63,185,80,0.3)",
          borderRadius: 4,
          zIndex: 2,
        }} />

        {/* Center line */}
        <div style={{
          position: "absolute",
          left: "50%", transform: "translateX(-50%)",
          top: "5%", bottom: "5%",
          width: 3,
          background: "#58a6ff",
          borderRadius: 2,
          boxShadow: "0 0 12px rgba(88,166,255,0.4)",
          zIndex: 3,
        }} />

        {/* Logo */}
        <div style={{
          position: "absolute",
          left: logoX + "%",
          transform: "translateX(-50%)",
          width: 80, height: 80,
          borderRadius: 16,
          background: result === "perfect"
            ? "linear-gradient(135deg, #3fb950, #238636)"
            : result === "good"
              ? "linear-gradient(135deg, #58a6ff, #1f6feb)"
              : flash === "miss"
                ? "linear-gradient(135deg, #f85149, #da3633)"
                : "linear-gradient(135deg, #f1c40f, #e67e22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 900, color: "#fff",
          boxShadow: result === "perfect"
            ? "0 0 32px rgba(63,185,80,0.5)"
            : result === "good"
              ? "0 0 32px rgba(88,166,255,0.5)"
              : flash === "miss"
                ? "0 0 24px rgba(248,81,73,0.5)"
                : "0 8px 24px rgba(241,196,15,0.3)",
          transition: result ? "all 0.3s" : "none",
          zIndex: 5,
          userSelect: "none",
        }}>
          GKT
        </div>

        {/* Flash label */}
        {flash && (
          <div style={{
            position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
            fontSize: 24, fontWeight: 900, zIndex: 10,
            color: flash === "perfect" ? "#3fb950" : flash === "good" ? "#58a6ff" : "#f85149",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}>
            {flash === "perfect" ? "Mükemmel! 🌟" : flash === "good" ? "İyi! 👍" : "Kaçtı! ❌"}
          </div>
        )}
      </div>

      {/* Snap button */}
      {!result && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid #30363d", flexShrink: 0 }}>
          <button
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; handleSnap(); }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onTouchStart={() => handleSnap()}
            style={{
              width: "80%", margin: "0 auto", display: "block",
              padding: "18px", borderRadius: 14, border: "none",
              minHeight: 60,
              background: "linear-gradient(135deg, #f1c40f, #e67e22)",
              color: "#fff", fontWeight: 900, fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(241,196,15,0.3)",
              transition: "transform 0.1s",
              touchAction: "manipulation",
            }}
          >
            🎯 SABİTLE
          </button>
        </div>
      )}

      {/* Result overlay */}
      {(result === "perfect" || result === "good") && (
        <div style={{
          position: "absolute", inset: 0,
          background: result === "perfect" ? "rgba(63,185,80,0.15)" : "rgba(88,166,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10, pointerEvents: "none",
        }}>
          <div style={{
            fontSize: 48,
            animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}>
            {result === "perfect" ? "🌟" : "👍"}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes popIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

// =========================================
// SHOP MENU COMPONENT
// =========================================
function ShopMenu({ money, ownedItems, onBuy, onClose }) {
  return (
    <div
      style={{
        position: "absolute", inset: 0, background: "rgba(13,17,23,0.98)",
        zIndex: 400, display: "flex", flexDirection: "column", padding: 20, color: "white",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Ofis Mağazası</h2>
        <button
          onClick={onClose}
          style={{
            background: "#f85149", border: "none", color: "white", borderRadius: 8,
            cursor: "pointer", padding: "6px 14px", fontWeight: 700, fontSize: 12,
          }}
        >
          KAPAT
        </button>
      </div>
      <div
        style={{
          marginBottom: 12, padding: "8px 12px", background: "#21262d",
          borderRadius: 8, color: money < 0 ? "#f85149" : "#f1c40f", fontWeight: 700, textAlign: "center", fontSize: 14,
        }}
      >
        {money < 0 ? "BORÇ" : "Bütçe"}: {Math.floor(money)} GP
      </div>
      {money < 0 && (
        <div style={{
          padding: "10px 12px", background: "rgba(248,81,73,0.15)",
          border: "1px solid rgba(248,81,73,0.3)", borderRadius: 8,
          marginBottom: 12, textAlign: "center",
        }}>
          <span style={{ color: "#f85149", fontSize: 12, fontWeight: 700 }}>
            🔒 Borç kapatılmadan alışveriş yapılamaz!
          </span>
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {SHOP_ITEMS.map((item) => {
          const isOwned = ownedItems.includes(item.id);
          const canBuy = money >= 0 && money >= item.price;
          return (
            <div
              key={item.id}
              style={{
                background: isOwned ? "#1c2128" : "#21262d", padding: "10px 12px",
                borderRadius: 10, border: isOwned ? "1px solid #3fb950" : "1px solid #30363d",
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <div style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: isOwned ? "#3fb950" : "#c9d1d9" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>{item.desc}</div>
              </div>
              {isOwned ? (
                <span style={{ color: "#3fb950", fontWeight: 700, fontSize: 10, flexShrink: 0 }}>SAHİP</span>
              ) : (
                <button
                  onClick={() => canBuy && onBuy(item)}
                  style={{
                    background: canBuy ? "#238636" : "#30363d",
                    color: canBuy ? "white" : "#484f58",
                    border: "none", padding: "6px 12px", borderRadius: 6,
                    cursor: canBuy ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 11, flexShrink: 0,
                  }}
                >
                  {item.price} GP
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// =========================================
// TERFİ POPUP OVERLAY
// =========================================
function PromotionOverlay({ data, onClose }) {
  if (!data) return null;
  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 600,
        background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={onClose}
    >
      <div style={{
        textAlign: "center",
        animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}>
        {/* Eski rütbe */}
        <div style={{ fontSize: 14, color: "#8b949e", marginBottom: 8 }}>
          {data.oldRank.icon} {data.oldRank.title}
        </div>

        {/* Ok animasyonu */}
        <div style={{
          fontSize: 28, color: "#f1c40f", margin: "4px 0",
          animation: "floatUp 1.5s ease-in-out infinite alternate",
        }}>
          ⬆️
        </div>

        {/* Yeni rütbe — büyük gösterim */}
        <div style={{ fontSize: 64, marginBottom: 4 }}>
          {data.newRank.icon}
        </div>
        <div style={{
          fontSize: 24, fontWeight: 900, color: data.newRank.color,
          textShadow: `0 0 30px ${data.newRank.color}80`,
          marginBottom: 4,
        }}>
          {data.newRank.title}
        </div>
        <div style={{
          fontSize: 14, color: "#c9d1d9", fontWeight: 600,
          marginBottom: 16,
        }}>
          Tebrikler! Terfi ettin!
        </div>

        {/* GP bonus */}
        <div style={{
          background: "rgba(241,196,15,0.15)", border: "1px solid rgba(241,196,15,0.3)",
          borderRadius: 12, padding: "10px 24px", display: "inline-block",
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#f1c40f" }}>
            💰 +{data.gpBonus} GP Bonus
          </span>
        </div>

        <div style={{ fontSize: 11, color: "#484f58" }}>
          Devam etmek için dokun
        </div>
      </div>
    </div>
  );
}

// =========================================
// DİREKTÖRLÜK SEÇİM POPUP
// Kademe 1'e ulaşınca gösterilir
// =========================================
function DirectorChoicePopup({ deptId, onSelect }) {
  const teams = DEPT_DIRECTORS[deptId] || [];
  if (teams.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 650,
        background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.3s ease-out", padding: 24,
      }}
    >
      <div style={{
        textAlign: "center", maxWidth: 360, width: "100%",
        animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎯</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#58a6ff", margin: "0 0 4px" }}>
          Takım Direktörlüğü
        </h2>
        <p style={{ fontSize: 13, color: "#8b949e", margin: "0 0 24px", lineHeight: 1.5 }}>
          Hangi takımın direktörü olmak istersin?
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelect(team)}
              style={{
                padding: "16px 20px", borderRadius: 14,
                background: "rgba(88,166,255,0.08)",
                border: "2px solid rgba(88,166,255,0.25)",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.2s", textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#58a6ff"; e.currentTarget.style.background = "rgba(88,166,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(88,166,255,0.25)"; e.currentTarget.style.background = "rgba(88,166,255,0.08)"; }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{team.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{team.title}</div>
                <div style={{ fontSize: 11, color: "#8b949e", marginTop: 2 }}>
                  Direktör: {team.director}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================
// SPAM TEMİZLİĞİ (Köstebek Vurmaca)
// =========================================
const SPAM_ITEMS = [
  { emoji: "📧", label: "SPAM", isSpam: true, points: 1 },
  { emoji: "🦠", label: "VİRÜS", isSpam: true, points: 2 },
  { emoji: "💀", label: "TROJAN", isSpam: true, points: 2 },
  { emoji: "🎣", label: "PHISHING", isSpam: true, points: 1 },
  { emoji: "💰", label: "DOLANDIRICI", isSpam: true, points: 1 },
];
const NORMAL_ITEMS = [
  { emoji: "📩", label: "ÖNEMLİ", isSpam: false, points: -1 },
  { emoji: "📋", label: "RAPOR", isSpam: false, points: -1 },
  { emoji: "⭐", label: "VIP MAİL", isSpam: false, points: -2 },
];

function SpamCleanupGame({ difficulty, ownedItems, onComplete, onFail }) {
  const bonusTime = ownedItems.includes("dual_monitor") ? 5 : 0;
  const baseTime = Math.max(10, 20 - Math.floor(difficulty.timeLimit * 0.5)) + bonusTime;
  const day = difficulty.day || 1;
  const spawnInterval = Math.max(600, 1400 - day * 80);
  const visibleDuration = Math.max(1000, 2500 - day * 150);
  const maxVisible = Math.min(5, 3 + Math.floor(day / 3));
  const targetScore = Math.min(15, 8 + day);
  const wrongPenalty = ownedItems.includes("mech_keyboard") ? 1 : difficulty.wrongPenalty;

  const [slots, setSlots] = useState(Array(9).fill(null));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(baseTime);
  const [burstSlot, setBurstSlot] = useState(null);
  const [wrongSlot, setWrongSlot] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const slotsRef = useRef(slots);
  const scoreRef = useRef(score);
  const timeRef = useRef(timeLeft);
  const gameOverRef = useRef(false);
  const despawnTimers = useRef({});
  const spawnTimerRef = useRef(null);
  const tickTimerRef = useRef(null);
  const idCounter = useRef(0);

  useEffect(() => { slotsRef.current = slots; }, [slots]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { timeRef.current = timeLeft; }, [timeLeft]);

  // Win check
  useEffect(() => {
    if (score >= targetScore && !gameOverRef.current) {
      gameOverRef.current = true;
      setGameOver(true);
      clearInterval(spawnTimerRef.current);
      clearInterval(tickTimerRef.current);
      Object.values(despawnTimers.current).forEach(clearTimeout);
      onComplete(timeRef.current);
    }
  }, [score]);

  // Main timer tick
  useEffect(() => {
    tickTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!gameOverRef.current) {
            gameOverRef.current = true;
            setGameOver(true);
            clearInterval(spawnTimerRef.current);
            clearInterval(tickTimerRef.current);
            Object.values(despawnTimers.current).forEach(clearTimeout);
            onFail();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tickTimerRef.current);
  }, []);

  // Spawn loop
  useEffect(() => {
    const spawnOne = () => {
      if (gameOverRef.current) return;
      const current = slotsRef.current;
      const emptyIndices = current.map((s, i) => s === null ? i : -1).filter(i => i >= 0);
      const activeCount = current.filter(s => s !== null).length;
      if (emptyIndices.length === 0 || activeCount >= maxVisible) return;

      const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const isSpam = Math.random() < 0.7;
      const pool = isSpam ? SPAM_ITEMS : NORMAL_ITEMS;
      const template = pool[Math.floor(Math.random() * pool.length)];
      const id = ++idCounter.current;
      const item = { ...template, id, spawnTime: Date.now() };

      setSlots(prev => {
        const next = [...prev];
        next[idx] = item;
        return next;
      });

      // Auto-despawn after visibleDuration
      despawnTimers.current[id] = setTimeout(() => {
        setSlots(prev => {
          const next = [...prev];
          if (next[idx] && next[idx].id === id) next[idx] = null;
          return next;
        });
        delete despawnTimers.current[id];
      }, visibleDuration);
    };

    spawnTimerRef.current = setInterval(spawnOne, spawnInterval);
    // Initial spawn after a short delay
    const initTimer = setTimeout(spawnOne, 300);
    return () => {
      clearInterval(spawnTimerRef.current);
      clearTimeout(initTimer);
      Object.values(despawnTimers.current).forEach(clearTimeout);
    };
  }, []);

  const handleSlotClick = (idx, e) => {
    if (gameOverRef.current) return;
    const item = slots[idx];
    if (!item) return;

    // Cancel auto-despawn
    if (despawnTimers.current[item.id]) {
      clearTimeout(despawnTimers.current[item.id]);
      delete despawnTimers.current[item.id];
    }

    if (item.isSpam) {
      // Correct — burst animation
      setBurstSlot(idx);
      setScore(prev => prev + item.points);
      setSlots(prev => { const n = [...prev]; n[idx] = null; return n; });
      setTimeout(() => setBurstSlot(null), 250);
    } else {
      // Wrong — shake + time penalty
      setWrongSlot(idx);
      setScore(prev => prev + item.points);
      setTimeLeft(prev => Math.max(0, prev - wrongPenalty));
      setTimeout(() => {
        setWrongSlot(null);
        setSlots(prev => { const n = [...prev]; if (n[idx] && n[idx].id === item.id) n[idx] = null; return n; });
      }, 400);
    }
  };

  const timePercent = (timeLeft / baseTime) * 100;
  const scorePercent = Math.min(100, (score / targetScore) * 100);

  return (
    <div style={{
      width: "100%", height: "100%", background: "#0d1117",
      display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', system-ui, sans-serif",
      userSelect: "none",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", background: "#161b22", borderBottom: "1px solid #30363d" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#c9d1d9" }}>📧 Spam Temizliği</span>
          <span style={{
            fontSize: 16, fontWeight: 800,
            color: timeLeft <= 5 ? "#f85149" : "#58a6ff",
            animation: timeLeft <= 5 ? "pulse 0.5s infinite" : "none",
          }}>
            ⏱ {timeLeft}s
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#8b949e" }}>🗑️ {score}/{targetScore} temizlendi</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, background: "#21262d", borderRadius: 3, marginBottom: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3, transition: "width 0.3s",
            width: `${scorePercent}%`,
            background: score >= targetScore ? "#3fb950" : "linear-gradient(90deg, #e74c3c, #f59e0b)",
          }} />
        </div>
        {/* Time bar */}
        <div style={{ height: 4, background: "#21262d", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, transition: "width 1s linear",
            width: `${timePercent}%`,
            background: timeLeft <= 5 ? "#f85149" : "#58a6ff",
          }} />
        </div>
      </div>

      {/* Hint */}
      <div style={{
        padding: "8px 16px", background: "rgba(248,81,73,0.06)",
        borderBottom: "1px solid #21262d", textAlign: "center",
      }}>
        <span style={{ fontSize: 11, color: "#8b949e" }}>
          💡 <span style={{ color: "#f85149" }}>Spam</span>'e dokun! <span style={{ color: "#58a6ff" }}>Normal mail</span>'e dokunMA! Yanlış = -{wrongPenalty}s
        </span>
      </div>

      {/* 3x3 Grid */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10,
          width: "100%", maxWidth: 300, aspectRatio: "1",
        }}>
          {slots.map((slot, idx) => {
            const isBurst = burstSlot === idx;
            const isWrong = wrongSlot === idx;

            return (
              <div
                key={idx}
                onClick={(e) => handleSlotClick(idx, e)}
                style={{
                  position: "relative",
                  borderRadius: 14,
                  minHeight: 80,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  cursor: slot ? "pointer" : "default",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                  ...(slot === null ? {
                    background: "#161b22",
                    border: "2px solid #21262d",
                  } : slot.isSpam ? {
                    background: "rgba(248,81,73,0.15)",
                    border: "2px solid rgba(248,81,73,0.5)",
                  } : {
                    background: "rgba(88,166,255,0.15)",
                    border: "2px solid rgba(88,166,255,0.3)",
                  }),
                  ...(isWrong ? { animation: "shake 0.3s ease-in-out" } : {}),
                }}
              >
                {/* Empty slot icon */}
                {slot === null && !isBurst && (
                  <span style={{ fontSize: 24, opacity: 0.15 }}>📭</span>
                )}

                {/* Burst animation */}
                {isBurst && (
                  <span style={{
                    fontSize: 32,
                    animation: "burst 0.25s ease-out forwards",
                  }}>💥</span>
                )}

                {/* Wrong click penalty label */}
                {isWrong && (
                  <div style={{
                    position: "absolute", top: 4, right: 4,
                    background: "#f85149", color: "#fff",
                    fontSize: 10, fontWeight: 800, padding: "2px 6px",
                    borderRadius: 6, zIndex: 5,
                  }}>
                    ❌ -{wrongPenalty}s
                  </div>
                )}

                {/* Active item */}
                {slot && !isBurst && (
                  <div style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    animation: "popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    gap: 2,
                  }}>
                    <span style={{ fontSize: 28 }}>{slot.emoji}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
                      color: slot.isSpam ? "#f85149" : "#58a6ff",
                    }}>{slot.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes popUp { from { transform: translateY(100%) scale(0.5); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes popDown { from { transform: translateY(0) scale(1); opacity: 1; } to { transform: translateY(100%) scale(0.5); opacity: 0; } }
        @keyframes burst { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.5; } 100% { transform: scale(0); opacity: 0; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

// =========================================
// KLİMA AYARLAMA (Among Us tarzı)
// =========================================
function AcAdjustGame({ difficulty, ownedItems = [], onComplete, onFail }) {
  const day = difficulty.day || 1;
  const bonusTime = ownedItems.includes("dual_monitor") ? 5 : 0;
  const baseTime = Math.max(8, 18 - day) + bonusTime;
  // Zorluk arttıkça: daha geniş aralık, daha fazla tur
  const tempRange = { min: 10, max: 35 };
  const totalRounds = Math.min(5, 2 + Math.floor(day / 2));

  const [targetTemp, setTargetTemp] = useState(20);
  const [currentTemp, setCurrentTemp] = useState(20);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(baseTime);
  const [gameOver, setGameOver] = useState(false);
  const [flash, setFlash] = useState(null); // "success" | "fail" | null
  const [score, setScore] = useState(0);

  const gameOverRef = useRef(false);
  const tickRef = useRef(null);

  // Yeni round üret
  const generateRound = useCallback(() => {
    const target = Math.floor(Math.random() * (tempRange.max - tempRange.min + 1)) + tempRange.min;
    let start;
    do {
      start = Math.floor(Math.random() * (tempRange.max - tempRange.min + 1)) + tempRange.min;
    } while (Math.abs(start - target) < 3);
    setTargetTemp(target);
    setCurrentTemp(start);
  }, []);

  // İlk round
  useEffect(() => { generateRound(); }, []);

  // Timer
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!gameOverRef.current) {
            gameOverRef.current = true;
            setGameOver(true);
            clearInterval(tickRef.current);
            onFail();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  const handleSubmit = () => {
    if (gameOverRef.current) return;
    if (currentTemp === targetTemp) {
      // Doğru!
      const newScore = score + 1;
      setScore(newScore);
      setFlash("success");
      setTimeout(() => setFlash(null), 400);

      if (newScore >= totalRounds) {
        // Oyun kazanıldı
        gameOverRef.current = true;
        setGameOver(true);
        clearInterval(tickRef.current);
        setTimeout(() => onComplete(timeLeft), 500);
      } else {
        // Sonraki round
        setRound(r => r + 1);
        generateRound();
      }
    } else {
      // Yanlış — süre cezası
      const penalty = ownedItems.includes("mech_keyboard") ? 1 : difficulty.wrongPenalty;
      setTimeLeft(prev => Math.max(0, prev - penalty));
      setFlash("fail");
      setTimeout(() => setFlash(null), 400);
    }
  };

  const adjustTemp = (delta) => {
    if (gameOverRef.current) return;
    setCurrentTemp(prev => Math.max(tempRange.min, Math.min(tempRange.max, prev + delta)));
  };

  // Basılı tutma (hold-to-repeat)
  const holdRef = useRef(null);
  const startHold = (delta) => {
    adjustTemp(delta);
    // İlk 400ms bekle, sonra 100ms aralıklarla tekrarla
    holdRef.current = setTimeout(() => {
      holdRef.current = setInterval(() => adjustTemp(delta), 100);
    }, 400);
  };
  const stopHold = () => {
    clearTimeout(holdRef.current);
    clearInterval(holdRef.current);
    holdRef.current = null;
  };

  const timePercent = (timeLeft / baseTime) * 100;
  const roundPercent = (score / totalRounds) * 100;

  // Sıcaklık renk hesabı
  const getTempColor = (temp) => {
    const ratio = (temp - tempRange.min) / (tempRange.max - tempRange.min);
    if (ratio < 0.3) return "#58a6ff"; // soğuk - mavi
    if (ratio < 0.5) return "#3fb950"; // ılık - yeşil
    if (ratio < 0.7) return "#f59e0b"; // sıcak - sarı
    return "#f85149"; // çok sıcak - kırmızı
  };

  // Termometre doluluk oranı
  const getTempPercent = (temp) => ((temp - tempRange.min) / (tempRange.max - tempRange.min)) * 100;

  return (
    <div style={{
      width: "100%", height: "100%", background: "#0d1117",
      display: "flex", flexDirection: "column",
      fontFamily: "'Segoe UI', system-ui, sans-serif", userSelect: "none",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", background: "#161b22", borderBottom: "1px solid #30363d" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#c9d1d9" }}>❄️ Klima Ayarla</span>
          <span style={{
            fontSize: 16, fontWeight: 800,
            color: timeLeft <= 5 ? "#f85149" : "#58a6ff",
            animation: timeLeft <= 5 ? "pulse 0.5s infinite" : "none",
          }}>⏱ {timeLeft}s</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#8b949e" }}>📋 Round {round}/{totalRounds}</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, background: "#21262d", borderRadius: 3, marginBottom: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3, transition: "width 0.3s",
            width: `${roundPercent}%`,
            background: score >= totalRounds ? "#3fb950" : "linear-gradient(90deg, #3fb950, #58a6ff)",
          }} />
        </div>
        {/* Time bar */}
        <div style={{ height: 4, background: "#21262d", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2, transition: "width 1s linear",
            width: `${timePercent}%`,
            background: timeLeft <= 5 ? "#f85149" : "#58a6ff",
          }} />
        </div>
      </div>

      {/* Hint */}
      <div style={{
        padding: "8px 16px", background: "rgba(88,166,255,0.06)",
        borderBottom: "1px solid #21262d", textAlign: "center",
      }}>
        <span style={{ fontSize: 11, color: "#8b949e" }}>
          💡 Klimayı hedef sıcaklığa ayarla ve <span style={{ color: "#3fb950", fontWeight: 700 }}>Onayla</span>'ya bas!
        </span>
      </div>

      {/* Main area — iki klima paneli yan yana */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 32, padding: "20px 16px",
        animation: flash === "success" ? "flashGreen 0.4s" : flash === "fail" ? "flashRed 0.4s" : "none",
      }}>
        {/* SOL — Ayarlanabilir klima */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8b949e", letterSpacing: 1 }}>AYARLA</div>

          {/* Yukarı ok */}
          <button
            onMouseDown={() => startHold(1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => startHold(1)}
            onTouchEnd={stopHold}
            style={{
              width: 64, height: 48, borderRadius: 12, border: "2px solid #30363d",
              background: "#161b22", color: "#c9d1d9", fontSize: 24,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s, border-color 0.15s",
            }}
          >▲</button>

          {/* Klima gövdesi */}
          <div style={{
            width: 100, height: 200, borderRadius: 16,
            background: "#161b22", border: "3px solid #30363d",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "flex-end", overflow: "hidden", position: "relative",
          }}>
            {/* Doluluk çubuğu */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: `${getTempPercent(currentTemp)}%`,
              background: `linear-gradient(to top, ${getTempColor(currentTemp)}, ${getTempColor(currentTemp)}88)`,
              transition: "height 0.2s, background 0.3s",
              borderRadius: "0 0 13px 13px",
            }} />
            {/* Sıcaklık değeri */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 32, fontWeight: 900, color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              zIndex: 2,
            }}>
              {currentTemp}°
            </div>
          </div>

          {/* Aşağı ok */}
          <button
            onMouseDown={() => startHold(-1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => startHold(-1)}
            onTouchEnd={stopHold}
            style={{
              width: 64, height: 48, borderRadius: 12, border: "2px solid #30363d",
              background: "#161b22", color: "#c9d1d9", fontSize: 24,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s, border-color 0.15s",
            }}
          >▼</button>
        </div>

        {/* SAĞ — Hedef sıcaklık (kırmızı, salt okunur) */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f85149", letterSpacing: 1 }}>HEDEF</div>

          {/* Boş alan — üst ok ile hizalamak için */}
          <div style={{ width: 64, height: 48 }} />

          {/* Hedef klima gövdesi */}
          <div style={{
            width: 100, height: 200, borderRadius: 16,
            background: "#1a0a0a", border: "3px solid #f8514960",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "flex-end", overflow: "hidden", position: "relative",
          }}>
            {/* Doluluk çubuğu */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: `${getTempPercent(targetTemp)}%`,
              background: "linear-gradient(to top, #f85149, #f8514966)",
              borderRadius: "0 0 13px 13px",
            }} />
            {/* Sıcaklık değeri */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 32, fontWeight: 900, color: "#f85149",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              zIndex: 2,
            }}>
              {targetTemp}°
            </div>
          </div>

          {/* Boş alan — alt ok ile hizalamak için */}
          <div style={{ width: 64, height: 48 }} />
        </div>
      </div>

      {/* Onayla butonu */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid #30363d" }}>
        <button
          onClick={handleSubmit}
          disabled={gameOver}
          style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: currentTemp === targetTemp
              ? "linear-gradient(135deg, #238636, #2ea043)"
              : "linear-gradient(135deg, #30363d, #21262d)",
            color: currentTemp === targetTemp ? "#fff" : "#8b949e",
            fontWeight: 800, fontSize: 16, cursor: gameOver ? "default" : "pointer",
            boxShadow: currentTemp === targetTemp ? "0 4px 16px rgba(35,134,54,0.4)" : "none",
            transition: "all 0.3s",
            opacity: gameOver ? 0.5 : 1,
          }}
        >
          {currentTemp === targetTemp ? "✓ Onayla" : `${Math.abs(targetTemp - currentTemp)}° ${currentTemp < targetTemp ? "↑ Arttır" : "↓ Azalt"}`}
        </button>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes flashGreen { 0% { background: rgba(63,185,80,0.3); } 100% { background: transparent; } }
        @keyframes flashRed { 0% { background: rgba(248,81,73,0.3); } 100% { background: transparent; } }
      `}</style>
    </div>
  );
}

// =========================================
// ZAMAN YARDIMCI FONKSİYONU
// =========================================
const timeAgo = (isoString) => {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "az önce";
    if (mins < 60) return `${mins} dk önce`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "dün";
    if (days < 7) return `${days} gün önce`;
    return `${Math.floor(days / 7)} hafta önce`;
  } catch { return ""; }
};

// =========================================
// ANA OYUN MOTORU
// =========================================
export default function OfficeSimulator() {
  const [scene, setScene] = useState("MENU"); // MENU, DEPT_SELECT, DESK_VIEW, PC_VIEW, END_DAY
  const [selectedDept, setSelectedDept] = useState(null);
  const [money, setMoney] = useState(100);
  const [reputation, setReputation] = useState(10);

  // Gun sistemi
  const [day, setDay] = useState(1);
  const [customersLeft, setCustomersLeft] = useState(3);
  const [dayStats, setDayStats] = useState({ served: 0, earned: 0, perfect: 0 });

  // Ziyaretci
  const [customer, setCustomer] = useState(null);
  const [dialogue, setDialogue] = useState(null);

  // Mini-Game
  const [gameType, setGameType] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [quizResult, setQuizResult] = useState(null); // { selected, correct, success }
  const [designItems, setDesignItems] = useState([]);
  const [miniTimer, setMiniTimer] = useState(0);
  const miniTimerRef = useRef(null);
  const jobDoneRef = useRef(false); // completeJob çift çağrı koruması

  // Feedback
  const [feedback, setFeedback] = useState(null);
  const [customerLeaving, setCustomerLeaving] = useState(false);

  // Anti-repeat: son oynanan oyun tipi
  const [lastGameType, setLastGameType] = useState(null);

  // Debug/Test modu: secilen oyun tipini ve karakteri zorla
  const [forcedGameType, setForcedGameType] = useState(null);
  const [forcedCharacter, setForcedCharacter] = useState(null);

  // Gun akisi: sabah hazirlik -> ofis ac -> ziyaretci gelir
  const [isDayStarted, setIsDayStarted] = useState(false);

  // Magaza sistemi
  const [ownedItems, setOwnedItems] = useState([]);
  const [showShop, setShowShop] = useState(false);

  // Oyun ici menu & Ayarlar
  const [showInGameMenu, setShowInGameMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gkt_settings")) || {
        sfxEnabled: true,
        musicEnabled: true,
        showTimer: true,
      };
    } catch { return { sfxEnabled: true, musicEnabled: true, showTimer: true }; }
  });

  // Departman secildiginde oyunu baslat
  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    setMoney(10);
    setReputation(0);
    setDay(1);
    setCustomersLeft(3);
    setDayStats({ served: 0, earned: 0, perfect: 0 });
    setCustomer(null);
    setDialogue(null);
    setOwnedItems([]);
    setIsDayStarted(false);
    setIsUnderWatch(false);
    setForcedGameType(null);
    // Hiyerarşi sıfırla
    setPlayerRank(0);
    setSelectedTeam(null);
    setShowPromotion(null);
    setShowDirectorChoice(false);
    setShowElectionButton(false);
    // Kariyer istatistikleri
    setCareerStats({ ...EMPTY_SEASON_STATS });
    // Seçim
    setShowElection(false);
    setElectionResult(null);
    setRivalData(null);
    // Dopamin
    setStreak(0);
    setScene("DESK_VIEW");
    // Sprite'ları preload et
    CHARACTERS.forEach(ch => {
      [ch.sprite, ch.spriteHappy, ch.spriteUnhappy].filter(Boolean).forEach(src => {
        const img = new Image(); img.src = src;
      });
    });
  };

  // Debug modda departman secilince oyun secim ekranina git
  const handleDebugDeptSelect = (dept) => {
    setSelectedDept(dept);
    setScene("DEBUG_GAME_SELECT");
  };

  // Debug modda oyun tipi secilince direkt baslat
  const handleDebugGameSelect = (gameType) => {
    setForcedGameType(gameType);
    setMoney(50);
    setReputation(0);
    setDay(1);
    setCustomersLeft(99);
    setDayStats({ served: 0, earned: 0, perfect: 0 });
    setCustomer(null);
    setDialogue(null);
    setOwnedItems([]);
    setIsDayStarted(true);
    setScene("DESK_VIEW");
  };

  // Magaza satin alma
  const handleBuyItem = (item) => {
    if (money >= 0 && money >= item.price && !ownedItems.includes(item.id)) {
      setMoney((m) => m - item.price);
      setOwnedItems((prev) => [...prev, item.id]);
      setTimeout(() => saveGame(), 100);
    }
  };


  // Kisisel en iyiler (localStorage)
  const [personalBest, setPersonalBest] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gkt_personal_best")) || {
        maxMoney: 0, maxDay: 0, totalPerfect: 0, allItemsDay: null,
      };
    } catch { return { maxMoney: 0, maxDay: 0, totalPerfect: 0, allItemsDay: null }; }
  });

  // Dopamin sistemi
  const [streak, setStreak] = useState(0);

  // Hiyerarşi sistemi
  const [playerRank, setPlayerRank] = useState(0); // 0-6 arası kademe
  const [selectedTeam, setSelectedTeam] = useState(null); // Kademe 1'de seçilen takım
  const [showPromotion, setShowPromotion] = useState(null); // Terfi popup verisi
  const [showDirectorChoice, setShowDirectorChoice] = useState(false); // Direktörlük seçim popup
  const [showElectionButton, setShowElectionButton] = useState(false); // 250+ ⭐'da seçim butonu

  // Kariyer istatistikleri (seçim puanı için)
  const [careerStats, setCareerStats] = useState({ ...EMPTY_SEASON_STATS });

  // Endgame seçim
  const [showElection, setShowElection] = useState(false);
  const [electionResult, setElectionResult] = useState(null);
  const [rivalData, setRivalData] = useState(null);

  // Gözetim durumu (patron takibi)
  const [isUnderWatch, setIsUnderWatch] = useState(false);

  // Save/Load sistemi
  const [debugTapCount, setDebugTapCount] = useState(0);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [saveInfo, setSaveInfo] = useState(null);
  const debugTapTimer = useRef(null);

  // Save/Load fonksiyonları
  const saveGame = useCallback(() => {
    try {
      const saveData = {
        day,
        money,
        reputation,
        playerRank,
        selectedDeptId: selectedDept?.id || null,
        selectedTeam,
        ownedItems,
        careerStats,
        streak,
        personalBest,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("gkt_save_data", JSON.stringify(saveData));
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 1200);
    } catch {}
  }, [day, money, reputation, playerRank, selectedDept, selectedTeam, ownedItems, careerStats, streak, personalBest]);

  const loadGame = useCallback(() => {
    try {
      const raw = localStorage.getItem("gkt_save_data");
      if (!raw) return null;
      const data = JSON.parse(raw);
      // Restore states
      setDay(data.day || 1);
      setMoney(data.money ?? 10);
      setReputation(data.reputation ?? 0);
      setPlayerRank(data.playerRank ?? 0);
      setSelectedTeam(data.selectedTeam || null);
      setOwnedItems(data.ownedItems || []);
      setCareerStats(data.careerStats || { ...EMPTY_SEASON_STATS });
      setStreak(data.streak || 0);
      if (data.personalBest) setPersonalBest(data.personalBest);
      // Restore department
      const dept = DEPARTMENTS.find(d => d.id === data.selectedDeptId);
      if (dept) setSelectedDept(dept);
      // Land on morning preparation
      setIsDayStarted(false);
      setCustomersLeft(3 + Math.floor((data.day || 1) * 0.7));
      setDayStats({ served: 0, earned: 0, perfect: 0 });
      setCustomer(null);
      setDialogue(null);
      setFeedback(null);
      setShowShop(false);
      setShowInGameMenu(false);
      setScene("DESK_VIEW");
      return data;
    } catch {
      return null;
    }
  }, []);

  const hasSaveData = useCallback(() => {
    try {
      const raw = localStorage.getItem("gkt_save_data");
      if (!raw) return null;
      const data = JSON.parse(raw);
      const dept = DEPARTMENTS.find(d => d.id === data.selectedDeptId);
      return {
        day: data.day || 1,
        savedAt: data.savedAt,
        deptName: dept?.name || "Bilinmiyor",
      };
    } catch {
      return null;
    }
  }, []);

  const deleteSaveData = useCallback(() => {
    try { localStorage.removeItem("gkt_save_data"); } catch {}
  }, []);

  // Menu açılınca save bilgisini kontrol et
  useEffect(() => {
    if (scene === "MENU") {
      setSaveInfo(hasSaveData());
      setShowNewGameConfirm(false);
      setDebugTapCount(0);
    }
  }, [scene, hasSaveData]);

  // Ziyaretci gelme dongusu (sadece isDayStarted ise, feedback/shop yoksa, anti-repeat RNG)
  useEffect(() => {
    if (scene === "DESK_VIEW" && isDayStarted && !customer && customersLeft > 0 && !feedback && !showShop) {
      const timer = setTimeout(() => {
        // Departmana göre filtrele (seçilmemişse tümü)
        const deptTypes = selectedDept
          ? CUSTOMER_TYPES.filter(t => t.dept === selectedDept.id)
          : CUSTOMER_TYPES;
        let type = deptTypes[Math.floor(Math.random() * deptTypes.length)];
        // Debug modda secilen oyun tipini zorla
        if (forcedGameType) {
          type = (selectedDept ? deptTypes : CUSTOMER_TYPES).find((t) => t.gameType === forcedGameType) || type;
        } else {
          // %70 ihtimalle ayni oyun tipi art arda gelmesin
          if (type.gameType === lastGameType && Math.random() > 0.3) {
            type = deptTypes.find((t) => t.gameType !== lastGameType) || type;
          }
        }
        const request = forcedGameType
          ? "[TEST] Debug modunda zorlanan görev."
          : type.requests[Math.floor(Math.random() * type.requests.length)];
        const character = forcedCharacter || CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        setCustomer({ id: Date.now(), ...type, ...character, request });
      }, 1500);
      return () => clearTimeout(timer);
    } else if (scene === "DESK_VIEW" && isDayStarted && !customer && customersLeft <= 0 && !feedback && !showShop) {
      const t = setTimeout(() => setScene("END_DAY"), 800);
      return () => clearTimeout(t);
    }
  }, [customer, scene, customersLeft, feedback, lastGameType, isDayStarted, showShop, forcedCharacter, selectedDept]);

  // İş bitirme — sade GP + streak + feedback
  const completeJob = useCallback(
    (success, timeLeft = 0) => {
      if (jobDoneRef.current) return;
      jobDoneRef.current = true;

      let earned = 0;
      let repChange = 0;
      let streakBonus = 0;

      if (success) {
        // Temel GP: gün ilerledikçe artar
        const diff = getDifficulty(day);
        const baseGP = diff.day >= 15 ? 3 : diff.day >= 5 ? 2 : 1;

        // Neon tabela bonusu (+1 GP)
        const neonBonus = ownedItems.includes("neon_sign") ? 1 : 0;

        // Streak bonusu (borçta olsa bile çalışır!)
        streakBonus = streak >= 8 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1 : 0;

        earned = baseGP + neonBonus + streakBonus;

        // İtibar: hızlı bitirdiyse 2, normal 1
        repChange = timeLeft > 5 ? 2 : 1;

        setStreak(prev => prev + 1);
        setMoney(prev => prev + earned);
        setReputation(prev => prev + repChange);
        setDayStats(s => ({
          ...s,
          served: s.served + 1,
          earned: s.earned + earned,
          perfect: s.perfect + (timeLeft > 5 ? 1 : 0),
        }));
        setCareerStats(prev => ({
          ...prev,
          totalEarned: (prev.totalEarned || 0) + earned,
          totalJobs: (prev.totalJobs || 0) + 1,
          bestStreak: Math.max(prev.bestStreak || 0, streak + 1),
        }));
      } else {
        repChange = -1;
        setStreak(0);
        setReputation(prev => Math.max(0, prev + repChange));
        setDayStats(s => ({ ...s, served: s.served + 1 }));
        setCareerStats(prev => ({
          ...prev,
          totalJobs: (prev.totalJobs || 0) + 1,
          failedJobs: (prev.failedJobs || 0) + 1,
        }));
      }

      // Sıcak minimal feedback
      setFeedback({ success, earned, streakBonus, repChange });
      setCustomersLeft(prev => Math.max(0, prev - 1));

      // Faz 1: Oyunun kendi sonuç ekranını göster (yeşil/kırmızı) — 800ms PC_VIEW'de kal
      setTimeout(() => {
        setGameType(null);
        setMiniTimer(0);
        setScene("DESK_VIEW");
      }, 800);

      // Faz 2: Çıkış animasyonunu başlat (feedback'i koru ki sprite değişmesin)
      setTimeout(() => {
        setCustomerLeaving(true);
      }, 2400);

      // Faz 3: Animasyon bittikten sonra tamamen temizle
      setTimeout(() => {
        setCustomer(null);
        setDialogue(null);
        setFeedback(null);
        setCustomerLeaving(false);
        jobDoneRef.current = false;
      }, 2900);
    },
    [day, ownedItems, streak]
  );

  // Mini-game zamanlayici (Quiz ve Design icin — DragDrop, MemoryMatch, WireConnect, SortFiles ve AlignLogo kendi timerlarini yonetir)
  const miniTimerActive = scene === "PC_VIEW" && (gameType === "QUIZ" || gameType === "DESIGN_CLICK") && miniTimer > 0;
  useEffect(() => {
    if (!miniTimerActive) return;
    miniTimerRef.current = setInterval(() => {
      setMiniTimer((t) => {
        if (t <= 1) {
          clearInterval(miniTimerRef.current);
          completeJob(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(miniTimerRef.current);
  }, [miniTimerActive, completeJob]);

  // Mini-game baslatici (zorluga gore dinamik icerik)
  const startMiniGame = () => {
    if (!customer) return;
    jobDoneRef.current = false; // yeni iş için sıfırla
    setScene("PC_VIEW");
    setGameType(customer.gameType);
    setLastGameType(customer.gameType);


    const diff = getDifficulty(day);

    if (customer.gameType === "DESIGN_CLICK") {
      setMiniTimer(diff.designTime);
      const wrongLabels = ["ESKİ LOGO", "YANLIŞ FONT", "PİKSEL LOGO", "ÇALINTI LOGO", "PAİNT ÇİZİMİ"];
      const items = [
        { id: 0, x: `${20 + Math.random() * 40}%`, y: `${20 + Math.random() * 40}%`, correct: true, label: "YENİ LOGO" },
      ];
      for (let i = 1; i < diff.designItems; i++) {
        items.push({
          id: i,
          x: `${10 + Math.random() * 70}%`,
          y: `${15 + Math.random() * 65}%`,
          correct: false,
          label: wrongLabels[i % wrongLabels.length],
        });
      }
      setDesignItems(items.sort(() => Math.random() - 0.5));
      setDesignResult(null);
    } else if (customer.gameType === "QUIZ") {
      setMiniTimer(diff.quizTime);
      setQuizResult(null);
      const pool = QUIZ_POOLS[customer.dept] || QUIZ_POOLS.media_it;
      const q = pool[Math.floor(Math.random() * pool.length)];
      setQuizData(q);
    }
    // DRAG_DROP, MEMORY_MATCH, WIRE_CONNECT, SORT_FILES, ALIGN_LOGO, SPAM_CLEANUP ve AC_ADJUST kendi timerlarini ve state'lerini yonetir
  };

  const [designResult, setDesignResult] = useState(null);
  const handleDesignClick = (item) => {
    if (designResult) return;
    clearInterval(miniTimerRef.current);
    setDesignResult(item.correct ? "correct" : "wrong");
    if (item.correct) {
      completeJob(true, miniTimer);
    } else {
      completeJob(false);
    }
  };

  const handleQuizAnswer = (answer) => {
    if (quizResult) return;
    clearInterval(miniTimerRef.current);
    const success = answer === quizData?.answer;
    setQuizResult({ selected: answer, correct: quizData?.answer, success });
    completeJob(success, miniTimer);
  };

  // Yeni gun
  const startNextDay = () => {
    const diff = getDifficulty(day);
    const plantDiscount = ownedItems.includes("potted_plant") ? 1 : 0;
    const rent = Math.max(0, diff.rent - plantDiscount);

    // Kişisel en iyileri güncelle
    const newBest = { ...personalBest };
    if (money > newBest.maxMoney) newBest.maxMoney = Math.floor(money);
    if (day > newBest.maxDay) newBest.maxDay = day;
    newBest.totalPerfect += dayStats.perfect;
    if (ownedItems.length >= SHOP_ITEMS.length && !newBest.allItemsDay) newBest.allItemsDay = day;
    setPersonalBest(newBest);
    try { localStorage.setItem("gkt_personal_best", JSON.stringify(newBest)); } catch {}

    // Kahve makinesi bonusu
    if (ownedItems.includes("coffee_machine")) {
      setReputation((r) => r + 2);
    }
    // Operasyon gideri öde
    setMoney((m) => m - rent);

    // Kariyer istatistiklerini gün sonu için güncelle
    setCareerStats(prev => ({
      ...prev,
      activeDays: prev.activeDays + 1,
      noFailDays: prev.dayFailed ? prev.noFailDays : prev.noFailDays + 1,
      dayFailed: false,
    }));

    // === TERFİ KONTROLÜ ===
    // reputation state henüz güncellenmemiş olabilir, mevcut değeri kullan
    const currentRep = reputation + (ownedItems.includes("coffee_machine") ? 2 : 0);
    const newRankInfo = getRankInfo(currentRep, playerRank);

    if (newRankInfo.rank > playerRank && playerRank < 6) {
      if (money < 0) {
        // TERFİ AMBARGOSU: Borçtayken terfi edemez
        setShowPromotion({
          isWarning: true,
          message: `${newRankInfo.title} olmak için yeterli itibara ulaştın! Ancak kulüp kasası eksideyken terfi alamazsın. Önce borcu kapat!`
        });
        setTimeout(() => setShowPromotion(null), 4000);
      } else {
        // Terfi var!
        const oldRank = GKT_HIERARCHY[playerRank];
        const newRank = newRankInfo;

        setPlayerRank(newRank.rank);
        setMoney(m => m + newRank.gpBonus);

        // Terfi popup göster
        setShowPromotion({
          oldRank: oldRank,
          newRank: newRank,
          gpBonus: newRank.gpBonus,
        });

        // Kademe 1'e ulaştıysa → direktörlük seçimi gerekiyor
        if (newRank.rank === 1 && !selectedTeam) {
          setTimeout(() => {
            setShowPromotion(null);
            setShowDirectorChoice(true);
          }, 3000);
        } else {
          setTimeout(() => setShowPromotion(null), 3000);
        }

        // Kademe 5'e ulaştıysa → seçim butonu aktif olsun
        if (newRank.rank >= 5) {
          setShowElectionButton(true);
        }
      }
    }

    // Yeni güne geç
    setDay((d) => d + 1);
    setCustomersLeft(3 + Math.floor(day * 0.7));
    setDayStats({ served: 0, earned: 0, perfect: 0, rent, plantDiscount });
    setIsDayStarted(false);
    setScene("DESK_VIEW");
    // Otomatik kaydet
    setTimeout(() => saveGame(), 100);
  };

  // Endgame seçimini başlat (oyuncu 250+ ⭐ ve Rank 5 iken)
  const triggerEndgameElection = () => {
    const playerScore = calculateCampaignScore(careerStats, reputation);
    // Endgame rakibi güçlü olmalı (season=4 zorluğu)
    const rival = generateRival(playerScore, 4, {
      reputation,
      totalEarned: careerStats.totalEarned,
      perfectJobs: careerStats.perfectJobs,
      bestStreak: careerStats.bestStreak,
    });
    setRivalData(rival);
    setShowElection(true);
    setScene("ELECTION");
  };

  // Seçim sonucu
  const handleElectionResult = (won) => {
    if (won) {
      setPlayerRank(6); // 👑 YK Başkanı!
      setMoney(m => m + GKT_HIERARCHY[6].gpBonus);
      setElectionResult("win");
    } else {
      setElectionResult("lose");
    }
    setScene("ELECTION_RESULT");
  };

  // ==========================================
  // DESK VIEW
  // ==========================================
  const renderDeskView = () => (
    <>
      {/* KATMAN 0: Arka Plan (duvar + duvar objeleri tek resim) */}
      <Sprite src="/assets/office/bg.png" x={0} y={0} width={480} height={800} z={0} className="BG_WALL" />
      {ownedItems.includes("neon_sign") && (
        <Sprite x={140} y={15} width={200} height={35} z={2} customColor="#8e44ad" label="GKT AÇIK ✨" />
      )}

      {/* UI: Bilgi paneli */}
      <div
        style={{
          position: "absolute", top: 10, left: 10, right: 10, zIndex: 100,
          background: "rgba(0,0,0,0.85)", padding: "8px 12px", borderRadius: 10,
          color: "#fff", border: "1px solid #30363d", fontSize: 12,
          display: "flex", flexDirection: "column", gap: 4,
        }}
      >
        {/* Üst satır: Departman, gün, müşteri, para, itibar, streak */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setShowInGameMenu(true)}
              style={{
                background: "rgba(231,76,60,0.2)", border: "1px solid rgba(231,76,60,0.4)",
                color: "#e74c3c", borderRadius: 6, padding: "2px 6px", cursor: "pointer",
                fontSize: 10, fontWeight: 700, lineHeight: 1,
              }}
            >
              ☰
            </button>
            {selectedDept && (
              <span style={{ fontSize: 9, fontWeight: 700, color: selectedDept.color, background: `${selectedDept.color}20`, padding: "2px 6px", borderRadius: 4 }}>
                {selectedDept.icon} {selectedDept.name}
              </span>
            )}
            <span><span style={{ color: "#8b949e" }}>📅</span> Gün {day}</span>
            <span><span style={{ color: "#8b949e" }}>👥</span> {customersLeft}</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: money < 0 ? "#f85149" : "#f1c40f", fontWeight: 700 }}>💰 {Math.floor(money)}{money < 0 ? " BORÇ" : ""}</span>
            <span style={{ color: "#58a6ff", fontWeight: 700 }}>⭐ {reputation}</span>
            {streak >= 2 && (
              <span style={{ color: "#f0883e", fontWeight: 700, fontSize: 11 }}>
                🔥{streak}
              </span>
            )}
          </div>
        </div>
        {/* Alt satır: Rütbe + takım + seçim butonu */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 9 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              fontWeight: 800, color: GKT_HIERARCHY[playerRank].color,
              background: `${GKT_HIERARCHY[playerRank].color}15`,
              padding: "1px 6px", borderRadius: 4,
            }}>
              {GKT_HIERARCHY[playerRank].icon} {GKT_HIERARCHY[playerRank].title}
            </span>
            {selectedTeam && (
              <span style={{ color: "#8b949e", fontWeight: 600 }}>
                · {selectedTeam.icon} {selectedTeam.title}
              </span>
            )}
          </div>
          {/* Seçim butonu — sadece rank 5+ ve 250+ ⭐ ise göster */}
          {showElectionButton && reputation >= 250 && playerRank === 5 && (
            <button
              onClick={triggerEndgameElection}
              style={{
                background: "rgba(241,196,15,0.15)", border: "1px solid rgba(241,196,15,0.4)",
                color: "#f1c40f", borderRadius: 6, padding: "2px 8px",
                fontSize: 9, fontWeight: 800, cursor: "pointer",
                animation: "pulse 2s infinite",
              }}
            >
              🗳️ Genel Kurul
            </button>
          )}
          {/* Bir sonraki rütbeye kalan itibar */}
          {playerRank < 5 && (
            <span style={{ color: "#484f58", fontWeight: 600 }}>
              Sonraki: {GKT_HIERARCHY[playerRank + 1].icon} {GKT_HIERARCHY[playerRank + 1].minRep - reputation} ⭐ kaldı
            </span>
          )}
          {playerRank === 5 && reputation < 250 && (
            <span style={{ color: "#484f58", fontWeight: 600 }}>
              👑 Seçim için: {250 - reputation} ⭐ kaldı
            </span>
          )}
        </div>
      </div>

      {/* KATMAN 2: Ziyaretçi (Masanın arkasında, z:8 — masa z:10 ile alt kısım kapanır) */}
      {customer && (
        <div
          style={{
            position: "absolute",
            left: 40, top: 280,
            width: 400, zIndex: 8,
            display: "flex", flexDirection: "column", alignItems: "center",
            animation: customerLeaving
              ? "characterOut 0.5s ease-in forwards"
              : "characterIn 0.8s cubic-bezier(0.22, 0.9, 0.36, 1)",
            cursor: (feedback || customerLeaving) ? "default" : "pointer",
          }}
          onClick={() => { if (!feedback && !customerLeaving) setDialogue({ text: customer.request }); }}
        >
          {/* GÖREV SONU — Sıcak Minimal Popup (karakterin üstünde) */}
          {feedback && (
            <div style={{
              position: "absolute",
              top: -70,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              animation: "feedbackPopIn 0.3s ease-out",
              pointerEvents: "none",
            }}>
              <div style={{
                background: feedback.success ? "#3fb950" : "#f85149",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 16,
                fontWeight: 900,
                fontSize: 16,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                border: "2px solid rgba(255,255,255,0.2)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                whiteSpace: "nowrap",
              }}>
                {feedback.success ? (
                  <>
                    <span style={{ fontSize: 20 }}>🎉</span>
                    <span>+{feedback.earned} GP</span>
                    {feedback.streakBonus > 0 && (
                      <span style={{ color: "#f1c40f", fontSize: 12 }}>
                        (+{feedback.streakBonus} 🔥)
                      </span>
                    )}
                    <span style={{ color: "#d1ffd6" }}>| ⭐+{feedback.repChange}</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 20 }}>😔</span>
                    <span style={{ color: "#ffd1d1" }}>⭐ {feedback.repChange}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Uçan Coin Efekti */}
          {feedback?.success && (
            <div style={{
              position: "absolute",
              top: -40,
              left: "50%",
              fontSize: 24,
              zIndex: 40,
              pointerEvents: "none",
              animation: "flyToVault 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards",
            }}>💰</div>
          )}
          {/* Karakter isim etiketi — Ahşap tabela stili */}
          <div style={{
            background: "linear-gradient(180deg, #d4a056, #b8863a)",
            color: "#fff",
            padding: "4px 18px",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 800,
            marginBottom: 6,
            zIndex: 20,
            whiteSpace: "nowrap",
            letterSpacing: 0.5,
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
            border: "2px solid #a07030",
          }}>
            {customer.displayName || customer.name}
          </div>

          {/* Başarı pırıltısı */}
          {feedback?.success && <SparkleEffect />}

          {/* Başarısızlık öfke işareti */}
          {feedback && !feedback.success && <AngerMark />}

          {/* Karakter Sprite — duyguya göre değişir */}
          {customer.sprite ? (
            <img
              src={
                feedback?.success ? (customer.spriteHappy || customer.sprite) :
                feedback && !feedback.success ? (customer.spriteUnhappy || customer.sprite) :
                customer.sprite
              }
              alt={customer.displayName || customer.name}
              style={{
                width: 340, height: "auto", objectFit: "contain",
                imageRendering: "auto",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
                animation: feedback?.success ? "happyJump 0.5s ease-out" :
                           feedback && !feedback.success ? "sadShake 0.4s ease-out" :
                           "breathe 4s ease-in-out infinite",
                transformOrigin: "bottom center",
              }}
              draggable={false}
            />
          ) : (
            /* Fallback — sprite yoksa eski placeholder */
            <div style={{
              width: 120, height: 250,
              background: customer.color || "#9b59b6",
              borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 700,
            }}>
              {customer.displayName || customer.name}
            </div>
          )}
        </div>
      )}

      {/* KATMAN 3: Masa (tam canvas boyutunda, üstü şeffaf) */}
      <Sprite src="/assets/office/desk.png" x={0} y={0} width={480} height={800} z={10} className="DESK_SURFACE" />

      {/* KATMAN 4: Laptop (masanın sol tarafı) */}
      {/* Laptop gölgesi — masanın üzerinde durma hissi */}
      <div style={{
        position: "absolute",
        left: -10,
        bottom: 112,
        width: 187,
        height: 15,
        zIndex: 11,
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />
      <img
        src="/assets/office/laptop.png"
        alt="Laptop"
        style={{
          position: "absolute",
          left: -18,
          bottom: 120,
          width: 204,
          height: "auto",
          zIndex: 11,
          pointerEvents: "none",
          filter: customer
            ? "drop-shadow(0 0 8px rgba(88,166,255,0.5))"
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          transition: "filter 0.3s",
          imageRendering: "auto",
        }}
        draggable={false}
      />
      {/* Laptop ekran hitbox — sadece ekran alanı tıklanabilir */}
      <div
        onClick={() => { if (customer && !feedback && !customerLeaving) startMiniGame(); }}
        style={{
          position: "absolute",
          left: 18,
          bottom: 175,
          width: 120,
          height: 70,
          zIndex: 12,
          cursor: (customer && !feedback && !customerLeaving) ? "pointer" : "default",
          background: "transparent",
        }}
        onMouseDown={(e) => {
          if (customer) {
            const img = e.currentTarget.previousElementSibling;
            if (img) img.style.transform = "scale(0.95)";
          }
        }}
        onMouseUp={(e) => {
          const img = e.currentTarget.previousElementSibling;
          if (img) img.style.transform = "scale(1)";
        }}
      />
      {/* Laptop tıklama ipucu — neon yeşil yanıp sönen imleç */}
      {customer && !dialogue && !feedback && !customerLeaving && (
        <svg style={{
          position: "absolute",
          left: 60,
          bottom: 180,
          width: 36,
          height: 44,
          zIndex: 13,
          pointerEvents: "none",
          animation: "cursorBlink 1s ease-in-out infinite",
          filter: "drop-shadow(0 0 6px rgba(57,255,20,0.7))",
          transform: "rotate(-15deg)",
        }} viewBox="0 0 24 28" fill="none">
          <path d="M4 2 L4 22 L9 17 L14 26 L18 24 L13 15 L20 15 Z" fill="#39ff14" stroke="#2bcc0f" strokeWidth="1.2" />
        </svg>
      )}

      {/* KATMAN 5: Diyalog */}
      {dialogue && (
        <div
          style={{
            position: "absolute", top: 230, left: 250, width: 210, zIndex: 20,
            background: "white", padding: "14px 16px",
            borderRadius: "18px 18px 18px 4px", border: `3px solid ${customer.color}`,
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)", animation: "fadeIn 0.25s ease-out",
          }}
        >
          <p style={{ margin: 0, fontWeight: 800, color: customer.color, fontSize: 13 }}>{customer.displayName || customer.name}</p>
          <p style={{ margin: "6px 0 12px", fontSize: 13, color: "#333", lineHeight: 1.5 }}>
            &ldquo;{dialogue.text}&rdquo;
          </p>
          <button
            onClick={startMiniGame}
            style={{
              width: "100%", padding: "10px", background: customer.color, color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 800, fontSize: 13,
            }}
          >
            İşe Başla →
          </button>
        </div>
      )}

      {/* Borc uyari banneri */}
      {isDayStarted && money < 0 && (
        <div style={{
          position: "absolute", top: 48, left: 10, right: 10, zIndex: 150,
          background: "rgba(248,81,73,0.15)", border: "1px solid rgba(248,81,73,0.4)",
          borderRadius: 8, padding: "6px 12px", textAlign: "center",
          animation: "pulse 2s infinite",
        }}>
          <span style={{ color: "#f85149", fontSize: 11, fontWeight: 700 }}>
            ⚠️ BORÇTASIN! Görevleri tamamlayarak borcunu kapat.
          </span>
        </div>
      )}

      {/* Ziyaretci yoksa ve kota varsa bekleme mesaji (sadece gun basladiysa) */}
      {isDayStarted && !customer && customersLeft > 0 && (
        <div
          style={{
            position: "absolute", top: 350, left: "50%", transform: "translateX(-50%)",
            zIndex: 15, color: "#8b949e", fontSize: 12, fontWeight: 600,
            background: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: 8,
          }}
        >
          Ziyaretçi bekleniyor...
        </div>
      )}

      {/* SABAH HAZIRLIK OVERLAY — gun baslamadiysa goster */}
      {!isDayStarted && (() => {
        const diff = getDifficulty(day);
        const plantDiscount = ownedItems.includes("potted_plant") ? 1 : 0;
        const todayRent = Math.max(0, diff.rent - plantDiscount);

        return (
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 200,
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>☀️</div>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: 0, textShadow: "0 2px 12px rgba(88,166,255,0.4)" }}>
              Günaydın!
            </h1>
            <h2 style={{ color: "#8b949e", fontSize: 16, fontWeight: 600, margin: "4px 0 12px" }}>
              Gün {day}
            </h2>

            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <p style={{ color: "#c9d1d9", fontSize: 14, margin: "4px 0" }}>
                Bugün <b>{customersLeft}</b> ziyaretçi bekleniyor
              </p>
              <p style={{ color: money < 0 ? "#f85149" : "#f1c40f", fontSize: 20, fontWeight: 800, margin: "8px 0" }}>
                {money < 0 ? "BORÇ" : "Topluluk Bütçesi"}: {Math.floor(money)} GP
              </p>
              {money < 0 && (
                <p style={{ color: "#f85149", fontSize: 11, fontWeight: 600, margin: "0 0 4px" }}>
                  ⚠️ Borcunu kapat! Görevleri tamamlayarak kazanabilirsin.
                </p>
              )}
            </div>

            {/* Operasyon gideri uyarisi */}
            {day > 1 && (
              <div
                style={{
                  background: "rgba(248,81,73,0.15)", border: "1px solid rgba(248,81,73,0.3)",
                  borderRadius: 8, padding: "8px 16px", marginBottom: 12, textAlign: "center",
                }}
              >
                <span style={{ color: "#f85149", fontSize: 12, fontWeight: 700 }}>
                  Bugünkü operasyon gideri: -{todayRent} GP
                </span>
                {plantDiscount > 0 && (
                  <span style={{ color: "#3fb950", fontSize: 10, marginLeft: 6 }}>
                    (🌿 -{plantDiscount} indirim)
                  </span>
                )}
              </div>
            )}

            {/* Aktif bufflar */}
            {ownedItems.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 16, maxWidth: 320 }}>
                {ownedItems.map((id) => {
                  const item = SHOP_ITEMS.find((s) => s.id === id);
                  return item ? (
                    <span key={id} style={{ fontSize: 10, background: "rgba(35,134,54,0.3)", border: "1px solid rgba(63,185,80,0.3)", color: "#3fb950", padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                      {item.icon} {item.name}
                    </span>
                  ) : null;
                })}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowShop(true)}
                style={{
                  padding: "10px 22px", fontSize: 14, fontWeight: 900,
                  background: "#f39c12", color: "#fff",
                  border: "3px solid #d35400", borderRadius: 12, cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                  transition: "transform 0.1s, background 0.15s, border-color 0.15s, box-shadow 0.15s",
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#e67e22"; e.currentTarget.style.borderColor = "#a04000"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; e.currentTarget.style.background = "#f39c12"; e.currentTarget.style.borderColor = "#d35400"; }}
              >
                Mağaza
              </button>
              <button
                onClick={() => { setIsDayStarted(true); setTimeout(() => saveGame(), 50); }}
                style={{
                  padding: "10px 28px", fontSize: 14, fontWeight: 900,
                  background: "#2ecc71", color: "#fff",
                  border: "3px solid #1e8449", borderRadius: 12, cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                  transition: "transform 0.1s, background 0.15s, border-color 0.15s, box-shadow 0.15s",
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#27ae60"; e.currentTarget.style.borderColor = "#196f3d"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; e.currentTarget.style.background = "#2ecc71"; e.currentTarget.style.borderColor = "#1e8449"; }}
              >
                Ofisi Aç
              </button>
            </div>
          </div>
        );
      })()}
    </>
  );

  // ==========================================
  // PC VIEW
  // ==========================================
  const renderPcView = () => {
    // BUG_FIX — kendi tam ekran bilesenini render eder
    if (gameType === "BUG_FIX") {
      return (
        <div style={{ position: "absolute", inset: 16, zIndex: 50, borderRadius: 12, overflow: "hidden", border: "3px solid #30363d" }}>
          <BugFixGame
            difficulty={getDifficulty(day)}
            ownedItems={ownedItems}
            onComplete={(timeLeft) => completeJob(true, timeLeft)}
            onFail={() => completeJob(false)}
          />
        </div>
      );
    }

    // SORT_FILES — kendi tam ekran bilesenini render eder
    if (gameType === "SORT_FILES") {
      return (
        <div style={{ position: "absolute", inset: 16, zIndex: 50, borderRadius: 12, overflow: "hidden", border: "3px solid #30363d" }}>
          <SortFilesGame
            difficulty={getDifficulty(day)}
            ownedItems={ownedItems}
            onComplete={(timeLeft) => completeJob(true, timeLeft)}
            onFail={() => completeJob(false)}
          />
        </div>
      );
    }

    // ALIGN_LOGO — kendi tam ekran bilesenini render eder
    if (gameType === "ALIGN_LOGO") {
      return (
        <div style={{ position: "absolute", inset: 16, zIndex: 50, borderRadius: 12, overflow: "hidden", border: "3px solid #30363d" }}>
          <AlignLogoGame
            difficulty={getDifficulty(day)}
            ownedItems={ownedItems}
            onComplete={(timeLeft) => completeJob(true, timeLeft)}
            onFail={() => completeJob(false)}
          />
        </div>
      );
    }

    // DRAG_DROP — kendi tam ekran bilesenini render eder
    if (gameType === "DRAG_DROP") {
      return (
        <div style={{ position: "absolute", inset: 16, zIndex: 50, borderRadius: 12, overflow: "hidden", border: "3px solid #30363d" }}>
          <DragDropGame
            difficulty={getDifficulty(day)}
            onComplete={(timeLeft) => completeJob(true, timeLeft)}
            onFail={() => completeJob(false)}
          />
        </div>
      );
    }

    // MEMORY_MATCH — kendi tam ekran bilesenini render eder
    if (gameType === "MEMORY_MATCH") {
      return (
        <div style={{ position: "absolute", inset: 16, zIndex: 50, borderRadius: 12, overflow: "hidden", border: "3px solid #30363d" }}>
          <MemoryMatchGame
            difficulty={getDifficulty(day)}
            ownedItems={ownedItems}
            onComplete={(timeLeft) => completeJob(true, timeLeft)}
            onFail={() => completeJob(false)}
          />
        </div>
      );
    }

    // WIRE_CONNECT — kendi tam ekran bilesenini render eder
    if (gameType === "WIRE_CONNECT") {
      return (
        <div style={{ position: "absolute", inset: 16, zIndex: 50, borderRadius: 12, overflow: "hidden", border: "3px solid #30363d" }}>
          <WireConnectGame
            difficulty={getDifficulty(day)}
            onComplete={(timeLeft) => completeJob(true, timeLeft)}
            onFail={() => completeJob(false)}
          />
        </div>
      );
    }

    // SPAM_CLEANUP — kendi tam ekran bilesenini render eder
    if (gameType === "SPAM_CLEANUP") {
      return (
        <div style={{ position: "absolute", inset: 16, zIndex: 50, borderRadius: 12, overflow: "hidden", border: "3px solid #30363d" }}>
          <SpamCleanupGame
            difficulty={getDifficulty(day)}
            ownedItems={ownedItems}
            onComplete={(timeLeft) => completeJob(true, timeLeft)}
            onFail={() => completeJob(false)}
          />
        </div>
      );
    }

    // AC_ADJUST — kendi tam ekran bilesenini render eder
    if (gameType === "AC_ADJUST") {
      return (
        <div style={{ position: "absolute", inset: 16, zIndex: 50, borderRadius: 12, overflow: "hidden", border: "3px solid #30363d" }}>
          <AcAdjustGame
            difficulty={getDifficulty(day)}
            ownedItems={ownedItems}
            onComplete={(timeLeft) => completeJob(true, timeLeft)}
            onFail={() => completeJob(false)}
          />
        </div>
      );
    }

    // DESIGN ve QUIZ icin ortak cerceve
    return (
      <div
        style={{
          position: "absolute", inset: 20, background: "#161b22", color: "white",
          zIndex: 50, borderRadius: 16, border: "3px solid #30363d", overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "#21262d", padding: "8px 12px", display: "flex",
            justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #30363d",
          }}
        >
          <span style={{ fontSize: 12, color: "#c9d1d9" }}>
            💻 {gameType === "QUIZ" ? "GKT Quiz" : "Tasarım Stüdyosu"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 14, fontWeight: 800,
                color: miniTimer <= 3 ? "#f85149" : "#58a6ff",
                animation: miniTimer <= 3 ? "pulse 0.5s infinite" : "none",
              }}
            >
              ⏱ {miniTimer}s
            </span>
            <button
              onClick={() => { clearInterval(miniTimerRef.current); completeJob(false); }}
              style={{
                background: "#f85149", border: "none", color: "white",
                cursor: "pointer", padding: "4px 10px", borderRadius: 4, fontWeight: 700, fontSize: 11,
              }}
            >
              Vazgeç
            </button>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", padding: 20 }}>
          {/* SPONSOR — Logo secimi */}
          {gameType === "DESIGN_CLICK" && (
            <>
              <h3 style={{ textAlign: "center", margin: "0 0 8px", color: "#c9d1d9" }}>Doğru Logoyu Seç!</h3>
              <p style={{ textAlign: "center", fontSize: 11, color: "#8b949e", margin: "0 0 16px" }}>
                Yanlış seçim = başarısız!
              </p>
              {designItems.map((item) => {
                const picked = designResult && item.correct ? "correct" : designResult && !item.correct ? "wrong" : null;
                return (
                  <div
                    key={item.id}
                    onClick={(e) => handleDesignClick(item, e)}
                    style={{
                      position: "absolute", left: item.x, top: item.y,
                      width: 100, height: 100, borderRadius: 12,
                      cursor: designResult ? "default" : "pointer",
                      background: picked === "correct" ? "#3fb950" : picked === "wrong" ? "#f85149" : item.correct ? "#f1c40f" : "#7f8c8d",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "bold", fontSize: 12, color: picked ? "#fff" : item.correct ? "#000" : "#fff",
                      boxShadow: picked === "correct" ? "0 0 24px rgba(63,185,80,0.5)" : picked === "wrong" ? "0 0 24px rgba(248,81,73,0.5)" : item.correct ? "0 0 24px rgba(241,196,15,0.4)" : "0 4px 8px rgba(0,0,0,0.3)",
                      border: picked === "correct" ? "3px solid #3fb950" : picked === "wrong" ? "3px solid #f85149" : "2px solid rgba(255,255,255,0.2)",
                      transition: "all 0.15s",
                      transform: picked ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {picked === "correct" ? "✅" : picked === "wrong" ? "❌" : item.label}
                  </div>
                );
              })}
            </>
          )}

          {/* STAJYER — Quiz */}
          {gameType === "QUIZ" && quizData && (
            <div style={{ marginTop: 30, textAlign: "center", position: "relative" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#c9d1d9", marginBottom: 24, lineHeight: 1.6, padding: "0 10px" }}>
                {quizData.q}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 20px" }}>
                {quizData.opts.map((opt) => {
                  const isSelected = quizResult?.selected === opt;
                  const isCorrect = quizResult?.correct === opt;
                  const showResult = quizResult !== null;
                  const btnBg = showResult
                    ? isCorrect ? "rgba(63,185,80,0.25)" : isSelected ? "rgba(248,81,73,0.25)" : "#21262d"
                    : "#21262d";
                  const btnBorder = showResult
                    ? isCorrect ? "#3fb950" : isSelected ? "#f85149" : "#30363d"
                    : "#30363d";
                  const btnColor = showResult
                    ? isCorrect ? "#3fb950" : isSelected ? "#f85149" : "#484f58"
                    : "#c9d1d9";
                  return (
                    <button
                      key={opt}
                      onClick={() => handleQuizAnswer(opt)}
                      disabled={showResult}
                      style={{
                        padding: "14px 16px", background: btnBg, color: btnColor,
                        border: `2px solid ${btnBorder}`, borderRadius: 10,
                        cursor: showResult ? "default" : "pointer",
                        fontSize: 14, fontWeight: 600, transition: "all 0.3s",
                        position: "relative",
                        animation: showResult && isSelected && !quizResult.success ? "wrongShake 0.5s ease-out" : "none",
                        opacity: showResult && !isCorrect && !isSelected ? 0.4 : 1,
                      }}
                      onMouseEnter={(e) => { if (!showResult) { e.currentTarget.style.borderColor = "#58a6ff"; e.currentTarget.style.color = "#58a6ff"; }}}
                      onMouseLeave={(e) => { if (!showResult) { e.currentTarget.style.borderColor = "#30363d"; e.currentTarget.style.color = "#c9d1d9"; }}}
                    >
                      {showResult && isCorrect && <span style={{ marginRight: 6 }}>✅</span>}
                      {showResult && isSelected && !quizResult.success && <span style={{ marginRight: 6 }}>❌</span>}
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Sonuç overlay */}
              {quizResult && (
                <div style={{
                  position: "absolute", inset: "-10px 0px -20px 0px", borderRadius: 16,
                  background: quizResult.success ? "rgba(63,185,80,0.15)" : "rgba(248,81,73,0.15)",
                  border: `2px solid ${quizResult.success ? "#3fb950" : "#f85149"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: "fadeIn 0.3s ease-out",
                  pointerEvents: "none",
                }}>
                  <div style={{
                    background: quizResult.success ? "#238636" : "#da3633",
                    padding: "12px 28px", borderRadius: 12,
                    fontSize: 18, fontWeight: 900, color: "#fff",
                    boxShadow: `0 4px 20px ${quizResult.success ? "rgba(35,134,54,0.5)" : "rgba(218,54,51,0.5)"}`,
                    animation: "popIn 0.3s ease-out",
                  }}>
                    {quizResult.success ? "✅ Başarılı!" : "❌ Başarısız!"}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // GUN SONU
  // ==========================================
  const renderEndDay = () => {
    const stars = dayStats.perfect >= 2 ? 3 : dayStats.served >= 2 ? 2 : dayStats.served >= 1 ? 1 : 0;
    const diff = getDifficulty(day);
    const plantDiscount = ownedItems.includes("potted_plant") ? 1 : 0;
    const nextRent = Math.max(0, diff.rent - plantDiscount);
    const nextCustomers = 3 + Math.floor(day * 0.7);

    return (
      <div
        style={{
          position: "absolute", inset: 0, background: "linear-gradient(180deg, #0d1117, #161b22)",
          zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", color: "white", padding: 24,
          animation: "fadeIn 0.35s ease-out",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>🌙</div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Gün {day} Bitti</h1>
        <div style={{ fontSize: 11, color: GKT_HIERARCHY[playerRank].color, marginTop: 4 }}>
          {GKT_HIERARCHY[playerRank].icon} {GKT_HIERARCHY[playerRank].title}
        </div>

        {/* Yildiz rating */}
        <div style={{ margin: "16px 0", fontSize: 32 }}>
          {[1, 2, 3].map((s) => (
            <span key={s} style={{ color: s <= stars ? "#f1c40f" : "#21262d", margin: "0 4px", transition: "color 0.3s" }}>★</span>
          ))}
        </div>

        <div
          style={{
            background: "#21262d", padding: "16px 24px", borderRadius: 12,
            width: "85%", border: "1px solid #30363d", marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #30363d" }}>
            <span style={{ color: "#8b949e" }}>Ziyaretçi</span>
            <span style={{ fontWeight: 700 }}>{dayStats.served}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #30363d" }}>
            <span style={{ color: "#8b949e" }}>Kazanılan GP</span>
            <span style={{ fontWeight: 700, color: "#3fb950" }}>+{dayStats.earned} GP</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #30363d" }}>
            <span style={{ color: "#8b949e" }}>Mükemmel İş</span>
            <span style={{ fontWeight: 700, color: "#3fb950" }}>{dayStats.perfect}</span>
          </div>
          {ownedItems.includes("coffee_machine") && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #30363d" }}>
              <span style={{ color: "#8b949e" }}>☕ Kahve Bonusu</span>
              <span style={{ fontWeight: 700, color: "#3fb950" }}>+2 itibar</span>
            </div>
          )}
          {money < 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ color: "#f85149" }}>💸 Borç</span>
              <span style={{ fontWeight: 700, color: "#f85149" }}>{Math.floor(money)} GP</span>
            </div>
          )}
        </div>

        {/* Gider ozeti */}
        <div
          style={{
            background: "#1c1012", padding: "12px 24px", borderRadius: 12,
            width: "85%", border: "1px solid #f8514930", marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 11, color: "#f85149", fontWeight: 700, marginBottom: 6 }}>Yarınki Giderler</div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
            <span style={{ color: "#8b949e", fontSize: 12 }}>Operasyon Gideri</span>
            <span style={{ fontWeight: 700, color: "#f85149", fontSize: 12 }}>-{nextRent} GP</span>
          </div>
          {plantDiscount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
              <span style={{ color: "#3fb950", fontSize: 10 }}>🌿 Bitki İndirimi</span>
              <span style={{ fontWeight: 700, color: "#3fb950", fontSize: 10 }}>-{plantDiscount} GP</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: "1px solid #30363d", marginTop: 4 }}>
            <span style={{ color: "#8b949e", fontSize: 12 }}>Mevcut Bütçe</span>
            <span style={{ fontWeight: 700, color: money - nextRent < 50 ? "#f85149" : "#f1c40f", fontSize: 12 }}>{Math.floor(money)} GP</span>
          </div>
        </div>

        <button
          onClick={startNextDay}
          style={{
            padding: "14px 40px", fontSize: 16, fontWeight: 800,
            background: "#2ea043", color: "white",
            border: "3px solid #1b5e20", borderRadius: 12, cursor: "pointer",
            boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
            transition: "transform 0.1s, background 0.15s, box-shadow 0.15s",
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#238636"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; e.currentTarget.style.background = "#2ea043"; }}
        >
          Sonraki Gün ☀️
        </button>

        <div style={{ fontSize: 10, color: "#484f58", marginTop: 12 }}>
          Yarın {nextCustomers} ziyaretçi gelecek
        </div>
      </div>
    );
  };

  // ==========================================
  // SEÇİM (GENEL KURUL) EKRANI — Endgame
  // ==========================================
  const renderElection = () => {
    const playerScore = calculateCampaignScore(careerStats, reputation);

    return (
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #0a0a18, #1a1028, #0a0a18)",
          zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", color: "white", padding: 24,
          animation: "fadeIn 0.4s ease-out",
        }}
      >
        <div style={{ fontSize: 14, color: "#f1c40f", fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
          SON ADIM
        </div>
        <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 900, color: "#f59e0b" }}>
          Genel Kurul Seçimi
        </h1>
        <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 24 }}>
          YK Başkanlığı için oy zamanı!
        </div>

        {/* VS Kartları */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 24, width: "100%",
          justifyContent: "center",
        }}>
          {/* Oyuncu kartı */}
          <div style={{
            flex: 1, maxWidth: 160, background: "linear-gradient(135deg, #0d2818, #1a3a2a)",
            borderRadius: 16, padding: "16px 12px", textAlign: "center",
            border: "2px solid rgba(63,185,80,0.4)",
            boxShadow: "0 0 20px rgba(63,185,80,0.1)",
          }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>💎</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#3fb950", marginBottom: 8 }}>SEN</div>
            <div style={{ fontSize: 10, color: "#8b949e", lineHeight: 1.6 }}>
              <div>⭐ {reputation} itibar</div>
              <div>💰 {careerStats.totalEarned} GP kazanç</div>
              <div>🏆 {careerStats.sRankCount} S Rank</div>
              <div>🔥 {careerStats.bestStreak} en iyi seri</div>
              <div>📅 {careerStats.activeDays} aktif gün</div>
              <div>💯 {careerStats.noFailDays} hatasız gün</div>
            </div>
            <div style={{
              marginTop: 10, fontSize: 20, fontWeight: 900, color: "#3fb950",
              textShadow: "0 0 10px rgba(63,185,80,0.5)",
            }}>
              {playerScore}
            </div>
            <div style={{ fontSize: 9, color: "#8b949e" }}>PUAN</div>
          </div>

          <div style={{
            fontSize: 24, fontWeight: 900, color: "#f59e0b",
            textShadow: "0 0 20px rgba(245,158,11,0.5)",
          }}>
            VS
          </div>

          {/* Rakip kartı */}
          {rivalData && (
            <div style={{
              flex: 1, maxWidth: 160, background: "linear-gradient(135deg, #2a0d0d, #3a1a1a)",
              borderRadius: 16, padding: "16px 12px", textAlign: "center",
              border: "2px solid rgba(248,81,73,0.4)",
              boxShadow: "0 0 20px rgba(248,81,73,0.1)",
            }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>🎭</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#f85149", marginBottom: 8 }}>
                {rivalData.name}
              </div>
              <div style={{ fontSize: 10, color: "#8b949e", lineHeight: 1.6 }}>
                <div>⭐ {rivalData.reputation} itibar</div>
                <div>💰 {rivalData.totalEarned} GP kazanç</div>
                <div>🏆 {rivalData.perfectJobs} S Rank</div>
                <div>🔥 {rivalData.bestStreak} en iyi seri</div>
              </div>
              <div style={{
                marginTop: 10, fontSize: 20, fontWeight: 900, color: "#f85149",
                textShadow: "0 0 10px rgba(248,81,73,0.5)",
              }}>
                {rivalData.score}
              </div>
              <div style={{ fontSize: 9, color: "#8b949e" }}>PUAN</div>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            const score = calculateCampaignScore(careerStats, reputation);
            handleElectionResult(score >= (rivalData?.score || 0));
          }}
          style={{
            padding: "16px 48px", fontSize: 18, fontWeight: 900,
            background: "#f59e0b", color: "#000",
            border: "3px solid #b45309", borderRadius: 14, cursor: "pointer",
            boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
            letterSpacing: 0.5, marginBottom: 12,
            transition: "transform 0.1s, background 0.15s, box-shadow 0.15s",
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#d97706"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; e.currentTarget.style.background = "#f59e0b"; }}
        >
          🗳️ Aday Ol
        </button>
        <div style={{ fontSize: 10, color: "#484f58" }}>
          Puanın rakibinden yüksekse YK Başkanı olursun!
        </div>
      </div>
    );
  };

  // ==========================================
  // SEÇİM SONUCU
  // ==========================================
  const renderElectionResult = () => {
    const won = electionResult === "win";

    return (
      <div
        style={{
          position: "absolute", inset: 0,
          background: won
            ? "linear-gradient(180deg, #0a1a0d, #0d2818, #0a1a0d)"
            : "linear-gradient(180deg, #1a0a0a, #2a0d0d, #1a0a0a)",
          zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", color: "white", padding: 24,
          animation: "fadeIn 0.4s ease-out",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16, animation: "popIn 0.5s ease-out" }}>
          {won ? "👑" : "😔"}
        </div>
        <h1 style={{
          margin: "0 0 8px", fontSize: 28, fontWeight: 900,
          color: won ? "#f1c40f" : "#f85149",
          textShadow: won ? "0 0 30px rgba(241,196,15,0.5)" : "0 0 20px rgba(248,81,73,0.4)",
        }}>
          {won ? "YK Başkanı Seçildin!" : "Seçimi Kaybettin"}
        </h1>
        <p style={{ fontSize: 14, color: "#8b949e", textAlign: "center", lineHeight: 1.6, marginBottom: 8, maxWidth: 300 }}>
          {won
            ? "GKT Girişimcilik ve Kariyer Topluluğu'nun yeni başkanı olarak topluluğu zirveye taşıyacaksın!"
            : `Rakibin ${rivalData?.name || "rakip"} daha fazla destek topladı. İtibarını artırıp tekrar dene!`
          }
        </p>

        {/* Kariyer özeti */}
        <div style={{
          background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 20px",
          width: "80%", maxWidth: 300, border: "1px solid #30363d", marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8b949e", marginBottom: 8, textAlign: "center" }}>
            Kariyer Özeti
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "4px 0", borderBottom: "1px solid #21262d" }}>
            <span style={{ color: "#8b949e" }}>Toplam Gün</span>
            <span style={{ fontWeight: 700 }}>{day}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "4px 0", borderBottom: "1px solid #21262d" }}>
            <span style={{ color: "#8b949e" }}>Toplam İş</span>
            <span style={{ fontWeight: 700 }}>{careerStats.totalJobs}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "4px 0", borderBottom: "1px solid #21262d" }}>
            <span style={{ color: "#8b949e" }}>S Rank</span>
            <span style={{ fontWeight: 700, color: "#f1c40f" }}>{careerStats.sRankCount}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "4px 0", borderBottom: "1px solid #21262d" }}>
            <span style={{ color: "#8b949e" }}>Toplam Kazanç</span>
            <span style={{ fontWeight: 700, color: "#f1c40f" }}>{careerStats.totalEarned} GP</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "4px 0" }}>
            <span style={{ color: "#8b949e" }}>En İyi Seri</span>
            <span style={{ fontWeight: 700, color: "#f0883e" }}>🔥 {careerStats.bestStreak}</span>
          </div>
        </div>

        {won && (
          <div style={{
            background: "rgba(241,196,15,0.1)", border: "1px solid rgba(241,196,15,0.3)",
            borderRadius: 10, padding: "8px 16px", marginBottom: 16,
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#f1c40f" }}>
              💰 +{GKT_HIERARCHY[6].gpBonus} GP Başkanlık Bonusu
            </span>
          </div>
        )}

        <button
          onClick={() => {
            if (won) {
              // Oyunu kazandı — ana menüye dön
              setScene("MENU");
            } else {
              // Kaybetti — ofise dön, devam et
              setShowElection(false);
              setElectionResult(null);
              setRivalData(null);
              setIsDayStarted(false);
              setScene("DESK_VIEW");
            }
          }}
          style={{
            padding: "14px 40px", fontSize: 16, fontWeight: 800,
            background: won ? "#f1c40f" : "#2ea043",
            color: won ? "#000" : "white",
            border: won ? "3px solid #b7950b" : "3px solid #1b5e20",
            borderRadius: 12, cursor: "pointer",
            boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
            transition: "transform 0.1s, background 0.15s, box-shadow 0.15s",
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; }}
        >
          {won ? "🎬 Bitir" : "Devam Et — İtibar Kazan"}
        </button>
      </div>
    );
  };

  // ==========================================
  // AYARLAR PANELI
  // ==========================================
  const updateSetting = (key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("gkt_settings", JSON.stringify(next));
      return next;
    });
  };

  const renderSettings = () => {
    const toggleStyle = (enabled) => ({
      width: 48, height: 26, borderRadius: 13, cursor: "pointer",
      border: enabled ? "2px solid #2d7a3a" : "2px solid #555",
      background: enabled ? "#4caf50" : "#555",
      position: "relative", transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    });
    const toggleKnob = (enabled) => ({
      width: 18, height: 18, borderRadius: "50%",
      background: "#fff",
      position: "absolute", top: 2,
      left: enabled ? 24 : 2,
      transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    });
    const settingRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" };
    const settingDivider = { ...settingRow, borderBottom: "2px solid rgba(139,69,69,0.2)" };

    return (
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 600,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setShowSettings(false); }}
      >
        <div
          style={{
            background: "#1a0808",
            borderRadius: 18, padding: 22, width: "85%", maxWidth: 360,
            border: "3px solid #8b2020",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
              Ayarlar
            </h2>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: MENU_BTN_BG, border: "2px solid #a93226", color: "#fff",
                borderRadius: "50%", width: 30, height: 30, cursor: "pointer",
                fontSize: 14, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              ✕
            </button>
          </div>

          {/* Ses Efektleri */}
          <div style={settingDivider}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Ses Efektleri</div>
              <div style={{ fontSize: 10, color: "#a88", marginTop: 1 }}>Oyun içi ses efektleri</div>
            </div>
            <button onClick={() => updateSetting("sfxEnabled", !settings.sfxEnabled)} style={toggleStyle(settings.sfxEnabled)}>
              <div style={toggleKnob(settings.sfxEnabled)} />
            </button>
          </div>

          {/* Muzik */}
          <div style={settingDivider}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Müzik</div>
              <div style={{ fontSize: 10, color: "#a88", marginTop: 1 }}>Arka plan müziği</div>
            </div>
            <button onClick={() => updateSetting("musicEnabled", !settings.musicEnabled)} style={toggleStyle(settings.musicEnabled)}>
              <div style={toggleKnob(settings.musicEnabled)} />
            </button>
          </div>

          {/* Zamanlayici */}
          <div style={settingDivider}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Zamanlayıcı</div>
              <div style={{ fontSize: 10, color: "#a88", marginTop: 1 }}>Mini oyunlarda süre göster</div>
            </div>
            <button onClick={() => updateSetting("showTimer", !settings.showTimer)} style={toggleStyle(settings.showTimer)}>
              <div style={toggleKnob(settings.showTimer)} />
            </button>
          </div>

          {/* Verileri Sifirla */}
          <div style={{ ...settingRow, marginTop: 4 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Verileri Sıfırla</div>
              <div style={{ fontSize: 10, color: "#a88", marginTop: 1 }}>Kişisel en iyileri temizle</div>
            </div>
            <button
              onClick={() => {
                const fresh = { maxMoney: 0, maxDay: 0, totalPerfect: 0, allItemsDay: null };
                setPersonalBest(fresh);
                localStorage.setItem("gkt_personal_best", JSON.stringify(fresh));
              }}
              style={{
                background: MENU_BTN_BG, border: "2px solid #a93226",
                color: "#fff", borderRadius: 10, padding: "5px 14px", cursor: "pointer",
                fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "transform 0.1s, background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = MENU_BTN_BG_HOVER; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = MENU_BTN_BG; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              Sıfırla
            </button>
          </div>

          <div style={{ marginTop: 14, fontSize: 9, color: "#5c3030", textAlign: "center" }}>
            v1.0 · GKT Ofis Simülatörü
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // OYUN ICI MENU (Hamburger)
  // ==========================================
  const renderInGameMenu = () => {
    const igBtnBase = {
      width: "100%", padding: "10px 20px", borderRadius: 14, cursor: "pointer",
      fontWeight: 900, fontSize: 14, letterSpacing: 1, textTransform: "uppercase",
      color: "#fff",
      transition: "transform 0.1s, background 0.15s, border-color 0.15s, box-shadow 0.15s",
    };
    const igBtnDown = (e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)"; };
    const igBtnUp = (e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; };

    return (
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 550,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setShowInGameMenu(false); }}
      >
        <div
          style={{
            background: "#1a0808",
            borderRadius: 18, padding: 24, width: "75%", maxWidth: 300,
            border: "3px solid #8b2020",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: "#c9a0a0", letterSpacing: 2, marginBottom: 2, textTransform: "uppercase" }}>
            Oyun Menüsü
          </div>

          {/* Devam Et — yeşil */}
          <button
            onClick={() => setShowInGameMenu(false)}
            style={{ ...igBtnBase, background: "#4caf50", border: "3px solid #2e7d32", boxShadow: "0 3px 10px rgba(0,0,0,0.25)" }}
            onMouseDown={igBtnDown} onMouseUp={igBtnUp}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#388e3c"; e.currentTarget.style.borderColor = "#1b5e20"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; e.currentTarget.style.background = "#4caf50"; e.currentTarget.style.borderColor = "#2e7d32"; }}
          >
            Devam Et
          </button>

          {/* Ayarlar — gri */}
          <button
            onClick={() => setShowSettings(true)}
            style={{ ...igBtnBase, background: "#666", border: "3px solid #444", boxShadow: "0 3px 10px rgba(0,0,0,0.25)" }}
            onMouseDown={igBtnDown} onMouseUp={igBtnUp}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#555"; e.currentTarget.style.borderColor = "#333"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; e.currentTarget.style.background = "#666"; e.currentTarget.style.borderColor = "#444"; }}
          >
            Ayarlar
          </button>

          {/* Çıkış — kırmızı */}
          <button
            onClick={() => {
              setShowInGameMenu(false);
              setScene("MENU");
              setCustomer(null);
              setDialogue(null);
              setGameType(null);
              setFeedback(null);
              setForcedGameType(null);
            }}
            style={{ ...igBtnBase, background: "#e74c3c", border: "3px solid #a93226", boxShadow: "0 3px 10px rgba(0,0,0,0.25)" }}
            onMouseDown={igBtnDown} onMouseUp={igBtnUp}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#c0392b"; e.currentTarget.style.borderColor = "#922b21"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; e.currentTarget.style.background = "#e74c3c"; e.currentTarget.style.borderColor = "#a93226"; }}
          >
            Çıkış
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // MENU
  // ==========================================
  const handleLogoTap = () => {
    const newCount = debugTapCount + 1;
    setDebugTapCount(newCount);
    if (debugTapTimer.current) clearTimeout(debugTapTimer.current);
    debugTapTimer.current = setTimeout(() => setDebugTapCount(0), 3000);
  };

  // Ortak menü buton stili — 2D cartoon
  const MENU_BTN_BG = "#e74c3c";
  const MENU_BTN_BG_HOVER = "#c0392b";
  const menuBtnStyle = {
    width: "85%", margin: "0 auto", padding: "7px 14px", borderRadius: 14, cursor: "pointer",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    fontWeight: 900, fontSize: 13, letterSpacing: 1, textTransform: "uppercase",
    color: "#fff",
    background: MENU_BTN_BG,
    border: "3px solid #a93226",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
    transition: "transform 0.1s, background 0.15s, border-color 0.15s, box-shadow 0.15s",
  };
  const menuBtnDown = (e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)"; };
  const menuBtnUp = (e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; };
  const menuBtnEnter = (e) => { e.currentTarget.style.background = MENU_BTN_BG_HOVER; e.currentTarget.style.borderColor = "#922b21"; };
  const menuBtnLeave = (e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; e.currentTarget.style.background = MENU_BTN_BG; e.currentTarget.style.borderColor = "#a93226"; };

  const renderMenu = () => (
    <div
      style={{
        position: "absolute", inset: 0,
        background: "url('/assets/office/bg.png') center/cover",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      {/* Dark overlay + blur */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
      }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", width: "100%", maxWidth: 320 }}>

        {/* Logo + Title row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
          animation: "menuItemIn 0.4s ease-out both",
        }}>
          <img
            src="/assets/logo_gkt.png"
            alt="GKT Logo"
            onClick={handleLogoTap}
            style={{
              width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
              objectFit: "contain", cursor: "pointer",
              filter: "drop-shadow(0 4px 12px rgba(231,76,60,0.5))",
              animation: "logoFloat 3s ease-in-out infinite alternate",
              border: "3px solid rgba(231,76,60,0.3)",
            }}
          />
          <h1 style={{
            fontSize: 28, fontWeight: 900, color: "#fff", margin: 0,
            letterSpacing: -0.5,
            textShadow: "0 2px 8px rgba(231,76,60,0.5), 0 4px 20px rgba(231,76,60,0.2)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}>
            Ofis Simülatörü
          </h1>
        </div>

        {/* Subtitles */}
        <div style={{ marginTop: 6, animation: "menuItemIn 0.4s ease-out 0.1s both" }}>
          <div style={{ fontSize: 12, color: "#e74c3c", fontWeight: 700, letterSpacing: 2 }}>
            Akdeniz Üniversitesi
          </div>
          <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>
            Girişimcilik ve Kariyer Topluluğu
          </div>
        </div>

        {/* Butonlar */}
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 7, width: "100%" }}>

          {/* Devam Et (sadece kayıt varsa) */}
          {saveInfo && (
            <button
              onClick={() => loadGame()}
              style={{ ...menuBtnStyle, textAlign: "center", animation: "menuItemIn 0.4s ease-out 0.2s both" }}
              onMouseDown={menuBtnDown} onMouseUp={menuBtnUp}
              onMouseEnter={menuBtnEnter} onMouseLeave={menuBtnLeave}
            >
              <div>DEVAM ET</div>
              <div style={{ fontSize: 8, fontWeight: 600, opacity: 0.75, marginTop: 1, textTransform: "none", letterSpacing: 0 }}>
                Gün {saveInfo.day} · {saveInfo.deptName} · {timeAgo(saveInfo.savedAt)}
              </div>
            </button>
          )}

          {/* Yeni Oyun / Oyna */}
          <button
            onClick={() => { if (saveInfo) { setShowNewGameConfirm(true); } else { setScene("DEPT_SELECT"); } }}
            style={{ ...menuBtnStyle, animation: "menuItemIn 0.4s ease-out 0.3s both" }}
            onMouseDown={menuBtnDown} onMouseUp={menuBtnUp}
            onMouseEnter={menuBtnEnter} onMouseLeave={menuBtnLeave}
          >
            {saveInfo ? "YENİ OYUN" : "OYNA"}
          </button>

          {/* Kariyer Dosyam */}
          <button
            onClick={() => alert("Kariyer sayfası yakında eklenecek!")}
            style={{ ...menuBtnStyle, animation: "menuItemIn 0.4s ease-out 0.4s both" }}
            onMouseDown={menuBtnDown} onMouseUp={menuBtnUp}
            onMouseEnter={menuBtnEnter} onMouseLeave={menuBtnLeave}
          >
            Kariyer Dosyam
          </button>

          {/* Nasıl Oynanır */}
          <button
            onClick={() => alert("Rehber yakında eklenecek!")}
            style={{ ...menuBtnStyle, animation: "menuItemIn 0.4s ease-out 0.5s both" }}
            onMouseDown={menuBtnDown} onMouseUp={menuBtnUp}
            onMouseEnter={menuBtnEnter} onMouseLeave={menuBtnLeave}
          >
            Nasıl Oynanır?
          </button>

          {/* Ayarlar */}
          <button
            onClick={() => setShowSettings(true)}
            style={{ ...menuBtnStyle, animation: "menuItemIn 0.4s ease-out 0.6s both" }}
            onMouseDown={menuBtnDown} onMouseUp={menuBtnUp}
            onMouseEnter={menuBtnEnter} onMouseLeave={menuBtnLeave}
          >
            Ayarlar
          </button>

          {/* Debug Mode — sarı şeritli özel buton */}
          <button
            onClick={() => setScene("DEBUG_DEPT_SELECT")}
            style={{
              width: "85%", margin: "0 auto", padding: "7px 14px", borderRadius: 14, cursor: "pointer",
              fontFamily: "'Segoe UI', system-ui, sans-serif",
              fontWeight: 900, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
              color: "#4a3800",
              background: "repeating-linear-gradient(135deg, #f59e0b 0px, #f59e0b 8px, #d97706 8px, #d97706 16px)",
              border: "3px solid #92400e",
              boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
              transition: "transform 0.1s, background 0.15s, border-color 0.15s, box-shadow 0.15s",
              animation: "menuItemIn 0.4s ease-out 0.7s both",
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "repeating-linear-gradient(135deg, #b57a08 0px, #b57a08 8px, #9a5504 8px, #9a5504 16px)"; e.currentTarget.style.borderColor = "#5c2806"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25)"; e.currentTarget.style.background = "repeating-linear-gradient(135deg, #f59e0b 0px, #f59e0b 8px, #d97706 8px, #d97706 16px)"; e.currentTarget.style.borderColor = "#92400e"; }}
          >
            DEBUG MODE
          </button>
        </div>

        {/* Personal Best Card */}
        {personalBest.maxDay > 0 && (
          <div style={{
            marginTop: 14, background: "rgba(0,0,0,0.4)", borderRadius: 12,
            padding: "8px 14px", border: "2px solid rgba(231,76,60,0.25)", width: "100%",
            animation: "menuItemIn 0.4s ease-out 0.8s both",
          }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 11, color: "#c9d1d9" }}>
              <span>💰 <b style={{ color: "#f1c40f" }}>{personalBest.maxMoney}</b> GP</span>
              <span>📅 Gün <b style={{ color: "#58a6ff" }}>{personalBest.maxDay}</b></span>
              <span>⭐ <b style={{ color: "#3fb950" }}>{personalBest.totalPerfect}</b></span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 16, animation: "menuItemIn 0.4s ease-out 0.9s both" }}>
          <div style={{ fontSize: 10, color: "#5c5c5c" }}>v1.0</div>
          <div style={{ fontSize: 9, color: "#444", marginTop: 2 }}>developed by Yiğit Kasap (Novament Games)</div>
        </div>
      </div>

      {/* Yeni Oyun Onay Popup */}
      {showNewGameConfirm && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#161b22", borderRadius: 16, padding: 24,
            border: "1px solid #30363d", width: 280, textAlign: "center",
            animation: "popIn 0.25s ease-out",
          }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              Mevcut Kayıt Silinecek
            </div>
            <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 20, lineHeight: 1.5 }}>
              Gün {saveInfo?.day} kaydın var. Yeni oyun başlatırsan bu kayıt silinecek.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowNewGameConfirm(false)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10,
                  border: "2px solid #555", background: "#444",
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  transition: "transform 0.1s, background 0.15s",
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#444"; }}
              >
                İptal
              </button>
              <button
                onClick={() => {
                  deleteSaveData();
                  setShowNewGameConfirm(false);
                  setSaveInfo(null);
                  setScene("DEPT_SELECT");
                }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10,
                  border: "2px solid #a93226",
                  background: "#e74c3c",
                  color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer",
                  transition: "transform 0.1s, background 0.15s",
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#c0392b"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#e74c3c"; }}
              >
                Yeni Oyun Başlat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ==========================================
  // DEPARTMAN SECIM
  // ==========================================
  const renderDeptSelect = () => (
    <div
      style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #0d1117, #161b22)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: 20, overflowY: "auto",
      }}
    >
      {/* Geri butonu */}
      <button
        onClick={() => setScene("MENU")}
        style={{
          position: "absolute", top: 16, left: 16, background: "none", border: "none",
          color: "#8b949e", fontSize: 13, cursor: "pointer", fontWeight: 600,
          display: "flex", alignItems: "center", gap: 4,
        }}
      >
        ← Geri
      </button>

      <img
        src="/assets/logo_gkt.png"
        alt="GKT Logo"
        style={{
          width: 60, height: 60, borderRadius: 14, marginTop: 40, marginBottom: 8,
          objectFit: "contain",
          filter: "drop-shadow(0 4px 16px rgba(231,76,60,0.3))",
        }}
      />
      <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0, textAlign: "center" }}>
        Departmanını Seç
      </h2>
      <p style={{ fontSize: 11, color: "#8b949e", marginTop: 6, marginBottom: 20, textAlign: "center" }}>
        Her departmanın kendine özel görevleri ve mini-oyunları var
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 420 }}>
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            onClick={() => dept.available && handleDeptSelect(dept)}
            onMouseEnter={(e) => {
              if (!dept.available) return;
              e.currentTarget.style.borderColor = dept.color;
              e.currentTarget.style.boxShadow = `0 0 16px ${dept.color}50, 0 0 32px ${dept.color}20`;
              e.currentTarget.style.background = `${dept.color}10`;
            }}
            onMouseLeave={(e) => {
              if (!dept.available) return;
              e.currentTarget.style.borderColor = dept.color + "40";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "#161b22";
            }}
            style={{
              background: dept.available ? "#161b22" : "#0d1117",
              border: `2px solid ${dept.available ? dept.color + "40" : "#21262d"}`,
              borderRadius: 14, padding: "16px 18px", cursor: dept.available ? "pointer" : "not-allowed",
              opacity: dept.available ? 1 : 0.45, transition: "all 0.25s ease-out",
              display: "flex", alignItems: "center", gap: 14,
            }}
          >
            <div
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: dept.available ? `${dept.color}20` : "#21262d",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}
            >
              {dept.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: dept.available ? dept.color : "#484f58" }}>
                {dept.name}
              </div>
              <div style={{ fontSize: 10, color: dept.available ? "#8b949e" : "#484f58", fontWeight: 600, marginTop: 3 }}>
                {dept.skills}
              </div>
            </div>
            {!dept.available && (
              <div style={{ background: "#21262d", color: "#484f58", padding: "2px 6px", borderRadius: 4, fontSize: 8, fontWeight: 700, flexShrink: 0 }}>
                🔒
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // DEBUG DEPARTMAN SECIM
  // ==========================================
  const renderDebugDeptSelect = () => (
    <div
      style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #1a0f00, #261a00)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: 20, overflowY: "auto",
      }}
    >
      <button
        onClick={() => setScene("MENU")}
        style={{
          position: "absolute", top: 16, left: 16, background: "none", border: "none",
          color: "#f59e0b", fontSize: 13, cursor: "pointer", fontWeight: 600,
        }}
      >
        ← Menü
      </button>

      <div style={{ marginTop: 50, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: 2, marginBottom: 4 }}>
          🛠️ DEBUG MODE
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}>
          Departman Seç
        </h2>
        <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>Test için departman seç</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 340 }}>
        {DEPARTMENTS.filter(d => d.available).map((dept) => (
          <button
            key={dept.id}
            onClick={() => handleDebugDeptSelect(dept)}
            style={{
              padding: "16px 18px", borderRadius: 12,
              background: "rgba(245,158,11,0.08)",
              border: "2px solid rgba(245,158,11,0.3)",
              color: "#fff", textAlign: "left",
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.background = "rgba(245,158,11,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.background = "rgba(245,158,11,0.08)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{dept.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{dept.name}</div>
                <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>{dept.skills}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // DEBUG OYUN SECIM
  // ==========================================
  const DEBUG_GAMES = [
    { type: "BUG_FIX", label: "Bug Fix", icon: "🐛", desc: "Bug bulup tıklama" },
    { type: "DESIGN_CLICK", label: "Logo Tasarım", icon: "🎨", desc: "Öğe tıklayarak düzenleme" },
    { type: "QUIZ", label: "Quiz", icon: "📝", desc: "Bilgi yarışması" },
    { type: "DRAG_DROP", label: "Süreci Sırala", icon: "📋", desc: "Sürükle-bırak sıralama" },
    { type: "MEMORY_MATCH", label: "Hafıza Eşleştirme", icon: "🧠", desc: "Kart eşleştirme" },
    { type: "WIRE_CONNECT", label: "Kablo Bağlama", icon: "🔌", desc: "Among Us tarzı kablo" },
    { type: "SORT_FILES", label: "Dosya Sıralama", icon: "📂", desc: "Sayıları sıraya koy" },
    { type: "ALIGN_LOGO", label: "Logo Hizalama", icon: "🎯", desc: "Logoyu ortala" },
    { type: "SPAM_CLEANUP", label: "Spam Temizliği", icon: "📧", desc: "Köstebek vurmaca — spam temizle" },
    { type: "AC_ADJUST", label: "Klima Ayarla", icon: "❄️", desc: "Among Us tarzı klima ayarla" },
  ];

  const renderDebugGameSelect = () => (
    <div
      style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #1a0f00, #261a00)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: 20, overflowY: "auto",
      }}
    >
      <button
        onClick={() => setScene("DEBUG_DEPT_SELECT")}
        style={{
          position: "absolute", top: 16, left: 16, background: "none", border: "none",
          color: "#f59e0b", fontSize: 13, cursor: "pointer", fontWeight: 600,
        }}
      >
        ← Geri
      </button>

      <div style={{ marginTop: 50, marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: 2, marginBottom: 4 }}>
          🛠️ DEBUG MODE
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}>
          Mini-Oyun Seç
        </h2>
        <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>Karakter ve oyun seç</div>
      </div>

      {/* Karakter Secici */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, width: "100%", maxWidth: 340, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => setForcedCharacter(null)}
          style={{
            padding: "8px 14px", borderRadius: 10,
            background: !forcedCharacter ? "rgba(245,158,11,0.25)" : "rgba(245,158,11,0.06)",
            border: `2px solid ${!forcedCharacter ? "#f59e0b" : "rgba(245,158,11,0.2)"}`,
            color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          🎲 Rastgele
        </button>
        {CHARACTERS.map((ch) => (
          <button
            key={ch.displayName}
            onClick={() => setForcedCharacter(ch)}
            style={{
              padding: "6px 10px", borderRadius: 10,
              background: forcedCharacter?.displayName === ch.displayName ? "rgba(245,158,11,0.25)" : "rgba(245,158,11,0.06)",
              border: `2px solid ${forcedCharacter?.displayName === ch.displayName ? "#f59e0b" : "rgba(245,158,11,0.2)"}`,
              color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <img src={ch.sprite} alt={ch.displayName} style={{ width: 24, height: 24, borderRadius: 6, objectFit: "cover", objectPosition: "top" }} />
            {ch.displayName}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 340 }}>
        {DEBUG_GAMES.map((g) => (
          <button
            key={g.type}
            onClick={() => handleDebugGameSelect(g.type)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 16px", borderRadius: 12,
              background: "rgba(245,158,11,0.06)",
              border: "2px solid rgba(245,158,11,0.2)",
              color: "#fff", textAlign: "left",
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.background = "rgba(245,158,11,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)"; e.currentTarget.style.background = "rgba(245,158,11,0.06)"; }}
          >
            <span style={{ fontSize: 26, width: 36, textAlign: "center" }}>{g.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{g.label}</div>
              <div style={{ fontSize: 10, color: "#8b949e", marginTop: 1 }}>{g.desc}</div>
            </div>
            <span style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, fontFamily: "monospace" }}>{g.type}</span>
          </button>
        ))}
      </div>

      {/* Seçim Testi */}
      <div style={{ marginTop: 20, width: "100%", maxWidth: 340 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: 1, marginBottom: 8, textAlign: "center" }}>
          🗳️ SEÇİM TESTİ
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              setPlayerRank(5); // Başkan Yardımcısı olarak simüle et
              setReputation(250);
              const rival = generateRival(50, 4, { reputation: 10, totalEarned: 100, perfectJobs: 2, bestStreak: 2 });
              setRivalData(rival);
              setShowElection(true);
              setScene("ELECTION");
            }}
            style={{
              flex: 1, padding: "12px 14px", borderRadius: 12,
              background: "rgba(63,185,80,0.1)", border: "2px solid rgba(63,185,80,0.3)",
              color: "#3fb950", cursor: "pointer", fontSize: 12, fontWeight: 800,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3fb950"; e.currentTarget.style.background = "rgba(63,185,80,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(63,185,80,0.3)"; e.currentTarget.style.background = "rgba(63,185,80,0.1)"; }}
          >
            🏆 Kolay Rakip
          </button>
          <button
            onClick={() => {
              setPlayerRank(5);
              setReputation(250);
              const rival = generateRival(500, 4, { reputation: 50, totalEarned: 800, perfectJobs: 8, bestStreak: 6 });
              setRivalData(rival);
              setShowElection(true);
              setScene("ELECTION");
            }}
            style={{
              flex: 1, padding: "12px 14px", borderRadius: 12,
              background: "rgba(248,81,73,0.1)", border: "2px solid rgba(248,81,73,0.3)",
              color: "#f85149", cursor: "pointer", fontSize: 12, fontWeight: 800,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f85149"; e.currentTarget.style.background = "rgba(248,81,73,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(248,81,73,0.3)"; e.currentTarget.style.background = "rgba(248,81,73,0.1)"; }}
          >
            💀 Zor Rakip
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 16, padding: "8px 12px", borderRadius: 8,
        background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
        fontSize: 10, color: "#8b949e", textAlign: "center", maxWidth: 340, width: "100%",
      }}>
        💡 Seçtiğin oyun sürekli tekrar edecek. Normal moda dönmek için menüye git.
      </div>
    </div>
  );

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div
      style={{
        width: GAME_WIDTH, height: GAME_HEIGHT,
        position: "relative", overflow: "hidden", background: "#0d1117",
        fontFamily: "'Segoe UI', system-ui, sans-serif", userSelect: "none",
      }}
    >
      {scene === "MENU" && renderMenu()}
      {scene === "DEPT_SELECT" && renderDeptSelect()}
      {scene === "DEBUG_DEPT_SELECT" && renderDebugDeptSelect()}
      {scene === "DEBUG_GAME_SELECT" && renderDebugGameSelect()}
      {scene === "DESK_VIEW" && renderDeskView()}
      {scene === "PC_VIEW" && renderPcView()}
      {scene === "END_DAY" && renderEndDay()}
      {scene === "ELECTION" && renderElection()}
      {scene === "ELECTION_RESULT" && renderElectionResult()}
      {showShop && (
        <ShopMenu
          money={money}
          ownedItems={ownedItems}
          onBuy={handleBuyItem}
          onClose={() => setShowShop(false)}
        />
      )}
      {showInGameMenu && renderInGameMenu()}
      {showSettings && renderSettings()}
      {showPromotion && (
        <PromotionOverlay
          data={showPromotion}
          onClose={() => {
            setShowPromotion(null);
            // Kademe 1 ise ve takım seçilmediyse → direktörlük seçimi göster
            if (playerRank === 1 && !selectedTeam) {
              setShowDirectorChoice(true);
            }
          }}
        />
      )}
      {showDirectorChoice && selectedDept && (
        <DirectorChoicePopup
          deptId={selectedDept.id}
          onSelect={(team) => {
            setSelectedTeam(team);
            setShowDirectorChoice(false);
          }}
        />
      )}
      {/* Save Toast */}
      {showSaveToast && (
        <div style={{
          position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#238636", color: "#fff", padding: "8px 20px", borderRadius: 20,
          fontSize: 13, fontWeight: 700, zIndex: 999,
          animation: "saveToastIn 0.2s ease-out",
          pointerEvents: "none",
        }}>
          Kaydedildi
        </div>
      )}
      <style>{`
        @keyframes slideIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes characterIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes characterOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(30px); } }
        @keyframes breathe { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.006); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes popIn { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes feedbackPopIn {
          0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes twinkle { from { opacity: 0.05; } to { opacity: 0.4; } }
        @keyframes cursorBlink { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.9); } }
        @keyframes happyJump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes flyToVault {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(150px, -300px) scale(0.5); opacity: 0; }
        }
        @keyframes sparkleAnim {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
        }
        @keyframes angerPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(1); opacity: 0.95; }
        }
        @keyframes sadShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes menuItemIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoFloat {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }
        @keyframes saveToastIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes saveToastOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }

        *::-webkit-scrollbar { width: 6px; }
        *::-webkit-scrollbar-track { background: rgba(30,30,30,0.4); border-radius: 3px; }
        *::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.4); border-radius: 3px; }
        *::-webkit-scrollbar-thumb:hover { background: rgba(245,158,11,0.7); }
        * { scrollbar-width: thin; scrollbar-color: rgba(245,158,11,0.4) rgba(30,30,30,0.4); }
      `}</style>
    </div>
  );
}
