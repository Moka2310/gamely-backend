export const COLORS = {
  // Primary colors (Tinder-like gradient)
  primary: '#FF6B6B',
  primaryDark: '#EE5A5A',
  secondary: '#FF8E53',
  
  // Gaming accents
  xbox: '#107C10',
  playstation: '#006FCD',
  pc: '#FF6B00',
  
  // Background
  background: '#0A0A0F',
  card: '#1A1A25',
  cardLight: '#252535',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#9A9AA8',
  textMuted: '#6B6B7B',
  
  // Status
  success: '#4ECDC4',
  error: '#FF6B6B',
  warning: '#FFE66D',
  
  // Others
  border: '#2A2A3A',
  overlay: 'rgba(0,0,0,0.7)',
  match: '#FF69B4',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const CONSOLES = [
  { id: 'xbox', name: 'Xbox', color: COLORS.xbox, icon: 'logo-xbox' },
  { id: 'ps5', name: 'PlayStation 5', color: COLORS.playstation, icon: 'logo-playstation' },
  { id: 'pc', name: 'PC', color: COLORS.pc, icon: 'desktop-outline' },
];

export const LOOKING_FOR_OPTIONS = [
  { id: 'ami_occasionnel', label: 'Ami Occasionnel', icon: 'game-controller-outline' },
  { id: 'ami_team', label: 'Ami de Team', icon: 'people-outline' },
  { id: 'ami_regulier', label: 'Ami Régulier', icon: 'heart-outline' },
];

export const POPULAR_GAMES = [
  'Fortnite', 'Call of Duty', 'FIFA', 'GTA V', 'Minecraft',
  'Apex Legends', 'Valorant', 'League of Legends', 'Rocket League',
  'Overwatch 2', 'Rainbow Six Siege', 'CS:GO', 'Elden Ring',
  'Destiny 2', 'Halo Infinite', 'God of War', 'Spider-Man 2',
  'Baldur\'s Gate 3', 'Diablo IV', 'World of Warcraft',
];

export const POPULAR_INTERESTS = [
  'RPG', 'FPS', 'MMORPG', 'Battle Royale', 'Sports', 'Racing',
  'Stratégie', 'Aventure', 'Horreur', 'Indie', 'Esports',
  'Streaming', 'Speedrun', 'Casual Gaming', 'Compétitif',
];

export const COUNTRIES = [
  'France', 'Belgique', 'Suisse', 'Canada', 'États-Unis',
  'Espagne', 'Allemagne', 'Royaume-Uni', 'Italie', 'Portugal',
  'Brésil', 'Mexique', 'Argentine', 'Japon', 'Corée du Sud',
  'Australie', 'Pays-Bas', 'Maroc', 'Algérie', 'Tunisie',
];

export const LANGUAGES = [
  { id: 'français', label: 'Français', flag: '🇫🇷' },
  { id: 'anglais', label: 'Anglais', flag: '🇬🇧' },
  { id: 'espagnol', label: 'Espagnol', flag: '🇪🇸' },
  { id: 'italien', label: 'Italien', flag: '🇮🇹' },
  { id: 'mandarin', label: 'Mandarin', flag: '🇨🇳' },
  { id: 'arabe', label: 'Arabe', flag: '🇸🇦' },
];

export const GENDERS = [
  { id: 'homme', label: 'Homme' },
  { id: 'femme', label: 'Femme' },
  { id: 'autre', label: 'Autre' },
];
