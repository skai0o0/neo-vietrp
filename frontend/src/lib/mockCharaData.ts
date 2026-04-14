/* ─────────────────────────────────────────────
   Mock data cho Zero-Text Character Generator
   Giả lập dữ liệu sẽ được trả từ Database
   ───────────────────────────────────────────── */

export type CategoryTheme = "anime" | "action" | "horror" | "romance" | "fantasy";

export interface Franchise {
  id: string;
  parodyName: string;        // Tên parody hiển thị trên UI
  theme: CategoryTheme;
  coverEmoji: string;         // Placeholder cho AI-art sau này
  coverColor: string;         // Gradient color đại diện
}

export interface CharacterBase {
  id: string;
  franchiseId: string;
  parodyName: string;         // Tên parody hiển thị
  avatarEmoji: string;        // Placeholder
  avatarColor: string;

  /* Base personality sliders (0–100) */
  baseTraits: {
    kindness: number;
    aggression: number;
    intelligence: number;
    humor: number;
    mystery: number;
    romance: number;
  };

  /* Base appearance sliders (0–100) */
  baseAppearance: {
    height: number;
    build: number;       // 0=mảnh mai, 100=cơ bắp
    charm: number;       // 0=cute, 100=sexy
    age: number;         // 0=trẻ, 100=trưởng thành
  };

  /* Slot machine custom options per character */
  customSlots?: {
    locations?: string[];
    statuses?: string[];
    relations?: string[];
  };
}

export interface SlotReel {
  id: string;
  label: string;
  options: string[];
}

export interface PronounPair {
  label: string;
  charPronoun: string;
  userPronoun: string;
}

/* ─── Franchises ─── */
export const FRANCHISES: Franchise[] = [
  // Anime
  { id: "f1", parodyName: "Trường Chú Thuật",        theme: "anime",   coverEmoji: "🏫", coverColor: "linear-gradient(135deg, #1a0533, #2d1b69)" },
  { id: "f2", parodyName: "Kỷ Nguyên Hải Tặc",       theme: "anime",   coverEmoji: "🏴‍☠️", coverColor: "linear-gradient(135deg, #1a0a00, #8b4513)" },
  { id: "f3", parodyName: "Thế Giới Titan",           theme: "anime",   coverEmoji: "🏰", coverColor: "linear-gradient(135deg, #1a1a0a, #4a4a0a)" },
  { id: "f4", parodyName: "Ma Sát Đao",               theme: "anime",   coverEmoji: "⚔️", coverColor: "linear-gradient(135deg, #0a1a2a, #1a3a5a)" },
  { id: "f5", parodyName: "Pháp Sư Hành Trình",       theme: "anime",   coverEmoji: "🧙", coverColor: "linear-gradient(135deg, #0a2a1a, #1a5a3a)" },
  { id: "f6", parodyName: "Học Viện Anh Hùng",        theme: "anime",   coverEmoji: "💥", coverColor: "linear-gradient(135deg, #2a0a0a, #5a1a1a)" },
  // Action
  { id: "f7", parodyName: "Thành Phố Tội Ác",         theme: "action",  coverEmoji: "🔫", coverColor: "linear-gradient(135deg, #0a0a1a, #1a1a3a)" },
  { id: "f8", parodyName: "Chiến Tranh Ngôi Sao",     theme: "action",  coverEmoji: "⭐", coverColor: "linear-gradient(135deg, #000510, #0a1530)" },
  // Horror
  { id: "f9", parodyName: "Trường Học Ma Ám",         theme: "horror",  coverEmoji: "👻", coverColor: "linear-gradient(135deg, #0a0a0a, #1a0a1a)" },
  { id: "f10", parodyName: "Ngôi Làng Câm Lặng",     theme: "horror",  coverEmoji: "🌫️", coverColor: "linear-gradient(135deg, #111111, #1a1a1a)" },
  // Romance
  { id: "f11", parodyName: "Mùa Xuân Thanh Xuân",    theme: "romance", coverEmoji: "🌸", coverColor: "linear-gradient(135deg, #2a0a1a, #5a1a3a)" },
  { id: "f12", parodyName: "Quý Ngài Bá Tước",       theme: "romance", coverEmoji: "🌹", coverColor: "linear-gradient(135deg, #1a0a0a, #3a1a2a)" },
  // Fantasy
  { id: "f13", parodyName: "Vương Quốc Rồng",        theme: "fantasy", coverEmoji: "🐉", coverColor: "linear-gradient(135deg, #0a1a0a, #1a3a1a)" },
  { id: "f14", parodyName: "Thế Giới Game Thần",      theme: "fantasy", coverEmoji: "🎮", coverColor: "linear-gradient(135deg, #1a0a2a, #3a1a5a)" },
];

/* ─── Characters ─── */
export const CHARACTERS: CharacterBase[] = [
  // Trường Chú Thuật (f1)
  {
    id: "c1", franchiseId: "f1", parodyName: "Thầy Giáo Bịt Mắt",  avatarEmoji: "😎", avatarColor: "#6366f1",
    baseTraits: { kindness: 60, aggression: 30, intelligence: 95, humor: 80, mystery: 90, romance: 40 },
    baseAppearance: { height: 85, build: 65, charm: 90, age: 65 },
    customSlots: { locations: ["Lãnh địa vô lượng", "Phòng giáo viên", "Shibuya đổ nát"], statuses: ["Đang dùng Lĩnh Vực", "Chiến đấu ngang sức"], relations: ["Sư phụ & đệ tử", "Đồng minh bất đắc dĩ"] },
  },
  {
    id: "c2", franchiseId: "f1", parodyName: "Chàng Trai Ngón Tay", avatarEmoji: "✋", avatarColor: "#ec4899",
    baseTraits: { kindness: 80, aggression: 60, intelligence: 50, humor: 40, mystery: 30, romance: 50 },
    baseAppearance: { height: 60, build: 55, charm: 50, age: 30 },
    customSlots: { locations: ["Sân trường chú thuật", "Hang ổ nguyền sư"], statuses: ["Đang mất kiểm soát", "Bình thản đáng sợ"], relations: ["Bạn cùng lớp", "Đồng đội chiến đấu"] },
  },
  {
    id: "c3", franchiseId: "f1", parodyName: "Cô Gái Gai Hồng", avatarEmoji: "🌹", avatarColor: "#f43f5e",
    baseTraits: { kindness: 30, aggression: 70, intelligence: 80, humor: 20, mystery: 60, romance: 55 },
    baseAppearance: { height: 55, build: 40, charm: 85, age: 30 },
  },
  // Kỷ Nguyên Hải Tặc (f2)
  {
    id: "c4", franchiseId: "f2", parodyName: "Thuyền Trưởng Mũ Rơm", avatarEmoji: "🎩", avatarColor: "#ef4444",
    baseTraits: { kindness: 95, aggression: 50, intelligence: 30, humor: 90, mystery: 10, romance: 20 },
    baseAppearance: { height: 55, build: 60, charm: 40, age: 35 },
    customSlots: { locations: ["Trên boong tàu", "Đảo hoang", "Nhà tù dưới biển"], statuses: ["Đang đói lả", "Hưng phấn chiến đấu"], relations: ["Thuyền trưởng & thủy thủ", "Kẻ thù truyền kiếp"] },
  },
  {
    id: "c5", franchiseId: "f2", parodyName: "Kiếm Khách Đầu Rêu", avatarEmoji: "⚔️", avatarColor: "#22c55e",
    baseTraits: { kindness: 40, aggression: 75, intelligence: 60, humor: 30, mystery: 50, romance: 35 },
    baseAppearance: { height: 70, build: 85, charm: 70, age: 40 },
    customSlots: { locations: ["Phòng tập trên tàu", "Giữa biển bão"], statuses: ["Vừa lạc đường", "Đang tập luyện say mê"], relations: ["Đối thủ kiếm thuật", "Đồng đội tin tưởng"] },
  },
  // Thế Giới Titan (f3)
  {
    id: "c6", franchiseId: "f3", parodyName: "Binh Sĩ Mạnh Nhất", avatarEmoji: "🗡️", avatarColor: "#64748b",
    baseTraits: { kindness: 15, aggression: 90, intelligence: 85, humor: 10, mystery: 80, romance: 30 },
    baseAppearance: { height: 45, build: 80, charm: 60, age: 70 },
  },
  {
    id: "c7", franchiseId: "f3", parodyName: "Nữ Hoàng Lịch Sử", avatarEmoji: "📖", avatarColor: "#f59e0b",
    baseTraits: { kindness: 50, aggression: 40, intelligence: 90, humor: 20, mystery: 60, romance: 45 },
    baseAppearance: { height: 55, build: 30, charm: 50, age: 35 },
  },
  // Ma Sát Đao (f4)
  {
    id: "c8", franchiseId: "f4", parodyName: "Cậu Bé Hoa Tai",  avatarEmoji: "🌊", avatarColor: "#06b6d4",
    baseTraits: { kindness: 90, aggression: 40, intelligence: 60, humor: 30, mystery: 20, romance: 40 },
    baseAppearance: { height: 50, build: 50, charm: 55, age: 25 },
  },
  // Pháp Sư Hành Trình (f5)
  {
    id: "c9", franchiseId: "f5", parodyName: "Yêu Tinh Ngủ Gật", avatarEmoji: "😴", avatarColor: "#a3e635",
    baseTraits: { kindness: 45, aggression: 10, intelligence: 99, humor: 20, mystery: 85, romance: 15 },
    baseAppearance: { height: 50, build: 20, charm: 70, age: 95 },
  },
  {
    id: "c10", franchiseId: "f5", parodyName: "Học Trò Tóc Hồng", avatarEmoji: "💗", avatarColor: "#f472b6",
    baseTraits: { kindness: 60, aggression: 35, intelligence: 75, humor: 25, mystery: 30, romance: 60 },
    baseAppearance: { height: 50, build: 30, charm: 65, age: 30 },
  },
  // Học Viện Anh Hùng (f6)
  {
    id: "c11", franchiseId: "f6", parodyName: "Cậu Bé Tóc Xanh", avatarEmoji: "💚", avatarColor: "#4ade80",
    baseTraits: { kindness: 95, aggression: 30, intelligence: 70, humor: 40, mystery: 10, romance: 50 },
    baseAppearance: { height: 50, build: 55, charm: 45, age: 25 },
  },
  // Thành Phố Tội Ác (f7)
  {
    id: "c12", franchiseId: "f7", parodyName: "Thám Tử Bóng Đêm", avatarEmoji: "🦇", avatarColor: "#1e293b",
    baseTraits: { kindness: 50, aggression: 60, intelligence: 95, humor: 15, mystery: 99, romance: 30 },
    baseAppearance: { height: 80, build: 80, charm: 75, age: 70 },
  },
  // Trường Học Ma Ám (f9)
  {
    id: "c13", franchiseId: "f9", parodyName: "Cô Bạn Cùng Bàn Xanh", avatarEmoji: "💀", avatarColor: "#475569",
    baseTraits: { kindness: 70, aggression: 10, intelligence: 50, humor: 30, mystery: 95, romance: 60 },
    baseAppearance: { height: 50, build: 20, charm: 80, age: 25 },
  },
  // Mùa Xuân Thanh Xuân (f11)
  {
    id: "c14", franchiseId: "f11", parodyName: "Idol Mắt Hổ Phách", avatarEmoji: "🌟", avatarColor: "#fbbf24",
    baseTraits: { kindness: 80, aggression: 10, intelligence: 60, humor: 70, mystery: 20, romance: 90 },
    baseAppearance: { height: 55, build: 25, charm: 95, age: 30 },
  },
  // Vương Quốc Rồng (f13)
  {
    id: "c15", franchiseId: "f13", parodyName: "Nữ Chiến Binh Bạc", avatarEmoji: "⚔️", avatarColor: "#a8a29e",
    baseTraits: { kindness: 35, aggression: 85, intelligence: 70, humor: 15, mystery: 50, romance: 40 },
    baseAppearance: { height: 65, build: 70, charm: 75, age: 50 },
  },
];

/* ─── Default Slot Reels ─── */
export const DEFAULT_SLOT_REELS: SlotReel[] = [
  {
    id: "location",
    label: "📍 Địa điểm",
    options: [
      "Hẻm tối giữa đêm mưa",
      "Quán cà phê vắng vẻ",
      "Phòng ngủ lúc 3 giờ sáng",
      "Giữa chiến trường đổ nát",
      "Trên mái nhà hoàng hôn",
      "Thư viện cổ bụi bặm",
      "Nhà tắm công cộng",
      "Rừng sâu dưới trăng",
      "Phòng giam tăm tối",
      "Bãi biển vắng người",
    ],
  },
  {
    id: "status",
    label: "💫 Trạng thái",
    options: [
      "Đang bị thương nặng",
      "Say khướt lảo đảo",
      "Ghen tuông điên cuồng",
      "Đang thay đồ dở dang",
      "Mất trí nhớ hoàn toàn",
      "Đang khóc sụt sùi",
      "Lạnh lùng kiêu ngạo",
      "Run rẩy sợ hãi",
      "Đang ngủ gục",
      "Tức giận bùng nổ",
    ],
  },
  {
    id: "relation",
    label: "💞 Quan hệ",
    options: [
      "Kẻ thù không đội trời chung",
      "Bạn thơ ấu tái ngộ",
      "Chủ - Tớ",
      "Người yêu cũ",
      "Hoàn toàn xa lạ",
      "Sư phụ - Đệ tử",
      "Đồng minh miễn cưỡng",
      "Anh chị em thất lạc",
      "Đối tác công việc",
      "Quý nhân cứu mạng",
    ],
  },
];

/* ─── Pronoun Pairs ─── */
export const PRONOUN_PAIRS: PronounPair[] = [
  { label: "Anh - Em",      charPronoun: "Anh", userPronoun: "Em" },
  { label: "Em - Anh",      charPronoun: "Em",  userPronoun: "Anh" },
  { label: "Chị - Em",      charPronoun: "Chị", userPronoun: "Em" },
  { label: "Em - Chị",      charPronoun: "Em",  userPronoun: "Chị" },
  { label: "Tôi - Cậu",     charPronoun: "Tôi", userPronoun: "Cậu" },
  { label: "Cậu - Tớ",      charPronoun: "Cậu", userPronoun: "Tớ" },
  { label: "Ta - Ngươi",     charPronoun: "Ta",  userPronoun: "Ngươi" },
  { label: "Bản Tôn - Ngươi", charPronoun: "Bản Tôn", userPronoun: "Ngươi" },
  { label: "Thiếp - Chàng",  charPronoun: "Thiếp", userPronoun: "Chàng" },
  { label: "Nô tài - Chủ nhân", charPronoun: "Nô tài", userPronoun: "Chủ nhân" },
  { label: "Ore - Omae (JP)", charPronoun: "Ore", userPronoun: "Omae" },
  { label: "Watashi - Anata (JP)", charPronoun: "Watashi", userPronoun: "Anata" },
];

/* ─── AI Force Behaviour ─── */
export const AI_BEHAVIOURS = [
  { id: "long",     label: "Viết dài & chi tiết",        icon: "📝" },
  { id: "nsfw",     label: "Đẩy nhịp NSFW",             icon: "🔞" },
  { id: "secrets",  label: "Giữ bí mật & ẩn ý",         icon: "🤫" },
  { id: "comedy",   label: "Pha trộn hài hước",          icon: "😂" },
  { id: "dark",     label: "Tối tăm & bi kịch",          icon: "🖤" },
  { id: "action",   label: "Nhiều hành động",            icon: "⚡" },
  { id: "slow",     label: "Chậm rãi tình cảm",         icon: "💕" },
  { id: "yandere",  label: "Xu hướng Yandere",           icon: "🔪" },
];

export const CATEGORY_LABELS: Record<CategoryTheme, string> = {
  anime: "Anime",
  action: "Hành Động",
  horror: "Kinh Dị",
  romance: "Ngôn Tình",
  fantasy: "Fantasy",
};
