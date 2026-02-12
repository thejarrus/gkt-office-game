import { useState, useEffect, useCallback, useMemo } from "react";

// ============================================
// GAME CONSTANTS & DATA
// ============================================

const SAVE_KEY = "office-sim-save";
const PRESTIGE_KEY = "office-sim-prestige";
const GAME_W = 480;
const GAME_H = 700;

const OFFICE_ITEMS_DATA = {
  desk: { name: "Masa", cost: 50, emoji: "🪑", bonus: { type: "capacity", val: 1 }, pos: { x: 60, y: 340 }, w: 80, h: 50 },
  whiteboard: { name: "Whiteboard", cost: 120, emoji: "📋", bonus: { type: "quality", val: 10 }, pos: { x: 350, y: 180 }, w: 70, h: 50 },
  coffee: { name: "Kahve Makinesi", cost: 200, emoji: "☕", bonus: { type: "happiness", val: 15 }, pos: { x: 410, y: 320 }, w: 40, h: 50 },
  projector: { name: "Projeksiyon", cost: 350, emoji: "📽️", bonus: { type: "quality", val: 25 }, pos: { x: 200, y: 140 }, w: 60, h: 30 },
  beanbag: { name: "Bean Bag", cost: 80, emoji: "🛋️", bonus: { type: "happiness", val: 8 }, pos: { x: 30, y: 430 }, w: 55, h: 45 },
  monitor: { name: "Dev Monitör", cost: 500, emoji: "🖥️", bonus: { type: "productivity", val: 20 }, pos: { x: 160, y: 320 }, w: 50, h: 40 },
  bookshelf: { name: "Kitaplık", cost: 150, emoji: "📚", bonus: { type: "prestige", val: 5 }, pos: { x: 430, y: 180 }, w: 40, h: 70 },
  plant: { name: "Saksı Bitki", cost: 30, emoji: "🪴", bonus: { type: "happiness", val: 5 }, pos: { x: 10, y: 200 }, w: 35, h: 45 },
  rgb: { name: "RGB Işıklar", cost: 180, emoji: "💡", bonus: { type: "happiness", val: 12 }, pos: { x: 120, y: 130 }, w: 240, h: 15 },
  printer: { name: "Yazıcı", cost: 250, emoji: "🖨️", bonus: { type: "productivity", val: 15 }, pos: { x: 380, y: 400 }, w: 45, h: 35 },
  gaming_chair: { name: "Gaming Sandalye", cost: 300, emoji: "🎮", bonus: { type: "happiness", val: 20 }, pos: { x: 250, y: 360 }, w: 40, h: 50 },
  server: { name: "Mini Sunucu", cost: 800, emoji: "🗄️", bonus: { type: "productivity", val: 30 }, pos: { x: 450, y: 430 }, w: 30, h: 60 },
};

const VISITORS = [
  { name: "Ahmet", role: "Öğrenci", emoji: "👨‍🎓", dialogue: "Selam! Workshop var mı yakında?", request: "workshop", reward: { money: 60, prestige: 10 }, tip: 20 },
  { name: "Zeynep", role: "Mezun", emoji: "👩‍💼", dialogue: "Networking etkinliği arıyorum!", request: "networking", reward: { money: 80, prestige: 20 }, tip: 30 },
  { name: "Prof. Yılmaz", role: "Akademisyen", emoji: "👨‍🏫", dialogue: "Konferans düzenlemek ister misiniz?", request: "conference", reward: { money: 200, prestige: 50 }, tip: 50 },
  { name: "Can", role: "Yazılımcı", emoji: "🧑‍💻", dialogue: "Hackathon ne zaman başlıyor?", request: "hackathon", reward: { money: 150, prestige: 35 }, tip: 40 },
  { name: "Elif", role: "Tasarımcı", emoji: "👩‍🎨", dialogue: "UI/UX workshop'u olsa süper olur!", request: "workshop", reward: { money: 70, prestige: 15 }, tip: 25 },
  { name: "Mert", role: "Girişimci", emoji: "🧔", dialogue: "Pitch yarışması düzenleyin!", request: "pitch", reward: { money: 180, prestige: 40 }, tip: 45 },
  { name: "Ayşe", role: "Sponsor Temsilci", emoji: "👩‍💼", dialogue: "Sponsorluk teklifi getirdim!", request: "sponsor", reward: { money: 300, prestige: 25 }, tip: 0 },
  { name: "Deniz", role: "Stajyer", emoji: "🧑‍🔧", dialogue: "Buraya üye olabilir miyim?", request: "member", reward: { money: 20, prestige: 5 }, tip: 10 },
  { name: "Selin", role: "Influencer", emoji: "📱", dialogue: "Etkinliğinizi paylaşabilirim!", request: "social", reward: { money: 50, prestige: 60 }, tip: 15 },
  { name: "Kaan", role: "Yatırımcı", emoji: "💰", dialogue: "Potansiyel görüyorum burada!", request: "pitch", reward: { money: 400, prestige: 70 }, tip: 100 },
];

const RESPONSES = {
  workshop: ["Harika, workshop planlıyoruz! 🔧", "Evet, bu hafta var! Gel katıl!"],
  networking: ["Networking gecemiz yakında! 🤝", "Tam zamanında, kayıt aç!"],
  conference: ["Konferans harika olur! 🏛️", "Hemen organize edelim!"],
  hackathon: ["Hackathon hazırlıkları başladı! 💻", "24 saat kodlama maratonu!"],
  pitch: ["Pitch yarışması süper fikir! 🎯", "Jüriyi ayarlıyoruz!"],
  sponsor: ["Sponsorluk teklifinizi değerlendiriyoruz! 🤝", "Harika bir fırsat!"],
  member: ["Hoş geldin topluluğumuza! 🎉", "Hemen formu doldur!"],
  social: ["Paylaşım için teşekkürler! 📱", "Sosyal medyamızı büyütüyoruz!"],
  reject: ["Şu an müsait değiliz, kusura bakma.", "Belki başka zaman!"],
};

const LEVEL_XP = [0, 100, 300, 700, 1500, 3000];
const LEVEL_NAMES = ["Boş Oda", "Küçük Ofis", "Döşenmiş Ofis", "Coworking", "Kampüs Merkezi", "Girişim Hub'ı"];

const CRISES = [
  { text: "⚡ Elektrik kesildi!", effect: -50, duration: 8 },
  { text: "🚿 Su borusu patladı!", effect: -80, duration: 10 },
  { text: "📡 İnternet gitti!", effect: -30, duration: 6 },
  { text: "🔥 Kahve makinesi yandı!", effect: -100, duration: 5 },
];

// --- MEMBER DEPARTMENTS (for assigning members) ---
const DEPARTMENTS = {
  it: { name: "IT", emoji: "💻", bonusType: "productivity", perSkill: 0.15, color: "#6366f1" },
  media: { name: "Medya", emoji: "📱", bonusType: "prestige", perSkill: 0.12, color: "#f59e0b" },
  organization: { name: "Organizasyon", emoji: "📋", bonusType: "quality", perSkill: 0.1, color: "#10b981" },
  finance: { name: "Finans", emoji: "💰", bonusType: "money", perSkill: 0.08, color: "#ef4444" },
};

// --- PLAYER DEPARTMENT CHOICES (selected at game start) ---
const PLAYER_DEPTS = [
  {
    id: "media_it",
    name: "Medya ve IT",
    emoji: "💻",
    icon: "🖥️",
    color: "#6366f1",
    colorDark: "#4f46e5",
    desc: "Dijital dunya senin oyun alanin. Sosyal medya, web gelistirme ve teknik altyapi.",
    bonus: { productivity: 15, prestige: 5 },
    bonusText: "Verimlilik +15, Prestij +5",
    startItems: ["monitor"],
  },
  {
    id: "member_relations",
    name: "Uye Iliskileri",
    emoji: "🤝",
    icon: "👥",
    color: "#10b981",
    colorDark: "#059669",
    desc: "Insanlarla iletisim en guclu yanin. Uye memnuniyeti ve topluluk buyutme.",
    bonus: { capacity: 3, happiness: 20 },
    bonusText: "Kapasite +3, Mutluluk +20",
    startItems: ["beanbag"],
  },
  {
    id: "corporate",
    name: "Kurumsal Iliskiler",
    emoji: "🏢",
    icon: "💼",
    color: "#f59e0b",
    colorDark: "#d97706",
    desc: "Sponsorlar, partnerler ve dis iliskiler. Para ve prestij kazanma uzmani.",
    bonus: { prestige: 10, money: 150 },
    bonusText: "Prestij +10, Baslangic +150 TL",
    startItems: ["bookshelf"],
  },
  {
    id: "events_org",
    name: "Etkinlik ve Organizasyon",
    emoji: "📅",
    icon: "🎪",
    color: "#ef4444",
    colorDark: "#dc2626",
    desc: "Etkinlik planlama ve organizasyon yeteneklerin muhtesem. Kaliteli etkinlikler duzenle.",
    bonus: { quality: 20, happiness: 10 },
    bonusText: "Kalite +20, Mutluluk +10",
    startItems: ["whiteboard"],
  },
];

// --- EVENT TYPES (interactive planning) ---
const EVENT_TYPES = [
  {
    id: "workshop", name: "Workshop", emoji: "🔧", duration: 20,
    baseMoney: 150, baseXp: 25, basePrestige: 15, cost: 50,
    requires: ["whiteboard"], preferred: ["projector", "monitor"],
    desc: "Teknik workshop: Katılımcılara yeni beceriler öğret",
  },
  {
    id: "hackathon", name: "Hackathon", emoji: "💻", duration: 35,
    baseMoney: 350, baseXp: 50, basePrestige: 40, cost: 120,
    requires: ["monitor"], preferred: ["server", "coffee", "desk"],
    desc: "24 saat kodlama maratonu! Yoğun ama ödüllü",
  },
  {
    id: "networking", name: "Networking", emoji: "🤝", duration: 15,
    baseMoney: 100, baseXp: 15, basePrestige: 30, cost: 30,
    requires: ["coffee"], preferred: ["beanbag", "plant"],
    desc: "Profesyonellerle tanışma etkinliği",
  },
  {
    id: "conference", name: "Konferans", emoji: "🏛️", duration: 30,
    baseMoney: 280, baseXp: 40, basePrestige: 55, cost: 100,
    requires: ["projector"], preferred: ["whiteboard", "printer"],
    desc: "Büyük konferans: Prestij kazancı yüksek",
  },
  {
    id: "pitch", name: "Pitch Yarışması", emoji: "🎯", duration: 25,
    baseMoney: 250, baseXp: 35, basePrestige: 45, cost: 80,
    requires: ["projector"], preferred: ["monitor", "whiteboard"],
    desc: "Girişimciler fikirlerini sunar, yatırımcılar değerlendirir",
  },
  {
    id: "social_night", name: "Sosyal Gece", emoji: "🎉", duration: 12,
    baseMoney: 60, baseXp: 10, basePrestige: 20, cost: 20,
    requires: [], preferred: ["coffee", "beanbag", "rgb", "gaming_chair"],
    desc: "Eğlenceli bir gece: Mutluluk artışı yüksek",
    bonusHappiness: 10,
  },
];

// --- EVENT DECISIONS (mini-game prompts during events) ---
const EVENT_DECISIONS = [
  { text: "Konuşmacı geç kaldı! Ne yaparsın?", options: [
    { label: "Doğaçlama yap", effect: { quality: 8, happiness: -3 }, response: "Harika doğaçlama! Alkış aldın 👏" },
    { label: "Bekle", effect: { quality: -5, happiness: 3 }, response: "Sakin bekledin, konuşmacı geldi 😌" },
  ]},
  { text: "Projeksiyon bozuldu!", options: [
    { label: "Hızlıca tamir et", effect: { quality: 5, money: -20 }, response: "IT ekibi kurtardı! 🔧" },
    { label: "Telefon ekranı kullan", effect: { quality: -8, money: 0 }, response: "İdare ettik ama kalite düştü 📱" },
  ]},
  { text: "Beklenmedik misafir geldi! Yer var mı?", options: [
    { label: "Sığdır", effect: { prestige: 10, happiness: -5 }, response: "Sıkış sıkış ama mutlu! 😅" },
    { label: "Kibarca reddet", effect: { prestige: -5, happiness: 3 }, response: "Anlayışla karşıladı 🤷" },
  ]},
  { text: "Sponsorun logosu yanlış basılmış!", options: [
    { label: "Hemen düzelt", effect: { money: -30, prestige: 5 }, response: "Son anda kurtardık! 😰" },
    { label: "Görmezden gel", effect: { money: 0, prestige: -15 }, response: "Sponsor fark etti... 😬" },
  ]},
  { text: "Katılımcılar pizza istiyor!", options: [
    { label: "Sipariş ver", effect: { happiness: 12, money: -40 }, response: "Herkes mutlu! 🍕" },
    { label: "Hayır, bütçe yok", effect: { happiness: -8, money: 0 }, response: "Biraz hayal kırıklığı... 😔" },
  ]},
  { text: "Sosyal medyada trend olma şansı!", options: [
    { label: "Canlı yayın aç", effect: { prestige: 20, quality: -3 }, response: "Viral olduk! 📈🔥" },
    { label: "Etkinliğe odaklan", effect: { prestige: 0, quality: 8 }, response: "Kaliteli etkinlik, ağızdan ağıza yayılır 👍" },
  ]},
];

// --- DAILY GOALS ---
const GOAL_TEMPLATES = [
  { text: "ziyaretçi kabul et", key: "visitors_accepted", targets: [2, 3, 5], reward: { money: 80, xp: 15 } },
  { text: "etkinlik düzenle", key: "events_planned", targets: [1, 2], reward: { money: 120, xp: 25 } },
  { text: "TL kazan", key: "money_earned", targets: [200, 500, 1000], reward: { money: 50, xp: 20 } },
  { text: "yeni üye kazan", key: "members_gained", targets: [1, 2], reward: { money: 100, xp: 20 } },
  { text: "eşya satın al", key: "items_bought", targets: [1, 2, 3], reward: { money: 60, xp: 10 } },
  { text: "prestij puanı kazan", key: "prestige_earned", targets: [20, 50, 100], reward: { money: 70, xp: 15 } },
];

function generateDailyGoals() {
  const shuffled = [...GOAL_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map(tmpl => {
    const target = tmpl.targets[Math.floor(Math.random() * tmpl.targets.length)];
    return {
      text: `${target} ${tmpl.text}`,
      key: tmpl.key,
      target,
      progress: 0,
      completed: false,
      reward: { money: Math.floor(tmpl.reward.money * (target / tmpl.targets[0])), xp: Math.floor(tmpl.reward.xp * (target / tmpl.targets[0])) },
    };
  });
}

// --- PRESTIGE UPGRADES ---
const PRESTIGE_UPGRADES = [
  { id: "fast_start", name: "Hızlı Başlangıç", cost: 30, desc: "Başlangıç parası 500 (normalde 200)", maxLevel: 1 },
  { id: "extra_queue", name: "Popüler Ofis", cost: 50, desc: "Başlangıç ziyaretçi kuyruğu +3", maxLevel: 3 },
  { id: "idle_boost", name: "Verimli Sistem", cost: 40, desc: "Idle gelir 1.25x", maxLevel: 3 },
  { id: "quality_start", name: "Deneyimli Ekip", cost: 60, desc: "Başlangıç kalitesi +15", maxLevel: 2 },
  { id: "event_discount", name: "Bütçe Uzmanı", cost: 45, desc: "Etkinlik maliyeti -%20", maxLevel: 2 },
  { id: "lucky_members", name: "Karizmatik Lider", cost: 70, desc: "Üye kazanma şansı +%10", maxLevel: 2 },
  { id: "crisis_shield", name: "Sigorta", cost: 55, desc: "Kriz hasar -%50", maxLevel: 2 },
  { id: "xp_boost", name: "Hızlı Öğrenen", cost: 35, desc: "XP kazancı 1.2x", maxLevel: 3 },
];

// ============================================
// SAVE / LOAD HELPERS
// ============================================

function loadPrestige() {
  try {
    const raw = localStorage.getItem(PRESTIGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalPrestige: 0, upgrades: {}, season: 1 };
}

function savePrestige(data) {
  try { localStorage.setItem(PRESTIGE_KEY, JSON.stringify(data)); } catch {}
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveGame(state) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
}

function getPrestigeBonus(upgrades, id) {
  return upgrades[id] || 0;
}

// ============================================
// DRAWING HELPERS (Canvas-like via divs)
// ============================================

function OfficeBackground({ level, ownedItems, onItemClick }) {
  const wallColor = level <= 2 ? "#e8d5b7" : level <= 4 ? "#d4c4a8" : "#c9b896";
  const floorColor = level <= 2 ? "#8b7355" : level <= 4 ? "#7a6548" : "#6d5a40";
  const ceilingTrim = level <= 2 ? "#c4a67a" : level <= 4 ? "#b8956a" : "#a8845c";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: `linear-gradient(180deg, #f5efe6 0%, ${wallColor} 100%)` }} />
      <div style={{ position: "absolute", top: 118, left: 0, right: 0, height: 6, background: ceilingTrim, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, height: 200, background: `linear-gradient(180deg, ${wallColor}, ${wallColor}dd)` }}>
        {[160, 200, 240, 280].map(y => (
          <div key={y} style={{ position: "absolute", top: y - 120, left: 0, right: 0, height: 1, background: "rgba(0,0,0,0.04)" }} />
        ))}
      </div>
      <div style={{
        position: "absolute", top: 140, left: 180, width: 120, height: 80,
        background: "linear-gradient(180deg, #87ceeb, #b8e4f0)", border: "4px solid #8b7355", borderRadius: 4,
        boxShadow: "inset 0 0 20px rgba(135,206,235,0.3)",
      }}>
        <div style={{ position: "absolute", top: 0, left: "50%", width: 3, height: "100%", background: "#8b7355" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 3, background: "#8b7355" }} />
        <div style={{ position: "absolute", top: -8, left: -20, width: 22, height: 90, background: "#c9785080", borderRadius: "0 0 8px 8px" }} />
        <div style={{ position: "absolute", top: -8, right: -20, width: 22, height: 90, background: "#c9785080", borderRadius: "0 0 8px 8px" }} />
      </div>
      {level >= 2 && (
        <div style={{
          position: "absolute", top: 200, left: 20, width: 55, height: 110,
          background: "linear-gradient(180deg, #6d4c2a, #5a3e22)", border: "3px solid #4a3219", borderRadius: "8px 8px 0 0",
        }}>
          <div style={{ position: "absolute", right: 8, top: "50%", width: 6, height: 6, borderRadius: "50%", background: "#d4a843" }} />
        </div>
      )}
      <div style={{ position: "absolute", top: 320, left: 0, right: 0, bottom: 0, background: `linear-gradient(180deg, ${floorColor}, ${floorColor}cc)` }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", top: i * 50, left: 0, right: 0, height: 1, background: "rgba(0,0,0,0.1)" }} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: i * 80 + 40, width: 1, background: "rgba(0,0,0,0.06)" }} />
        ))}
      </div>
      <div style={{
        position: "absolute", bottom: 160, left: 80, right: 80, height: 55,
        background: "linear-gradient(180deg, #b8956a, #a07850)", borderRadius: "6px 6px 0 0",
        border: "2px solid #8b6914", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}>
        <div style={{ position: "absolute", top: 2, left: 10, right: 10, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} />
      </div>
      <div style={{
        position: "absolute", bottom: 105, left: 78, right: 78, height: 60,
        background: "linear-gradient(180deg, #8b6914, #7a5c12)", borderRadius: "0 0 4px 4px", border: "2px solid #6b4e10",
      }}>
        <div style={{ position: "absolute", top: 8, left: 15, right: 15, height: 44, border: "1px solid #9a7820", borderRadius: 3 }} />
      </div>
      {ownedItems.map((itemId, idx) => {
        const data = OFFICE_ITEMS_DATA[itemId];
        if (!data) return null;
        const offsetX = (idx % 3) * 15;
        const offsetY = Math.floor(idx / 3) * 10;
        return (
          <div key={`${itemId}-${idx}`} onClick={() => onItemClick?.(itemId)} style={{
            position: "absolute", left: data.pos.x + offsetX, top: data.pos.y + offsetY,
            width: data.w, height: data.h,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: Math.min(data.w, data.h) * 0.7, cursor: "pointer",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))", transition: "transform 0.2s",
            zIndex: Math.floor(data.pos.y + offsetY),
          }} title={data.name}>
            {data.emoji}
          </div>
        );
      })}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(255,200,100,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
    </div>
  );
}

function CharacterSprite({ visitor, position, isLeaving, onClick }) {
  if (!visitor) return null;
  const xPos = isLeaving ? -100 : position === "counter" ? 190 : 400;
  const yPos = position === "counter" ? 360 : 380;
  return (
    <div onClick={onClick} style={{
      position: "absolute", left: xPos, top: yPos,
      transition: "left 0.8s ease-in-out, opacity 0.5s", opacity: isLeaving ? 0 : 1, zIndex: 100, cursor: "pointer",
    }}>
      <div style={{ width: 70, height: 110, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        <div style={{
          width: 50, height: 50, borderRadius: "50%",
          background: "linear-gradient(180deg, #f5d5b8, #e8c4a0)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)", border: "2px solid #d4a87a",
        }}>{visitor.emoji}</div>
        <div style={{
          width: 45, height: 55, background: "linear-gradient(180deg, #4a5568, #2d3748)",
          borderRadius: "8px 8px 4px 4px", marginTop: -5, boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
        }} />
        <div style={{
          position: "absolute", bottom: -18, background: "#1a1a2e", color: "#e2e8f0",
          padding: "2px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700, whiteSpace: "nowrap", border: "1px solid #ffffff20",
        }}>{visitor.name} · {visitor.role}</div>
      </div>
    </div>
  );
}

function SpeechBubble({ text, x, y, options, onOption }) {
  if (!text) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 200, animation: "bubblePop 0.3s ease-out" }}>
      <div style={{
        background: "#fffdf5", border: "2px solid #d4a87a", borderRadius: 16,
        padding: "10px 14px", maxWidth: 220, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", position: "relative",
      }}>
        <div style={{ fontSize: 13, color: "#2d1f0e", fontWeight: 500, lineHeight: 1.4 }}>{text}</div>
        {options && (
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {options.map((opt, i) => (
              <button key={i} onClick={() => onOption(opt.action)} style={{
                flex: 1, padding: "6px 8px", borderRadius: 10, border: "none", fontSize: 11, fontWeight: 700,
                background: opt.color || "#6366f1", color: "#fff", cursor: "pointer",
                boxShadow: `0 2px 6px ${opt.color || "#6366f1"}44`, transition: "transform 0.1s",
              }}>{opt.label}</button>
            ))}
          </div>
        )}
        <div style={{ position: "absolute", bottom: -10, left: 30, width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "10px solid #fffdf5" }} />
        <div style={{ position: "absolute", bottom: -13, left: 29, width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderTop: "11px solid #d4a87a", zIndex: -1 }} />
      </div>
    </div>
  );
}

function PlayerCharacter() {
  return (
    <div style={{ position: "absolute", left: 340, top: 330, zIndex: 90 }}>
      <div style={{ width: 60, height: 100, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(180deg, #f5d5b8, #e8c4a0)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          border: "2px solid #d4a87a", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>🧑‍💼</div>
        <div style={{
          width: 40, height: 50, background: "linear-gradient(180deg, #6366f1, #4f46e5)",
          borderRadius: "8px 8px 4px 4px", marginTop: -4,
        }} />
        <div style={{
          position: "absolute", bottom: -14, background: "#6366f1", color: "#fff",
          padding: "2px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700, border: "1px solid #818cf8",
        }}>Sen · Yönetici</div>
      </div>
    </div>
  );
}

function Notification({ text, type }) {
  if (!text) return null;
  const colors = { success: "#10b981", error: "#ef4444", info: "#6366f1", crisis: "#f59e0b", reward: "#fbbf24" };
  return (
    <div style={{
      position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 400,
      background: colors[type] || "#6366f1", color: "#fff", padding: "8px 18px",
      borderRadius: 12, fontWeight: 700, fontSize: 13, boxShadow: `0 4px 16px ${colors[type] || "#6366f1"}44`,
      animation: "bubblePop 0.3s ease-out", whiteSpace: "nowrap", maxWidth: "90%", textAlign: "center",
    }}>{text}</div>
  );
}

// ============================================
// HUD
// ============================================

function GameHUD({ money, prestige, xp, level, day, happiness, idleRate, season, onGoals }) {
  const xpProgress = (() => {
    if (level >= LEVEL_XP.length) return 1;
    const cur = LEVEL_XP[level - 1];
    const nxt = LEVEL_XP[level] || cur + 1000;
    return (xp - cur) / (nxt - cur);
  })();

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 300, padding: 8 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85))",
        borderRadius: 14, padding: "6px 12px", border: "1px solid #ffffff15", backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {season > 1 && <div style={{ background: "#f59e0b", borderRadius: 8, padding: "3px 6px", fontSize: 9, fontWeight: 800, color: "#fff" }}>S{season}</div>}
          <div style={{ background: "#6366f1", borderRadius: 8, padding: "3px 8px", fontSize: 10, fontWeight: 800, color: "#fff" }}>GÜN {day}</div>
          <div style={{ background: "#10b981", borderRadius: 8, padding: "3px 8px", fontSize: 10, fontWeight: 800, color: "#fff" }}>LV.{level}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#fbbf24" }}>💰{Math.floor(money)}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#a78bfa" }}>⭐{Math.floor(prestige)}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#34d399" }}>😊{Math.min(100, Math.floor(happiness))}%</span>
        </div>
      </div>
      <div style={{ marginTop: 4, height: 4, background: "rgba(15,23,42,0.6)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #6366f1, #a78bfa)", width: `${xpProgress * 100}%`, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, padding: "0 4px" }}>
        <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>{LEVEL_NAMES[level - 1]} · ✨{Math.floor(xp)} XP</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#60a5fa", fontWeight: 600 }}>📈 {idleRate.toFixed(1)}/s</span>
          <button onClick={onGoals} style={{
            background: "#f59e0b", border: "none", borderRadius: 6, padding: "1px 6px",
            fontSize: 9, fontWeight: 800, color: "#fff", cursor: "pointer",
          }}>🎯 Hedefler</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SHOP OVERLAY
// ============================================

function ShopOverlay({ money, ownedItems, onBuy, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#1e1b4b", borderRadius: 20, padding: 20, width: "100%", maxWidth: 400, maxHeight: 500, overflowY: "auto", border: "2px solid #6366f140" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0" }}>🛒 Ofis Mağazası</div>
          <button onClick={onClose} style={{ background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", padding: "4px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(OFFICE_ITEMS_DATA).map(([id, item]) => {
            const owned = ownedItems.filter(x => x === id).length;
            const canAfford = money >= item.cost;
            return (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0f172a", borderRadius: 12, padding: "8px 12px", border: "1px solid #ffffff10", opacity: canAfford ? 1 : 0.4 }}>
                <div style={{ fontSize: 28, width: 40, textAlign: "center" }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
                    {item.name} {owned > 0 && <span style={{ color: "#6366f1" }}>x{owned}</span>}
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>
                    {item.bonus.type === "capacity" && `Kapasite +${item.bonus.val}`}
                    {item.bonus.type === "quality" && `Kalite +${item.bonus.val}`}
                    {item.bonus.type === "happiness" && `Mutluluk +${item.bonus.val}`}
                    {item.bonus.type === "productivity" && `Verimlilik +${item.bonus.val}`}
                    {item.bonus.type === "prestige" && `Prestij +${item.bonus.val}`}
                  </div>
                </div>
                <button onClick={() => canAfford && onBuy(id)} disabled={!canAfford} style={{
                  padding: "6px 14px", borderRadius: 10, border: "none", fontWeight: 800, fontSize: 13,
                  background: canAfford ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#1e293b",
                  color: canAfford ? "#fff" : "#475569", cursor: canAfford ? "pointer" : "not-allowed",
                  boxShadow: canAfford ? "0 2px 8px #6366f140" : "none",
                }}>💰{item.cost}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// EVENT PLANNING OVERLAY
// ============================================

function EventPlanOverlay({ money, ownedItems, stats, members, activeEvent, prestigeUpgrades, onStartEvent, onClose }) {
  const discountLevel = getPrestigeBonus(prestigeUpgrades, "event_discount");
  const discountMult = 1 - discountLevel * 0.2;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#1e1b4b", borderRadius: 20, padding: 20, width: "100%", maxWidth: 420, maxHeight: 540, overflowY: "auto", border: "2px solid #f59e0b40" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0" }}>📅 Etkinlik Planla</div>
          <button onClick={onClose} style={{ background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", padding: "4px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>✕</button>
        </div>

        {activeEvent ? (
          <div style={{ textAlign: "center", padding: 20, color: "#94a3b8" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{activeEvent.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{activeEvent.name} devam ediyor...</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Bitmesini bekle!</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EVENT_TYPES.map(evt => {
              const cost = Math.floor(evt.cost * discountMult);
              const canAfford = money >= cost;
              const hasRequired = evt.requires.every(r => ownedItems.includes(r));
              const preferredCount = evt.preferred.filter(p => ownedItems.includes(p)).length;
              const qualityBonus = (hasRequired ? 1 : 0.5) + preferredCount * 0.15 + stats.quality / 100;
              const orgDeptSkill = members.filter(m => m.dept === "organization").reduce((s, m) => s + m.skill, 0);
              const totalQuality = Math.min(200, Math.floor(qualityBonus * 100 + orgDeptSkill * 0.1));
              const canStart = canAfford && hasRequired;

              return (
                <div key={evt.id} style={{
                  background: "#0f172a", borderRadius: 12, padding: "10px 12px",
                  border: `1px solid ${canStart ? "#ffffff10" : "#ef444440"}`,
                  opacity: canStart ? 1 : 0.5,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 28 }}>{evt.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{evt.name}</div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{evt.desc}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 9, color: "#fbbf24" }}>💰+{Math.floor(evt.baseMoney * qualityBonus)}</span>
                        <span style={{ fontSize: 9, color: "#a78bfa" }}>⭐+{Math.floor(evt.basePrestige * qualityBonus)}</span>
                        <span style={{ fontSize: 9, color: "#60a5fa" }}>✨+{evt.baseXp}</span>
                        <span style={{ fontSize: 9, color: "#94a3b8" }}>⏱️{evt.duration}s</span>
                      </div>
                      {!hasRequired && (
                        <div style={{ fontSize: 9, color: "#ef4444", marginTop: 3 }}>
                          Gerekli: {evt.requires.map(r => OFFICE_ITEMS_DATA[r]?.emoji + " " + OFFICE_ITEMS_DATA[r]?.name).join(", ")}
                        </div>
                      )}
                      <div style={{ fontSize: 9, color: "#10b981", marginTop: 2 }}>
                        Kalite: {totalQuality}% {preferredCount > 0 && `(+${preferredCount} bonus eşya)`}
                      </div>
                    </div>
                    <button onClick={() => canStart && onStartEvent(evt, cost, qualityBonus)} disabled={!canStart} style={{
                      padding: "8px 12px", borderRadius: 10, border: "none", fontWeight: 800, fontSize: 12,
                      background: canStart ? "linear-gradient(135deg, #f59e0b, #d97706)" : "#1e293b",
                      color: canStart ? "#fff" : "#475569", cursor: canStart ? "pointer" : "not-allowed",
                    }}>💰{cost}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// EVENT DECISION OVERLAY
// ============================================

function EventDecisionOverlay({ decision, onDecide }) {
  if (!decision) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#1e1b4b", borderRadius: 20, padding: 20, width: "100%", maxWidth: 340, border: "2px solid #f59e0b", animation: "bubblePop 0.3s ease-out" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", textAlign: "center", marginBottom: 4 }}>⚡ Karar Zamanı!</div>
        <div style={{ fontSize: 13, color: "#e2e8f0", textAlign: "center", marginBottom: 16, lineHeight: 1.5 }}>{decision.text}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {decision.options.map((opt, i) => (
            <button key={i} onClick={() => onDecide(i)} style={{
              padding: "10px 14px", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700,
              background: i === 0 ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              textAlign: "left",
            }}>
              {opt.label}
              <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>
                {Object.entries(opt.effect).map(([k, v]) => `${k}: ${v > 0 ? "+" : ""}${v}`).join(" · ")}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// STATS OVERLAY (with department management)
// ============================================

function StatsOverlay({ stats, members, eventsCompleted, totalEarned, level, deptBonuses, onAssignDept, onClose }) {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#1e1b4b", borderRadius: 20, padding: 20, width: "100%", maxWidth: 400, maxHeight: 560, overflowY: "auto", border: "2px solid #10b98140" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0" }}>📊 İstatistikler</div>
          <button onClick={onClose} style={{ background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", padding: "4px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>✕</button>
        </div>
        {[
          { label: "Ofis Seviyesi", value: `${level} — ${LEVEL_NAMES[level - 1]}`, icon: "🏢" },
          { label: "Toplam Kazanç", value: `💰 ${Math.floor(totalEarned)}`, icon: "📈" },
          { label: "Etkinlik Tamamlanan", value: eventsCompleted, icon: "📅" },
          { label: "Üye Sayısı", value: members.length, icon: "👥" },
          { label: "Kalite", value: stats.quality, icon: "⭐" },
          { label: "Verimlilik", value: stats.productivity, icon: "⚡" },
          { label: "Mutluluk", value: `${Math.min(100, stats.happiness)}%`, icon: "😊" },
          { label: "Kapasite", value: stats.capacity, icon: "🪑" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #ffffff08" }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.icon} {s.label}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0" }}>{s.value}</span>
          </div>
        ))}

        {/* Department bonuses */}
        <div style={{ marginTop: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, fontWeight: 700 }}>Departman Bonusları:</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {Object.entries(DEPARTMENTS).map(([deptId, dept]) => {
              const bonus = deptBonuses[deptId] || 0;
              const count = members.filter(m => m.dept === deptId).length;
              return (
                <div key={deptId} style={{ background: "#0f172a", borderRadius: 8, padding: "4px 8px", border: `1px solid ${dept.color}40`, fontSize: 10 }}>
                  <span style={{ color: dept.color, fontWeight: 700 }}>{dept.emoji} {dept.name}</span>
                  <span style={{ color: "#94a3b8" }}> ({count}) +{bonus.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Members with department assignment */}
        {members.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, fontWeight: 700 }}>Üyeler (ata: tıkla):</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {members.map((m, i) => (
                <div key={i}>
                  <div onClick={() => setSelectedMember(selectedMember === i ? null : i)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: selectedMember === i ? "#1e293b" : "#0f172a",
                    borderRadius: 8, padding: "6px 8px", cursor: "pointer",
                    border: selectedMember === i ? "1px solid #6366f1" : "1px solid #ffffff10",
                  }}>
                    <span style={{ fontSize: 16 }}>{m.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>{m.name}</span>
                      <span style={{ fontSize: 9, color: "#64748b", marginLeft: 4 }}>Yetenek: {m.skill}</span>
                    </div>
                    {m.dept && DEPARTMENTS[m.dept] ? (
                      <span style={{ fontSize: 9, fontWeight: 700, color: DEPARTMENTS[m.dept].color, background: `${DEPARTMENTS[m.dept].color}20`, padding: "2px 6px", borderRadius: 6 }}>
                        {DEPARTMENTS[m.dept].emoji} {DEPARTMENTS[m.dept].name}
                      </span>
                    ) : (
                      <span style={{ fontSize: 9, color: "#475569" }}>Atanmamış</span>
                    )}
                  </div>
                  {selectedMember === i && (
                    <div style={{ display: "flex", gap: 4, marginTop: 4, paddingLeft: 28 }}>
                      {Object.entries(DEPARTMENTS).map(([deptId, dept]) => (
                        <button key={deptId} onClick={() => { onAssignDept(i, deptId); setSelectedMember(null); }} style={{
                          padding: "4px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700,
                          background: m.dept === deptId ? dept.color : "#1e293b",
                          color: m.dept === deptId ? "#fff" : dept.color,
                          cursor: "pointer", border: `1px solid ${dept.color}60`,
                        }}>{dept.emoji} {dept.name}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// GOALS OVERLAY
// ============================================

function GoalsOverlay({ goals, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#1e1b4b", borderRadius: 20, padding: 20, width: "100%", maxWidth: 360, border: "2px solid #f59e0b40" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0" }}>🎯 Günlük Hedefler</div>
          <button onClick={onClose} style={{ background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", padding: "4px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {goals.map((g, i) => {
            const pct = Math.min(100, (g.progress / g.target) * 100);
            return (
              <div key={i} style={{
                background: "#0f172a", borderRadius: 12, padding: "10px 12px",
                border: g.completed ? "1px solid #10b98160" : "1px solid #ffffff10",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: g.completed ? "#10b981" : "#e2e8f0" }}>
                    {g.completed ? "✅ " : ""}{g.text}
                  </span>
                  <span style={{ fontSize: 10, color: "#64748b" }}>{Math.min(g.progress, g.target)}/{g.target}</span>
                </div>
                <div style={{ height: 4, background: "#1e293b", borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
                  <div style={{
                    height: "100%", borderRadius: 2, transition: "width 0.3s",
                    background: g.completed ? "#10b981" : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                    width: `${pct}%`,
                  }} />
                </div>
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 4 }}>
                  Ödül: 💰{g.reward.money} ✨{g.reward.xp} XP
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 10, color: "#475569", textAlign: "center", marginTop: 10 }}>Hedefler her gün yenilenir</div>
      </div>
    </div>
  );
}

// ============================================
// PRESTIGE OVERLAY
// ============================================

function PrestigeOverlay({ totalPrestige, upgrades, season, onBuyUpgrade, onNewSeason, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "linear-gradient(180deg, #1e1b4b, #0f172a)", borderRadius: 20, padding: 20, width: "100%", maxWidth: 400, maxHeight: 560, overflowY: "auto", border: "2px solid #f59e0b" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24" }}>🏆 Dönem Sonu</div>
          <button onClick={onClose} style={{ background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", padding: "4px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>✕</button>
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>Sezon {season} · Prestij Puanı: <span style={{ color: "#fbbf24", fontWeight: 800 }}>⭐ {Math.floor(totalPrestige)}</span></div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {PRESTIGE_UPGRADES.map(upg => {
            const currentLevel = upgrades[upg.id] || 0;
            const maxed = currentLevel >= upg.maxLevel;
            const cost = upg.cost * (currentLevel + 1);
            const canAfford = totalPrestige >= cost && !maxed;
            return (
              <div key={upg.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#0f172a", borderRadius: 12, padding: "8px 12px",
                border: maxed ? "1px solid #10b98140" : "1px solid #ffffff10",
                opacity: maxed ? 0.6 : 1,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: maxed ? "#10b981" : "#e2e8f0" }}>
                    {upg.name} {currentLevel > 0 && <span style={{ color: "#f59e0b" }}>Lv.{currentLevel}</span>}
                    {maxed && " ✅"}
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{upg.desc}</div>
                </div>
                {!maxed && (
                  <button onClick={() => canAfford && onBuyUpgrade(upg.id, cost)} disabled={!canAfford} style={{
                    padding: "6px 10px", borderRadius: 10, border: "none", fontWeight: 800, fontSize: 11,
                    background: canAfford ? "linear-gradient(135deg, #f59e0b, #d97706)" : "#1e293b",
                    color: canAfford ? "#fff" : "#475569", cursor: canAfford ? "pointer" : "not-allowed",
                  }}>⭐{cost}</button>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onNewSeason} style={{
          width: "100%", padding: "12px", borderRadius: 14, border: "2px solid #f59e0b",
          background: "linear-gradient(135deg, #f59e0b20, #d9770620)",
          color: "#fbbf24", fontWeight: 800, fontSize: 14, cursor: "pointer",
          boxShadow: "0 4px 16px #f59e0b30",
        }}>
          🔄 Yeni Dönem Başlat (Sıfırla + Bonuslarla Başla)
        </button>
        <div style={{ fontSize: 9, color: "#475569", textAlign: "center", marginTop: 6 }}>
          Para, eşyalar ve üyeler sıfırlanır. Prestij yükseltmeleri kalır!
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN MENU SCREEN
// ============================================

function MainMenu({ hasSave, onPlay, onContinue, onSettings }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(180deg, #0f0a2e 0%, #1a1145 40%, #0f172a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 900,
    }}>
      {/* Animated background particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + (i * 7) % 80}%`,
            top: `${5 + (i * 13) % 85}%`,
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            borderRadius: "50%",
            background: ["#6366f1", "#f59e0b", "#10b981", "#ef4444"][i % 4],
            opacity: 0.15 + (i % 5) * 0.05,
            animation: `float ${2 + (i % 3)}s infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      {/* Logo / Title area */}
      <div style={{ textAlign: "center", marginBottom: 40, position: "relative" }}>
        <div style={{ fontSize: 48, marginBottom: 8, filter: "drop-shadow(0 4px 12px rgba(99,102,241,0.4))" }}>🏢</div>
        <div style={{
          fontSize: 28, fontWeight: 900, color: "#e2e8f0",
          letterSpacing: -1, lineHeight: 1.1,
          textShadow: "0 2px 20px rgba(99,102,241,0.3)",
        }}>
          Topluluk Ofisi
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: "#6366f1",
          marginTop: 6, letterSpacing: 2, textTransform: "uppercase",
        }}>
          Simulasyon Oyunu
        </div>
        <div style={{
          fontSize: 10, color: "#475569", marginTop: 8, fontWeight: 500,
        }}>
          Akdeniz Universitesi Girisimcilik ve Kariyer Toplulugu
        </div>
      </div>

      {/* Menu buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 260 }}>
        {hasSave && (
          <button onClick={onContinue} style={{
            padding: "14px 20px", borderRadius: 16, border: "2px solid #6366f1",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            transition: "transform 0.15s, box-shadow 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            ▶ Devam Et
          </button>
        )}
        <button onClick={onPlay} style={{
          padding: "14px 20px", borderRadius: 16,
          border: hasSave ? "2px solid #10b98160" : "2px solid #6366f1",
          background: hasSave
            ? "linear-gradient(135deg, #10b981, #059669)"
            : "linear-gradient(135deg, #6366f1, #4f46e5)",
          color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer",
          boxShadow: hasSave ? "0 4px 20px rgba(16,185,129,0.3)" : "0 4px 20px rgba(99,102,241,0.4)",
          transition: "transform 0.15s, box-shadow 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {hasSave ? "🔄 Yeni Oyun" : "▶ Oyna"}
        </button>
        <button onClick={onSettings} style={{
          padding: "12px 20px", borderRadius: 16,
          border: "1px solid #ffffff15",
          background: "rgba(30,27,75,0.8)",
          color: "#94a3b8", fontWeight: 700, fontSize: 14, cursor: "pointer",
          transition: "transform 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          ⚙️ Ayarlar
        </button>
      </div>

      {/* Version */}
      <div style={{ position: "absolute", bottom: 12, fontSize: 9, color: "#334155", fontWeight: 600 }}>
        v1.0 — GKT Office Sim
      </div>
    </div>
  );
}

// ============================================
// DEPARTMENT SELECT SCREEN
// ============================================

function DeptSelectScreen({ onSelect, onBack }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(180deg, #0f0a2e 0%, #1a1145 50%, #0f172a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      zIndex: 900, padding: 20, overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginTop: 16, marginBottom: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#e2e8f0", letterSpacing: -0.5 }}>
          Departmanini Sec
        </div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, maxWidth: 300, lineHeight: 1.4 }}>
          Toplulukta hangi departmanda gorev alacaksin? Secimin oyun boyunca sana ozel bonuslar saglayacak.
        </div>
      </div>

      {/* Department cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 400, marginTop: 12 }}>
        {PLAYER_DEPTS.map((dept) => {
          const isHovered = hovered === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => onSelect(dept.id)}
              onMouseEnter={() => setHovered(dept.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHovered
                  ? `linear-gradient(135deg, ${dept.color}30, ${dept.colorDark}20)`
                  : "rgba(15,23,42,0.7)",
                border: `2px solid ${isHovered ? dept.color : dept.color + "30"}`,
                borderRadius: 16, padding: "14px 16px",
                cursor: "pointer", textAlign: "left",
                transition: "all 0.2s ease",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
                boxShadow: isHovered ? `0 4px 20px ${dept.color}30` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `linear-gradient(135deg, ${dept.color}, ${dept.colorDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, flexShrink: 0,
                  boxShadow: `0 4px 12px ${dept.color}40`,
                }}>
                  {dept.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 800, color: "#e2e8f0",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    {dept.emoji} {dept.name}
                  </div>
                  <div style={{
                    fontSize: 10, color: "#94a3b8", marginTop: 3, lineHeight: 1.4,
                  }}>
                    {dept.desc}
                  </div>
                  <div style={{
                    display: "inline-block", marginTop: 6,
                    background: `${dept.color}20`, border: `1px solid ${dept.color}40`,
                    borderRadius: 8, padding: "2px 8px",
                    fontSize: 9, fontWeight: 700, color: dept.color,
                  }}>
                    {dept.bonusText}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Back button */}
      <button onClick={onBack} style={{
        marginTop: 16, padding: "8px 24px", borderRadius: 10,
        border: "1px solid #ffffff15", background: "rgba(30,27,75,0.6)",
        color: "#64748b", fontWeight: 700, fontSize: 12, cursor: "pointer",
      }}>
        ← Geri
      </button>
    </div>
  );
}

// ============================================
// SETTINGS OVERLAY
// ============================================

function SettingsOverlay({ onClose, onResetAll }) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 950,
      background: "linear-gradient(180deg, #0f0a2e, #1a1145)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#1e1b4b", borderRadius: 20, padding: 24,
        width: "100%", maxWidth: 360, border: "2px solid #ffffff10",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#e2e8f0" }}>⚙️ Ayarlar</div>
          <button onClick={onClose} style={{
            background: "#ef4444", border: "none", borderRadius: 8,
            color: "#fff", padding: "4px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12,
          }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Game info */}
          <div style={{
            background: "#0f172a", borderRadius: 12, padding: "12px 14px",
            border: "1px solid #ffffff10",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>Oyun Bilgisi</div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
              Topluluk Ofisi Simulasyonu v1.0<br />
              Akdeniz Uni. GKT — Medya ve IT Dept.<br />
              Oyun otomatik kaydedilir.
            </div>
          </div>

          {/* Reset save */}
          <div style={{
            background: "#0f172a", borderRadius: 12, padding: "12px 14px",
            border: "1px solid #ef444430",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>Tehlikeli Alan</div>
            {!confirmReset ? (
              <button onClick={() => setConfirmReset(true)} style={{
                width: "100%", padding: "8px", borderRadius: 10, border: "1px solid #ef444440",
                background: "transparent", color: "#ef4444", fontWeight: 700, fontSize: 12,
                cursor: "pointer",
              }}>
                Tum Verileri Sil
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 11, color: "#f87171", fontWeight: 600 }}>
                  Emin misin? Tum kayitlar ve prestij verileri silinecek!
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { onResetAll(); setConfirmReset(false); }} style={{
                    flex: 1, padding: "8px", borderRadius: 8, border: "none",
                    background: "#ef4444", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer",
                  }}>Evet, Sil</button>
                  <button onClick={() => setConfirmReset(false)} style={{
                    flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #ffffff20",
                    background: "transparent", color: "#94a3b8", fontWeight: 700, fontSize: 12, cursor: "pointer",
                  }}>Vazgec</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ACTION BAR
// ============================================

function ActionBar({ onShop, onEvents, onStats, onPrestige, activeEvent, eventProgress, eventDuration, visitorCount, day }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 300, background: "linear-gradient(0deg, rgba(15,23,42,0.95), rgba(15,23,42,0.7), transparent)", padding: "30px 8px 8px" }}>
      {activeEvent && (
        <div style={{ background: "#1e1b4b", borderRadius: 10, padding: "6px 12px", marginBottom: 8, border: "1px solid #6366f140", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{activeEvent.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>{activeEvent.name}</div>
            <div style={{ height: 4, background: "#0f172a", borderRadius: 2, overflow: "hidden", marginTop: 3 }}>
              <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #6366f1, #a78bfa)", width: `${(eventProgress / eventDuration) * 100}%`, transition: "width 0.5s" }} />
            </div>
          </div>
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{Math.ceil(eventDuration - eventProgress)}s</span>
        </div>
      )}
      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
        <button onClick={onShop} style={{ flex: 1, padding: "9px 4px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>🛒 Mağaza</button>
        <button onClick={onEvents} style={{ flex: 1, padding: "9px 4px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>📅 Etkinlik</button>
        <button onClick={onStats} style={{ flex: 1, padding: "9px 4px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>📊 Takım</button>
        {day >= 50 && (
          <button onClick={onPrestige} style={{ flex: 1, padding: "9px 4px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1e1b4b", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>🏆 Dönem</button>
        )}
        <div style={{ padding: "9px 10px", borderRadius: 12, background: "#1e293b", border: "1px solid #ffffff10", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>👥{visitorCount}</div>
      </div>
    </div>
  );
}

// ============================================
// MAIN GAME
// ============================================

export default function OfficeSimulator() {
  // --- Game phase: "menu" | "dept_select" | "settings" | "playing" ---
  const [gamePhase, setGamePhase] = useState(() => {
    const saved = loadGame();
    return saved?.playerDept ? "menu" : "menu";
  });
  const [showSettings, setShowSettings] = useState(false);

  // --- Load prestige (permanent) ---
  const [prestigeData, setPrestigeData] = useState(() => loadPrestige());

  // --- Compute starting values based on prestige upgrades ---
  const startValues = useMemo(() => {
    const u = prestigeData.upgrades;
    return {
      money: getPrestigeBonus(u, "fast_start") > 0 ? 500 : 200,
      queue: 3 + getPrestigeBonus(u, "extra_queue") * 3,
      quality: getPrestigeBonus(u, "quality_start") * 15,
    };
  }, [prestigeData]);

  // --- Load or init game state ---
  const [playerDept, setPlayerDept] = useState(() => { const s = loadGame(); return s?.playerDept ?? null; });
  const [money, setMoney] = useState(() => { const s = loadGame(); return s?.money ?? startValues.money; });
  const [prestige, setPrestige] = useState(() => { const s = loadGame(); return s?.prestige ?? 0; });
  const [xp, setXp] = useState(() => { const s = loadGame(); return s?.xp ?? 0; });
  const [day, setDay] = useState(() => { const s = loadGame(); return s?.day ?? 1; });
  const [ownedItems, setOwnedItems] = useState(() => { const s = loadGame(); return s?.ownedItems ?? []; });
  const [members, setMembers] = useState(() => { const s = loadGame(); return s?.members ?? []; });
  const [totalEarned, setTotalEarned] = useState(() => { const s = loadGame(); return s?.totalEarned ?? 0; });
  const [eventsCompleted, setEventsCompleted] = useState(() => { const s = loadGame(); return s?.eventsCompleted ?? 0; });
  const [dailyGoals, setDailyGoals] = useState(() => { const s = loadGame(); return s?.dailyGoals ?? generateDailyGoals(); });
  const [lastGoalDay, setLastGoalDay] = useState(() => { const s = loadGame(); return s?.lastGoalDay ?? 1; });

  // Visitor state (transient, not saved)
  const [currentVisitor, setCurrentVisitor] = useState(null);
  const [visitorState, setVisitorState] = useState("idle");
  const [dialogue, setDialogue] = useState(null);
  const [responseDialogue, setResponseDialogue] = useState(null);
  const [visitorQueue, setVisitorQueue] = useState(() => { const s = loadGame(); return s?.visitorQueue ?? startValues.queue; });
  const [isLeaving, setIsLeaving] = useState(false);

  // Event state
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventProgress, setEventProgress] = useState(0);
  const [eventQualityBonus, setEventQualityBonus] = useState(1);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [decisionFired, setDecisionFired] = useState(false);

  // UI state
  const [showShop, setShowShop] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showPrestige, setShowPrestige] = useState(false);
  const [notification, setNotification] = useState(null);
  const [notifType, setNotifType] = useState("info");
  const [activeCrisis, setActiveCrisis] = useState(null);
  const [crisisTimer, setCrisisTimer] = useState(0);

  // --- Has a save file? ---
  const hasSave = useMemo(() => !!loadGame()?.playerDept, []);

  // --- Start new game with chosen department ---
  const startNewGame = useCallback((deptId) => {
    const dept = PLAYER_DEPTS.find(d => d.id === deptId);
    if (!dept) return;

    const u = prestigeData.upgrades;
    const baseMoney = getPrestigeBonus(u, "fast_start") > 0 ? 500 : 200;
    const baseQueue = 3 + getPrestigeBonus(u, "extra_queue") * 3;

    // Clear old save
    localStorage.removeItem(SAVE_KEY);

    // Apply department bonuses
    setPlayerDept(deptId);
    setMoney(baseMoney + (dept.bonus.money || 0));
    setPrestige(dept.bonus.prestige || 0);
    setXp(0);
    setDay(1);
    setOwnedItems(dept.startItems ? [...dept.startItems] : []);
    setMembers([]);
    setTotalEarned(0);
    setEventsCompleted(0);
    setVisitorQueue(baseQueue + (dept.bonus.capacity || 0));
    setDailyGoals(generateDailyGoals());
    setLastGoalDay(1);
    setActiveEvent(null);
    setEventProgress(0);
    setActiveCrisis(null);
    setCurrentVisitor(null);
    setVisitorState("idle");
    setGamePhase("playing");
  }, [prestigeData]);

  // --- Continue existing game ---
  const continueGame = useCallback(() => {
    setGamePhase("playing");
  }, []);

  // --- Reset all data ---
  const resetAllData = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(PRESTIGE_KEY);
    setPrestigeData({ totalPrestige: 0, upgrades: {}, season: 1 });
    setPlayerDept(null);
    setMoney(200);
    setPrestige(0);
    setXp(0);
    setDay(1);
    setOwnedItems([]);
    setMembers([]);
    setTotalEarned(0);
    setEventsCompleted(0);
    setVisitorQueue(3);
    setDailyGoals(generateDailyGoals());
    setLastGoalDay(1);
    setShowSettings(false);
    setGamePhase("menu");
  }, []);

  // --- Computed ---
  const level = useMemo(() => {
    for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_XP[i]) return i + 1;
    }
    return 1;
  }, [xp]);

  const stats = useMemo(() => {
    let s = { capacity: 5, quality: startValues.quality, happiness: 50, productivity: 10, prestige: 0 };
    // Apply player department bonus
    const dept = PLAYER_DEPTS.find(d => d.id === playerDept);
    if (dept) {
      if (dept.bonus.capacity) s.capacity += dept.bonus.capacity;
      if (dept.bonus.happiness) s.happiness += dept.bonus.happiness;
      if (dept.bonus.productivity) s.productivity += dept.bonus.productivity;
      if (dept.bonus.quality) s.quality += dept.bonus.quality;
    }
    ownedItems.forEach(id => {
      const item = OFFICE_ITEMS_DATA[id];
      if (item) s[item.bonus.type] = (s[item.bonus.type] || 0) + item.bonus.val;
    });
    return s;
  }, [ownedItems, startValues.quality, playerDept]);

  // Department bonuses
  const deptBonuses = useMemo(() => {
    const bonuses = {};
    Object.entries(DEPARTMENTS).forEach(([deptId, dept]) => {
      const deptMembers = members.filter(m => m.dept === deptId);
      bonuses[deptId] = deptMembers.reduce((sum, m) => sum + m.skill * dept.perSkill, 0);
    });
    return bonuses;
  }, [members]);

  const idleRate = useMemo(() => {
    const memberBonus = members.reduce((sum, m) => sum + (m?.skill || 0), 0) * 0.01;
    const itBonus = deptBonuses.it || 0;
    const idleBoostLevel = getPrestigeBonus(prestigeData.upgrades, "idle_boost");
    const idleMultiplier = Math.pow(1.25, idleBoostLevel);
    return Math.max(0.5, ((stats.productivity + itBonus) * 0.1 + memberBonus) * (1 + stats.happiness / 200)) * idleMultiplier;
  }, [members, stats, deptBonuses, prestigeData.upgrades]);

  // --- Save game periodically ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (gamePhase === "playing") {
        saveGame({
          playerDept, money, prestige, xp, day, ownedItems, members, totalEarned, eventsCompleted,
          dailyGoals, lastGoalDay, visitorQueue,
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [gamePhase, playerDept, money, prestige, xp, day, ownedItems, members, totalEarned, eventsCompleted, dailyGoals, lastGoalDay, visitorQueue]);

  // --- Show notification ---
  const showNotif = useCallback((text, type = "info") => {
    setNotification(text);
    setNotifType(type);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // --- Update goal progress ---
  const updateGoal = useCallback((key, amount = 1) => {
    setDailyGoals(prev => prev.map(g => {
      if (g.key === key && !g.completed) {
        const newProgress = g.progress + amount;
        const completed = newProgress >= g.target;
        return { ...g, progress: newProgress, completed };
      }
      return g;
    }));
  }, []);

  // --- Check & reward completed goals ---
  useEffect(() => {
    dailyGoals.forEach(g => {
      if (g.completed && !g.rewarded) {
        setMoney(m => m + g.reward.money);
        const xpBoostLevel = getPrestigeBonus(prestigeData.upgrades, "xp_boost");
        const xpMult = Math.pow(1.2, xpBoostLevel);
        setXp(x => x + Math.floor(g.reward.xp * xpMult));
        showNotif(`🎯 Hedef tamamlandı! +💰${g.reward.money} +✨${g.reward.xp}`, "reward");
        setDailyGoals(prev => prev.map(gg => gg.key === g.key && gg.text === g.text ? { ...gg, rewarded: true } : gg));
      }
    });
  }, [dailyGoals, showNotif, prestigeData.upgrades]);

  // --- Spawn visitor ---
  const spawnVisitor = useCallback(() => {
    if (visitorState !== "idle" || visitorQueue <= 0) return;
    const v = VISITORS[Math.floor(Math.random() * VISITORS.length)];
    setCurrentVisitor(v);
    setVisitorState("arriving");
    setIsLeaving(false);
    setTimeout(() => {
      setVisitorState("talking");
      setDialogue(v.dialogue);
    }, 900);
  }, [visitorState, visitorQueue]);

  // --- Handle visitor response ---
  const handleResponse = useCallback((action) => {
    if (!currentVisitor) return;

    if (action === "accept") {
      const qualityBonus = 1 + stats.quality / 100 + (deptBonuses.organization || 0) * 0.01;
      const financeBonus = 1 + (deptBonuses.finance || 0) * 0.01;
      const mediaBonus = deptBonuses.media || 0;
      const xpBoostLevel = getPrestigeBonus(prestigeData.upgrades, "xp_boost");
      const xpMult = Math.pow(1.2, xpBoostLevel);

      const reward = {
        money: Math.floor((currentVisitor.reward.money * qualityBonus + currentVisitor.tip) * financeBonus),
        prestige: Math.floor(currentVisitor.reward.prestige * qualityBonus + mediaBonus * 0.1),
      };
      setMoney(m => m + reward.money);
      setPrestige(p => p + reward.prestige);
      setXp(x => x + Math.floor(15 * xpMult));
      setTotalEarned(t => t + reward.money);
      setEventsCompleted(e => e + 1);

      updateGoal("visitors_accepted");
      updateGoal("money_earned", reward.money);
      updateGoal("prestige_earned", reward.prestige);

      const responses = RESPONSES[currentVisitor.request] || RESPONSES.workshop;
      setResponseDialogue(responses[Math.floor(Math.random() * responses.length)]);
      setDialogue(null);
      showNotif(`+💰${reward.money} +⭐${reward.prestige}`, "reward");

      // Chance to gain member
      const luckyLevel = getPrestigeBonus(prestigeData.upgrades, "lucky_members");
      const memberChance = 0.25 + luckyLevel * 0.1;
      if (Math.random() < memberChance && members.length < stats.capacity) {
        const pool = VISITORS.filter(v => !members.find(m => m.name === v.name));
        if (pool.length > 0) {
          const newMember = pool[Math.floor(Math.random() * pool.length)];
          const member = { name: newMember.name, emoji: newMember.emoji, dept: null, skill: 30 + Math.floor(Math.random() * 40) };
          setMembers(prev => [...prev, member]);
          updateGoal("members_gained");
          setTimeout(() => showNotif(`🎉 ${newMember.name} topluluğa katıldı!`, "success"), 3500);
        }
      }
    } else {
      const responses = RESPONSES.reject;
      setResponseDialogue(responses[Math.floor(Math.random() * responses.length)]);
      setDialogue(null);
      const xpBoostLevel = getPrestigeBonus(prestigeData.upgrades, "xp_boost");
      const xpMult = Math.pow(1.2, xpBoostLevel);
      setXp(x => x + Math.floor(2 * xpMult));
    }

    setTimeout(() => {
      setResponseDialogue(null);
      setIsLeaving(true);
      setVisitorState("leaving");
      setVisitorQueue(q => Math.max(0, q - 1));
      setTimeout(() => { setCurrentVisitor(null); setVisitorState("idle"); setIsLeaving(false); }, 800);
    }, 1800);
  }, [currentVisitor, stats, members, deptBonuses, showNotif, updateGoal, prestigeData.upgrades]);

  // --- Buy item ---
  const buyItem = useCallback((id) => {
    const item = OFFICE_ITEMS_DATA[id];
    if (money >= item.cost) {
      setMoney(m => m - item.cost);
      setOwnedItems(prev => [...prev, id]);
      updateGoal("items_bought");
      showNotif(`${item.emoji} ${item.name} satın alındı!`, "success");
    }
  }, [money, showNotif, updateGoal]);

  // --- Start event ---
  const startEvent = useCallback((evt, cost, qualityBonus) => {
    setMoney(m => m - cost);
    setActiveEvent(evt);
    setEventProgress(0);
    setEventQualityBonus(qualityBonus);
    setDecisionFired(false);
    setPendingDecision(null);
    setShowEvents(false);
    showNotif(`${evt.emoji} ${evt.name} başladı!`, "info");
  }, [showNotif]);

  // --- Handle event decision ---
  const handleEventDecision = useCallback((optionIndex) => {
    if (!pendingDecision) return;
    const opt = pendingDecision.options[optionIndex];

    if (opt.effect.quality) setEventQualityBonus(q => q + opt.effect.quality / 100);
    if (opt.effect.happiness) {
      /* update stats indirectly via a temp happiness effect — apply to money or prestige */
    }
    if (opt.effect.money) setMoney(m => Math.max(0, m + opt.effect.money));
    if (opt.effect.prestige) setPrestige(p => Math.max(0, p + opt.effect.prestige));

    showNotif(opt.response, "info");
    setPendingDecision(null);
  }, [pendingDecision, showNotif]);

  // --- Assign department ---
  const assignDept = useCallback((memberIndex, deptId) => {
    setMembers(prev => prev.map((m, i) => i === memberIndex ? { ...m, dept: deptId } : m));
    showNotif(`${DEPARTMENTS[deptId].emoji} ${members[memberIndex]?.name} → ${DEPARTMENTS[deptId].name}`, "success");
  }, [members, showNotif]);

  // --- Buy prestige upgrade ---
  const buyPrestigeUpgrade = useCallback((upgradeId, cost) => {
    setPrestigeData(prev => {
      const next = {
        ...prev,
        totalPrestige: prev.totalPrestige - cost,
        upgrades: { ...prev.upgrades, [upgradeId]: (prev.upgrades[upgradeId] || 0) + 1 },
      };
      savePrestige(next);
      return next;
    });
    showNotif("🏆 Prestij yükseltmesi alındı!", "reward");
  }, [showNotif]);

  // --- New season (prestige reset) ---
  const startNewSeason = useCallback(() => {
    // Transfer current prestige points to permanent pool
    const earnedPrestige = Math.floor(prestige);
    const newPrestigeData = {
      ...prestigeData,
      totalPrestige: prestigeData.totalPrestige + earnedPrestige,
      season: prestigeData.season + 1,
    };
    savePrestige(newPrestigeData);
    setPrestigeData(newPrestigeData);

    // Reset game state with prestige bonuses
    const u = newPrestigeData.upgrades;
    const newStartMoney = getPrestigeBonus(u, "fast_start") > 0 ? 500 : 200;
    const newStartQueue = 3 + getPrestigeBonus(u, "extra_queue") * 3;

    setMoney(newStartMoney);
    setPrestige(0);
    setXp(0);
    setDay(1);
    setOwnedItems([]);
    setMembers([]);
    setTotalEarned(0);
    setEventsCompleted(0);
    setVisitorQueue(newStartQueue);
    setDailyGoals(generateDailyGoals());
    setLastGoalDay(1);
    setActiveEvent(null);
    setEventProgress(0);
    setActiveCrisis(null);
    setCurrentVisitor(null);
    setVisitorState("idle");
    setShowPrestige(false);

    // Clear the game save so it starts fresh
    localStorage.removeItem(SAVE_KEY);

    showNotif(`🏆 Sezon ${newPrestigeData.season} başladı! +⭐${earnedPrestige} prestij kazanıldı`, "reward");
  }, [prestige, prestigeData, showNotif]);

  // === GAME LOOP ===
  useEffect(() => {
    const interval = setInterval(() => {
      // Idle income
      const financeBonus = 1 + (deptBonuses.finance || 0) * 0.005;
      setMoney(m => Math.floor((m + idleRate * financeBonus) * 100) / 100);
      setTotalEarned(t => t + idleRate * financeBonus);

      // Auto-spawn visitors
      if (visitorState === "idle" && visitorQueue > 0 && Math.random() < 0.15) {
        spawnVisitor();
      }

      // Replenish visitor queue
      if (Math.random() < 0.05) {
        setVisitorQueue(q => Math.min(10, q + 1));
      }

      // Day progression
      if (Math.random() < 0.016) {
        setDay(d => {
          const newDay = d + 1;
          // Refresh goals each day
          if (newDay > d) {
            setLastGoalDay(prev => {
              if (newDay > prev) {
                setDailyGoals(generateDailyGoals());
                return newDay;
              }
              return prev;
            });
          }
          return newDay;
        });
      }

      // Event progress
      if (activeEvent && !pendingDecision) {
        setEventProgress(p => {
          const next = p + 1;

          // Trigger a decision mid-event
          if (!decisionFired && next >= activeEvent.duration * 0.4 && next < activeEvent.duration * 0.6) {
            if (Math.random() < 0.3) {
              const dec = EVENT_DECISIONS[Math.floor(Math.random() * EVENT_DECISIONS.length)];
              setPendingDecision(dec);
              setDecisionFired(true);
            }
          }

          if (next >= activeEvent.duration) {
            const xpBoostLevel = getPrestigeBonus(prestigeData.upgrades, "xp_boost");
            const xpMult = Math.pow(1.2, xpBoostLevel);
            const finBonus = 1 + (deptBonuses.finance || 0) * 0.01;
            const mediaBonus = deptBonuses.media || 0;

            const moneyReward = Math.floor(activeEvent.baseMoney * eventQualityBonus * finBonus);
            const prestigeReward = Math.floor(activeEvent.basePrestige * eventQualityBonus + mediaBonus * 0.2);
            const xpReward = Math.floor(activeEvent.baseXp * xpMult);

            setMoney(m => m + moneyReward);
            setPrestige(pr => pr + prestigeReward);
            setXp(x => x + xpReward);
            setTotalEarned(t => t + moneyReward);
            setEventsCompleted(e => e + 1);

            updateGoal("events_planned");
            updateGoal("money_earned", moneyReward);
            updateGoal("prestige_earned", prestigeReward);

            if (activeEvent.bonusHappiness) {
              // Happiness bonus events — we just show notif, stats come from items
            }

            showNotif(`${activeEvent.emoji} ${activeEvent.name} tamamlandı! +💰${moneyReward} +⭐${prestigeReward}`, "success");
            setActiveEvent(null);
            setDecisionFired(false);
            return 0;
          }
          return next;
        });
      }

      // Random crisis
      const crisisShieldLevel = getPrestigeBonus(prestigeData.upgrades, "crisis_shield");
      const crisisDamageMultiplier = Math.pow(0.5, crisisShieldLevel);
      if (Math.random() < 0.005 && !activeCrisis) {
        const crisis = CRISES[Math.floor(Math.random() * CRISES.length)];
        setActiveCrisis(crisis);
        setCrisisTimer(crisis.duration);
        setMoney(m => Math.max(0, m + Math.floor(crisis.effect * crisisDamageMultiplier)));
        showNotif(crisis.text, "crisis");
      }

      // Crisis timer
      if (activeCrisis) {
        setCrisisTimer(t => {
          if (t <= 1) { setActiveCrisis(null); return 0; }
          return t - 1;
        });
      }

      // Passive prestige from items
      const mediaPrestigeBonus = 1 + (deptBonuses.media || 0) * 0.005;
      setPrestige(p => p + stats.prestige * 0.01 * mediaPrestigeBonus);
    }, 1000);

    return () => clearInterval(interval);
  }, [idleRate, visitorState, visitorQueue, spawnVisitor, activeEvent, stats, activeCrisis, showNotif, deptBonuses, eventQualityBonus, pendingDecision, decisionFired, updateGoal, prestigeData.upgrades]);

  // --- Close all overlays helper ---
  const closeAll = () => { setShowShop(false); setShowStats(false); setShowEvents(false); setShowGoals(false); setShowPrestige(false); };

  // --- Player department info for HUD ---
  const playerDeptData = useMemo(() => PLAYER_DEPTS.find(d => d.id === playerDept), [playerDept]);

  return (
    <div style={{
      width: "100%", maxWidth: GAME_W, height: GAME_H, margin: "0 auto",
      position: "relative", overflow: "hidden", borderRadius: 16,
      boxShadow: "0 8px 40px rgba(0,0,0,0.5)", fontFamily: "'Segoe UI', -apple-system, sans-serif", userSelect: "none",
    }}>
      <style>{`
        @keyframes bubblePop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>

      {/* ===== MENU PHASE ===== */}
      {gamePhase === "menu" && !showSettings && (
        <MainMenu
          hasSave={hasSave}
          onPlay={() => setGamePhase("dept_select")}
          onContinue={continueGame}
          onSettings={() => setShowSettings(true)}
        />
      )}

      {/* ===== SETTINGS (from menu) ===== */}
      {showSettings && (
        <SettingsOverlay
          onClose={() => setShowSettings(false)}
          onResetAll={resetAllData}
        />
      )}

      {/* ===== DEPARTMENT SELECT PHASE ===== */}
      {gamePhase === "dept_select" && (
        <DeptSelectScreen
          onSelect={startNewGame}
          onBack={() => setGamePhase("menu")}
        />
      )}

      {/* ===== PLAYING PHASE ===== */}
      {gamePhase === "playing" && (
        <>
          <OfficeBackground level={level} ownedItems={ownedItems} onItemClick={(id) => showNotif(`${OFFICE_ITEMS_DATA[id].emoji} ${OFFICE_ITEMS_DATA[id].name}`, "info")} />
          <PlayerCharacter />
          <CharacterSprite visitor={currentVisitor} position="counter" isLeaving={isLeaving} onClick={() => {}} />

          {dialogue && visitorState === "talking" && (
            <SpeechBubble text={dialogue} x={100} y={280} options={[
              { label: "✅ Kabul Et", action: "accept", color: "#10b981" },
              { label: "❌ Reddet", action: "reject", color: "#ef4444" },
            ]} onOption={handleResponse} />
          )}

          {responseDialogue && <SpeechBubble text={responseDialogue} x={260} y={260} />}

          {visitorState === "idle" && visitorQueue > 0 && !showShop && !showStats && !showEvents && !showGoals && !showPrestige && (
            <div style={{ position: "absolute", bottom: 140, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "rgba(15,23,42,0.8)", color: "#94a3b8", padding: "6px 14px", borderRadius: 10, fontSize: 11, fontWeight: 600, animation: "float 2s infinite", border: "1px solid #ffffff10" }}>
              👆 Ziyaretçi bekleniyor...
            </div>
          )}

          {visitorQueue <= 0 && visitorState === "idle" && !showShop && !showStats && !showEvents && !showGoals && !showPrestige && (
            <div style={{ position: "absolute", bottom: 140, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "rgba(15,23,42,0.8)", color: "#f59e0b", padding: "6px 14px", borderRadius: 10, fontSize: 11, fontWeight: 600, border: "1px solid #f59e0b30" }}>
              ☕ Kuyruk boş — biraz bekle
            </div>
          )}

          {activeCrisis && (
            <div style={{ position: "absolute", top: 60, left: 10, right: 10, zIndex: 350, background: "linear-gradient(135deg, rgba(239,68,68,0.9), rgba(245,158,11,0.9))", borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #fbbf2440" }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", flex: 1 }}>{activeCrisis.text}</span>
              <span style={{ fontSize: 10, color: "#fef3c7", fontWeight: 600 }}>{crisisTimer}s</span>
            </div>
          )}

          <GameHUD money={money} prestige={prestige} xp={xp} level={level} day={day} happiness={stats.happiness} idleRate={idleRate} season={prestigeData.season} onGoals={() => { closeAll(); setShowGoals(true); }} />

          {/* Player dept badge */}
          {playerDeptData && (
            <div style={{
              position: "absolute", top: 68, left: 8, zIndex: 310,
              background: `${playerDeptData.color}20`, border: `1px solid ${playerDeptData.color}40`,
              borderRadius: 8, padding: "2px 8px",
              fontSize: 9, fontWeight: 700, color: playerDeptData.color,
            }}>
              {playerDeptData.emoji} {playerDeptData.name}
            </div>
          )}

          <Notification text={notification} type={notifType} />

          <ActionBar
            onShop={() => { closeAll(); setShowShop(true); }}
            onEvents={() => { closeAll(); setShowEvents(true); }}
            onStats={() => { closeAll(); setShowStats(true); }}
            onPrestige={() => { closeAll(); setShowPrestige(true); }}
            activeEvent={activeEvent}
            eventProgress={eventProgress}
            eventDuration={activeEvent?.duration || 1}
            visitorCount={visitorQueue}
            day={day}
          />

          {/* Overlays */}
          {showShop && <ShopOverlay money={money} ownedItems={ownedItems} onBuy={buyItem} onClose={() => setShowShop(false)} />}
          {showEvents && <EventPlanOverlay money={money} ownedItems={ownedItems} stats={stats} members={members} activeEvent={activeEvent} prestigeUpgrades={prestigeData.upgrades} onStartEvent={startEvent} onClose={() => setShowEvents(false)} />}
          {showStats && <StatsOverlay stats={stats} members={members} eventsCompleted={eventsCompleted} totalEarned={totalEarned} level={level} deptBonuses={deptBonuses} onAssignDept={assignDept} onClose={() => setShowStats(false)} />}
          {showGoals && <GoalsOverlay goals={dailyGoals} onClose={() => setShowGoals(false)} />}
          {showPrestige && <PrestigeOverlay totalPrestige={prestigeData.totalPrestige + Math.floor(prestige)} upgrades={prestigeData.upgrades} season={prestigeData.season} onBuyUpgrade={buyPrestigeUpgrade} onNewSeason={startNewSeason} onClose={() => setShowPrestige(false)} />}

          {/* Event Decision popup */}
          {pendingDecision && <EventDecisionOverlay decision={pendingDecision} onDecide={handleEventDecision} />}
        </>
      )}
    </div>
  );
}
